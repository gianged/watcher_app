import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';
import type { TicketInput, CommentInput } from '../lib/validation';

interface TicketFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  departmentId?: number;
  assignedToId?: number;
}

export function useTickets(filters?: TicketFilters) {
  const queryClient = useQueryClient();

  const tickets = useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => {
      const endpoint = filters ? '/watcher/manage/tickets/paged' : '/watcher/manage/tickets';
      const response = await api.get(endpoint, { params: filters });
      return response.data;
    },
  });

  const ticket = (id: number) =>
    useQuery({
      queryKey: ['ticket', id],
      queryFn: async () => {
        const response = await api.get(`/watcher/manage/tickets/${id}`);
        return response.data.data;
      },
      enabled: !!id,
    });

  const createTicket = useMutation({
    mutationFn: async (data: TicketInput) => {
      const response = await api.post('/watcher/manage/tickets', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created successfully');
    },
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TicketInput> }) => {
      const response = await api.put(`/watcher/manage/tickets/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Ticket updated successfully');
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/watcher/manage/tickets/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket deleted successfully');
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: number; data: CommentInput }) => {
      const response = await api.post(`/watcher/manage/tickets/${ticketId}/comments`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
      toast.success('Comment added successfully');
    },
  });

  return {
    tickets,
    ticket,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
  };
}
