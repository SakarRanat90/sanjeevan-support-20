-- Add missing DELETE policies for critical tables

-- Allow users to delete their own medication logs
CREATE POLICY "Users can delete their own medication logs" 
ON public.medication_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to delete their own profiles
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Allow users to delete their own vitals
CREATE POLICY "Users can delete their own vitals" 
ON public.vitals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add input validation function for vitals (correct RAISE EXCEPTION syntax)
CREATE OR REPLACE FUNCTION public.validate_vitals_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate heart rate range (40-220 bpm)
  IF NEW.heart_rate < 40 OR NEW.heart_rate > 220 THEN
    RAISE EXCEPTION 'Invalid heart rate: must be between 40-220 bpm' USING ERRCODE = 'check_violation';
  END IF;
  
  -- Validate temperature range (30-45°C)
  IF NEW.temperature < 30.0 OR NEW.temperature > 45.0 THEN
    RAISE EXCEPTION 'Invalid temperature: must be between 30-45°C' USING ERRCODE = 'check_violation';
  END IF;
  
  -- Validate SpO2 range (70-100%)
  IF NEW.spo2 < 70 OR NEW.spo2 > 100 THEN
    RAISE EXCEPTION 'Invalid SpO2: must be between 70-100%' USING ERRCODE = 'check_violation';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger for vitals
CREATE TRIGGER validate_vitals_before_insert_update
  BEFORE INSERT OR UPDATE ON public.vitals
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_vitals_input();

-- Create audit log table for security monitoring
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow reading audit logs (no modifications)
CREATE POLICY "System can read all audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (true);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    operation,
    old_data,
    new_data
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_vitals
  AFTER INSERT OR UPDATE OR DELETE ON public.vitals
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_medications
  AFTER INSERT OR UPDATE OR DELETE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_medication_logs
  AFTER INSERT OR UPDATE OR DELETE ON public.medication_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger();