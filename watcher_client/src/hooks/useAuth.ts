import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LoginInput, RegisterInput, ProfileUpdateInput } from '../lib/validation';

export function useAuth() {
  const { setAuth, logout: logoutStore, user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await api.post('/watcher/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, token, refreshToken } = data.data;
      setAuth(user, token, refreshToken);
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/app');
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post('/watcher/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      await api.post('/watcher/auth/logout', { refreshToken });
    },
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/');
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileUpdateInput) => {
      const response = await api.put('/watcher/auth/update', data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().updateUser(data.data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Profile updated successfully');
    },
  });

  const checkUsername = async (username: string) => {
    const response = await api.get('/watcher/auth/check-username', {
      params: { username },
    });
    return response.data.data.available;
  };

  const getCurrentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/watcher/auth/me');
      return response.data.data;
    },
    enabled: !!user,
  });

  return {
    login,
    register,
    logout,
    updateProfile,
    checkUsername,
    getCurrentUser,
    user,
  };
}
