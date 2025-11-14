import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useEnums() {
  const enums = useQuery({
    queryKey: ['enums'],
    queryFn: async () => {
      const response = await api.get('/watcher/enums/load');
      return response.data.data;
    },
    staleTime: Infinity, // Enums rarely change
  });

  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get('/watcher/enums/roles');
      return response.data.data;
    },
    staleTime: Infinity,
  });

  const ticketStatuses = useQuery({
    queryKey: ['ticketStatuses'],
    queryFn: async () => {
      const response = await api.get('/watcher/enums/ticket-statuses');
      return response.data.data;
    },
    staleTime: Infinity,
  });

  const ticketPriorities = useQuery({
    queryKey: ['ticketPriorities'],
    queryFn: async () => {
      const response = await api.get('/watcher/enums/ticket-priorities');
      return response.data.data;
    },
    staleTime: Infinity,
  });

  return {
    enums,
    roles,
    ticketStatuses,
    ticketPriorities,
  };
}
