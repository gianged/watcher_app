import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';
import type { AnnounceInput } from '../lib/validation';

interface AnnounceFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isPinned?: boolean;
}

export function useAnnounces(filters?: AnnounceFilters) {
  const queryClient = useQueryClient();

  const announces = useQuery({
    queryKey: ['announces', filters],
    queryFn: async () => {
      const endpoint = filters ? '/watcher/manage/announces/paged' : '/watcher/manage/announces';
      const response = await api.get(endpoint, { params: filters });
      return response.data;
    },
  });

  const announce = (id: number) =>
    useQuery({
      queryKey: ['announce', id],
      queryFn: async () => {
        const response = await api.get(`/watcher/manage/announces/${id}`);
        return response.data.data;
      },
      enabled: !!id,
    });

  const createAnnounce = useMutation({
    mutationFn: async (data: AnnounceInput) => {
      const response = await api.post('/watcher/manage/announces', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      toast.success('Announcement created successfully');
    },
  });

  const updateAnnounce = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AnnounceInput> }) => {
      const response = await api.put(`/watcher/manage/announces/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      queryClient.invalidateQueries({ queryKey: ['announce'] });
      toast.success('Announcement updated successfully');
    },
  });

  const deleteAnnounce = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/watcher/manage/announces/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announces'] });
      toast.success('Announcement deleted successfully');
    },
  });

  return {
    announces,
    announce,
    createAnnounce,
    updateAnnounce,
    deleteAnnounce,
  };
}
