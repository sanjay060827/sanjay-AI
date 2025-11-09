import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  student_id: string;
  phone?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
  created_at: string;
}
