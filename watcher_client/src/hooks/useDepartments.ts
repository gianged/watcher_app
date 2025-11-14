import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';
import type { DepartmentInput } from '../lib/validation';

interface DepartmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useDepartments(filters?: DepartmentFilters) {
  const queryClient = useQueryClient();

  const departments = useQuery({
    queryKey: ['departments', filters],
    queryFn: async () => {
      const endpoint = filters ? '/watcher/manage/departments/paged' : '/watcher/manage/departments';
      const response = await api.get(endpoint, { params: filters });
      return response.data;
    },
  });

  const department = (id: number) =>
    useQuery({
      queryKey: ['department', id],
      queryFn: async () => {
        const response = await api.get(`/watcher/manage/departments/${id}`);
        return response.data.data;
      },
      enabled: !!id,
    });

  const createDepartment = useMutation({
    mutationFn: async (data: DepartmentInput) => {
      const response = await api.post('/watcher/manage/departments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
    },
  });

  const updateDepartment = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DepartmentInput> }) => {
      const response = await api.put(`/watcher/manage/departments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department'] });
      toast.success('Department updated successfully');
    },
  });

  const deleteDepartment = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/watcher/manage/departments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
    },
  });

  return {
    departments,
    department,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}
