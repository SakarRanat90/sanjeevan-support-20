-- Fix security warnings by setting search_path for functions

-- Update check_vitals_alert function with proper security settings
CREATE OR REPLACE FUNCTION public.check_vitals_alert()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Set alert flag if vitals are outside normal ranges
  NEW.alert_flag := (
    NEW.heart_rate < 60 OR NEW.heart_rate > 120 OR
    NEW.temperature > 38.0 OR
    NEW.spo2 < 92
  );
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update get_next_medication_schedule function with proper security settings
CREATE OR REPLACE FUNCTION public.get_next_medication_schedule(p_user_id UUID)
RETURNS TABLE (
  medication_id UUID,
  medication_name TEXT,
  dosage TEXT,
  next_time TIME,
  next_date DATE
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;