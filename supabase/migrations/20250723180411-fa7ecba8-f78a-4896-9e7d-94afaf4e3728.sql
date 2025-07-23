-- Create user profiles table for patient information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  contact_number TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  address TEXT NOT NULL,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  known_diseases TEXT[],
  current_medications TEXT[],
  allergy_history TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vitals table for health monitoring
CREATE TABLE public.vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  heart_rate INTEGER NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  temperature DECIMAL(4,2) NOT NULL CHECK (temperature > 30 AND temperature < 50),
  spo2 INTEGER NOT NULL CHECK (spo2 > 0 AND spo2 <= 100),
  alert_flag BOOLEAN NOT NULL DEFAULT false,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medications table for medication management
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  schedule_times TIME[],
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication logs table for tracking doses taken
CREATE TABLE public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID NOT NULL REFERENCES public.medications ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create RLS policies for vitals
CREATE POLICY "Users can view their own vitals" 
ON public.vitals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vitals" 
ON public.vitals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vitals" 
ON public.vitals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for medications
CREATE POLICY "Users can view their own medications" 
ON public.medications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medications" 
ON public.medications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" 
ON public.medications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" 
ON public.medications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for medication logs
CREATE POLICY "Users can view their own medication logs" 
ON public.medication_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication logs" 
ON public.medication_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to automatically set alert flags for vitals
CREATE OR REPLACE FUNCTION public.check_vitals_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Set alert flag if vitals are outside normal ranges
  NEW.alert_flag := (
    NEW.heart_rate < 60 OR NEW.heart_rate > 120 OR
    NEW.temperature > 38.0 OR
    NEW.spo2 < 92
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic alert flag setting
CREATE TRIGGER set_vitals_alert
  BEFORE INSERT OR UPDATE ON public.vitals
  FOR EACH ROW
  EXECUTE FUNCTION public.check_vitals_alert();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get next medication schedule for a user
CREATE OR REPLACE FUNCTION public.get_next_medication_schedule(p_user_id UUID)
RETURNS TABLE (
  medication_id UUID,
  medication_name TEXT,
  dosage TEXT,
  next_time TIME,
  next_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.medication_name,
    m.dosage,
    UNNEST(m.schedule_times) as next_time,
    CURRENT_DATE as next_date
  FROM public.medications m
  WHERE m.user_id = p_user_id 
    AND m.is_active = true
    AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
  ORDER BY next_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;