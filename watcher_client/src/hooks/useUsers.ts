import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';
import type { UserInput } from '../lib/validation';

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  departmentId?: number;
  isActive?: boolean;
}

export function useUsers(filters?: UserFilters) {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const endpoint = filters ? '/watcher/manage/users/paged' : '/watcher/manage/users';
      const response = await api.get(endpoint, { params: filters });
      return response.data;
    },
  });

  const user = (id: number) =>
    useQuery({
      queryKey: ['user', id],
      queryFn: async () => {
        const response = await api.get(`/watcher/manage/users/${id}`);
        return response.data.data;
      },
      enabled: !!id,
    });

  const createUser = useMutation({
    mutationFn: async (data: UserInput) => {
      const response = await api.post('/watcher/manage/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserInput> }) => {
      const response = await api.put(`/watcher/manage/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User updated successfully');
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/watcher/manage/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
  });

  return {
    users,
    user,
    createUser,
    updateUser,
    deleteUser,
  };
}
