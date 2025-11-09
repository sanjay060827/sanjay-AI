-- Database Schema for Restaurant/Canteen Application
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES students(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);
CREATE INDEX IF NOT EXISTS idx_offers_dates ON offers(valid_from, valid_until);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, available) VALUES
  ('Veggie Burger', 'Delicious vegetarian burger with fresh vegetables', 5.99, 'Main Course', true),
  ('Chicken Sandwich', 'Grilled chicken sandwich with lettuce and tomato', 6.99, 'Main Course', true),
  ('Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 4.99, 'Salads', true),
  ('French Fries', 'Crispy golden french fries', 2.99, 'Sides', true),
  ('Chocolate Cake', 'Rich chocolate cake with frosting', 3.99, 'Desserts', true),
  ('Coca Cola', 'Chilled soft drink', 1.99, 'Beverages', true),
  ('Fresh Orange Juice', 'Freshly squeezed orange juice', 2.99, 'Beverages', true),
  ('Margherita Pizza', 'Classic pizza with tomato and mozzarella', 8.99, 'Main Course', true),
  ('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 7.99, 'Main Course', true),
  ('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce', 3.49, 'Desserts', true)
ON CONFLICT DO NOTHING;

-- Insert sample offers
INSERT INTO offers (title, description, discount_percentage, valid_from, valid_until, active) VALUES
  ('Weekend Special', 'Get 20% off on all orders this weekend!', 20, NOW(), NOW() + INTERVAL '7 days', true),
  ('Student Discount', 'Special 15% discount for students', 15, NOW(), NOW() + INTERVAL '30 days', true)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to menu items and offers
CREATE POLICY "Allow public read access to menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to offers" ON offers
  FOR SELECT USING (true);

-- Create policies for students (users can read their own data)
CREATE POLICY "Users can view their own student data" ON students
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own student data" ON students
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create policies for orders (users can manage their own orders)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create policies for complaints (users can manage their own complaints)
CREATE POLICY "Users can view their own complaints" ON complaints
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own complaints" ON complaints
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
