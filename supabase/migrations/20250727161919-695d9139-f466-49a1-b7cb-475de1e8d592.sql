-- Create stalls table
CREATE TABLE public.stalls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stall_id UUID NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  preparation_time INTEGER DEFAULT 10, -- minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student profiles table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  year INTEGER,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  stall_id UUID NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pickup_time_slot TIMESTAMP WITH TIME ZONE NOT NULL,
  order_token TEXT NOT NULL UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for stalls (public read, owner write)
CREATE POLICY "Anyone can view active stalls" 
ON public.stalls 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Stall owners can manage their stalls" 
ON public.stalls 
FOR ALL 
USING (auth.jwt() ->> 'email' = owner_email);

-- RLS policies for products (public read, stall owner write)
CREATE POLICY "Anyone can view available products" 
ON public.products 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Stall owners can manage their products" 
ON public.products 
FOR ALL 
USING (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = auth.jwt() ->> 'email'
));

-- RLS policies for student profiles
CREATE POLICY "Students can view their own profile" 
ON public.student_profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Students can update their own profile" 
ON public.student_profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can create student profile" 
ON public.student_profiles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- RLS policies for orders
CREATE POLICY "Students can view their own orders" 
ON public.orders 
FOR SELECT 
USING (student_id IN (
  SELECT id FROM public.student_profiles 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Students can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (student_id IN (
  SELECT id FROM public.student_profiles 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Stall owners can view orders for their stalls" 
ON public.orders 
FOR SELECT 
USING (stall_id IN (
  SELECT id FROM public.stalls 
  WHERE owner_email = auth.jwt() ->> 'email'
));

-- RLS policies for order items
CREATE POLICY "Students can view their order items" 
ON public.order_items 
FOR SELECT 
USING (order_id IN (
  SELECT id FROM public.orders 
  WHERE student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Students can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (order_id IN (
  SELECT id FROM public.orders 
  WHERE student_id IN (
    SELECT id FROM public.student_profiles 
    WHERE user_id = auth.uid()
  )
));

-- Create triggers for updated_at
CREATE TRIGGER update_stalls_updated_at
  BEFORE UPDATE ON public.stalls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample stalls
INSERT INTO public.stalls (name, floor_number, description, owner_email, owner_phone) VALUES
('Tasty Bites', 1, 'Delicious snacks and beverages', 'tastybites@college.edu', '+91-9876543210'),
('Healthy Corner', 2, 'Fresh salads and healthy options', 'healthycorner@college.edu', '+91-9876543211'),
('Spice Zone', 1, 'Spicy Indian street food', 'spicezone@college.edu', '+91-9876543212'),
('Sweet Treats', 3, 'Desserts and sweet snacks', 'sweettreats@college.edu', '+91-9876543213'),
('Coffee Hub', 2, 'Coffee, tea and light snacks', 'coffeehub@college.edu', '+91-9876543214');

-- Insert sample products
INSERT INTO public.products (stall_id, name, description, price, category, preparation_time) VALUES
-- Tasty Bites (Floor 1)
((SELECT id FROM public.stalls WHERE name = 'Tasty Bites'), 'Samosa', 'Crispy triangular pastry with spiced filling', 15.00, 'snacks', 5),
((SELECT id FROM public.stalls WHERE name = 'Tasty Bites'), 'Veg Sandwich', 'Grilled sandwich with fresh vegetables', 35.00, 'sandwich', 8),
((SELECT id FROM public.stalls WHERE name = 'Tasty Bites'), 'Aloo Tikki Burger', 'Spiced potato patty burger', 45.00, 'burger', 10),
((SELECT id FROM public.stalls WHERE name = 'Tasty Bites'), 'Masala Chai', 'Traditional Indian tea with spices', 12.00, 'beverages', 3),

-- Healthy Corner (Floor 2)
((SELECT id FROM public.stalls WHERE name = 'Healthy Corner'), 'Greek Salad', 'Fresh salad with feta cheese and olives', 65.00, 'salad', 5),
((SELECT id FROM public.stalls WHERE name = 'Healthy Corner'), 'Fruit Bowl', 'Mix of seasonal fresh fruits', 40.00, 'healthy', 2),
((SELECT id FROM public.stalls WHERE name = 'Healthy Corner'), 'Veggie Wrap', 'Whole wheat wrap with fresh vegetables', 50.00, 'wrap', 7),
((SELECT id FROM public.stalls WHERE name = 'Healthy Corner'), 'Green Smoothie', 'Spinach, apple and banana smoothie', 35.00, 'beverages', 4),

-- Spice Zone (Floor 1)
((SELECT id FROM public.stalls WHERE name = 'Spice Zone'), 'Pav Bhaji', 'Spicy vegetable curry with bread rolls', 55.00, 'indian', 12),
((SELECT id FROM public.stalls WHERE name = 'Spice Zone'), 'Chole Bhature', 'Spiced chickpeas with fried bread', 60.00, 'indian', 15),
((SELECT id FROM public.stalls WHERE name = 'Spice Zone'), 'Dosa', 'South Indian crepe with coconut chutney', 45.00, 'south-indian', 10),
((SELECT id FROM public.stalls WHERE name = 'Spice Zone'), 'Paneer Roll', 'Spiced cottage cheese wrapped in roti', 50.00, 'roll', 8),

-- Sweet Treats (Floor 3)
((SELECT id FROM public.stalls WHERE name = 'Sweet Treats'), 'Chocolate Brownie', 'Rich chocolate brownie with nuts', 30.00, 'dessert', 2),
((SELECT id FROM public.stalls WHERE name = 'Sweet Treats'), 'Gulab Jamun', 'Traditional sweet dumplings in syrup', 25.00, 'dessert', 1),
((SELECT id FROM public.stalls WHERE name = 'Sweet Treats'), 'Ice Cream Scoop', 'Vanilla, chocolate or strawberry', 20.00, 'dessert', 1),
((SELECT id FROM public.stalls WHERE name = 'Sweet Treats'), 'Kulfi', 'Traditional Indian ice cream', 22.00, 'dessert', 1),

-- Coffee Hub (Floor 2)
((SELECT id FROM public.stalls WHERE name = 'Coffee Hub'), 'Cappuccino', 'Espresso with steamed milk foam', 35.00, 'coffee', 5),
((SELECT id FROM public.stalls WHERE name = 'Coffee Hub'), 'Cold Coffee', 'Iced coffee with milk and sugar', 30.00, 'coffee', 3),
((SELECT id FROM public.stalls WHERE name = 'Coffee Hub'), 'Maggi Noodles', 'Instant noodles with vegetables', 25.00, 'snacks', 7),
((SELECT id FROM public.stalls WHERE name = 'Coffee Hub'), 'Garlic Bread', 'Toasted bread with garlic butter', 28.00, 'snacks', 6),
((SELECT id FROM public.stalls WHERE name = 'Coffee Hub'), 'Pasta', 'Italian pasta with tomato sauce', 55.00, 'pasta', 12);