import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi, ordersApi, studentsApi, complaintsApi, offersApi } from '@/lib/api';
import { MenuItem, Order, Student, Complaint, Offer } from '@/lib/supabase';

// Menu Items Hooks
export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menuItems'],
    queryFn: menuApi.getAll,
  });
};

export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['menuItems', category],
    queryFn: () => menuApi.getByCategory(category),
    enabled: !!category,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) =>
      menuApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};

// Orders Hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => ordersApi.getByUser(userId),
    enabled: !!userId,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: ordersApi.getAll,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Students Hooks
export const useRegisterStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
};

export const useAllStudents = () => {
  return useQuery({
    queryKey: ['students', 'all'],
    queryFn: studentsApi.getAll,
  });
};

// Complaints Hooks
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: complaintsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

export const useUserComplaints = (userId: string) => {
  return useQuery({
    queryKey: ['complaints', userId],
    queryFn: () => complaintsApi.getByUser(userId),
    enabled: !!userId,
  });
};

export const useAllComplaints = () => {
  return useQuery({
    queryKey: ['complaints', 'all'],
    queryFn: complaintsApi.getAll,
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Complaint['status'] }) =>
      complaintsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

// Offers Hooks
export const useActiveOffers = () => {
  return useQuery({
    queryKey: ['offers', 'active'],
    queryFn: offersApi.getActive,
  });
};

export const useAllOffers = () => {
  return useQuery({
    queryKey: ['offers', 'all'],
    queryFn: offersApi.getAll,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Offer> }) =>
      offersApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: offersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};
