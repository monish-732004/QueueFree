-- Fix function search path security issues
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.update_daily_sales() SET search_path = '';