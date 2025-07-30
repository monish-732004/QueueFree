-- Add operating hours and sales tracking to stalls table
ALTER TABLE public.stalls 
ADD COLUMN opening_time TIME,
ADD COLUMN closing_time TIME,
ADD COLUMN operating_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
ADD COLUMN is_registered BOOLEAN DEFAULT FALSE;

-- Create daily sales reports table
CREATE TABLE public.daily_sales_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stall_id UUID NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stall_id, report_date)
);

-- Enable RLS on daily_sales_reports
ALTER TABLE public.daily_sales_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_sales_reports
CREATE POLICY "Stall owners can view their own sales reports" 
ON public.daily_sales_reports 
FOR SELECT 
USING (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = (auth.jwt() ->> 'email'::text)
));

CREATE POLICY "Stall owners can insert their own sales reports" 
ON public.daily_sales_reports 
FOR INSERT 
WITH CHECK (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = (auth.jwt() ->> 'email'::text)
));

CREATE POLICY "Stall owners can update their own sales reports" 
ON public.daily_sales_reports 
FOR UPDATE 
USING (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = (auth.jwt() ->> 'email'::text)
));

-- Add trigger to update daily sales when orders are completed
CREATE OR REPLACE FUNCTION public.update_daily_sales()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if order status changed to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO public.daily_sales_reports (stall_id, report_date, total_orders, total_revenue)
    VALUES (NEW.stall_id, CURRENT_DATE, 1, NEW.total_amount)
    ON CONFLICT (stall_id, report_date)
    DO UPDATE SET
      total_orders = daily_sales_reports.total_orders + 1,
      total_revenue = daily_sales_reports.total_revenue + NEW.total_amount,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_sales_trigger
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_sales();

-- Allow stall owners to update order status
CREATE POLICY "Stall owners can update order status" 
ON public.orders 
FOR UPDATE 
USING (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = (auth.jwt() ->> 'email'::text)
));