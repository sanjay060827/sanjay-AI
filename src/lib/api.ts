import { supabase, MenuItem, Order, Student, Complaint, Offer, CartItem } from './supabase';

// Menu Items API
export const menuApi = {
  // Get all menu items
  async getAll() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data as MenuItem[];
  },

  // Get menu item by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as MenuItem;
  },

  // Get menu items by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .eq('available', true);
    
    if (error) throw error;
    return data as MenuItem[];
  },

  // Create new menu item (Admin only)
  async create(item: Omit<MenuItem, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data as MenuItem;
  },

  // Update menu item (Admin only)
  async update(id: string, updates: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as MenuItem;
  },

  // Delete menu item (Admin only)
  async delete(id: string) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Orders API
export const ordersApi = {
  // Create new order
  async create(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  // Get orders by user
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  // Get order by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  // Update order status
  async updateStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  // Get all orders (Admin only)
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  }
};

// Students API
export const studentsApi = {
  // Register new student
  async register(studentData: Omit<Student, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  // Get student by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  // Get student by student ID
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();
    
    if (error) throw error;
    return data as Student;
  },

  // Get all students (Admin only)
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Student[];
  }
};

// Complaints API
export const complaintsApi = {
  // Create new complaint
  async create(complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaintData])
      .select()
      .single();
    
    if (error) throw error;
    return data as Complaint;
  },

  // Get complaints by user
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Complaint[];
  },

  // Update complaint status
  async updateStatus(id: string, status: Complaint['status']) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Complaint;
  },

  // Get all complaints (Admin only)
  async getAll() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Complaint[];
  }
};

// Offers API
export const offersApi = {
  // Get active offers
  async getActive() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('active', true)
      .lte('valid_from', now)
      .gte('valid_until', now)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Offer[];
  },

  // Get all offers (Admin only)
  async getAll() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Offer[];
  },

  // Create new offer (Admin only)
  async create(offerData: Omit<Offer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();
    
    if (error) throw error;
    return data as Offer;
  },

  // Update offer (Admin only)
  async update(id: string, updates: Partial<Offer>) {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Offer;
  },

  // Delete offer (Admin only)
  async delete(id: string) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
