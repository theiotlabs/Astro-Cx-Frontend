import api from './api';
import { ENDPOINTS } from '../constants';
import { CustomerUser } from '../store/useAuthStore';

export const authService = {
  async login(payload: Record<string, any>) {
    const response = await api.post(ENDPOINTS.LOGIN, payload);
    return response.data;
  },

  async register(payload: Record<string, any>) {
    const response = await api.post(ENDPOINTS.REGISTER, payload);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  async resetPassword(payload: Record<string, any>) {
    const response = await api.post(ENDPOINTS.RESET_PASSWORD, payload);
    return response.data;
  },

  async logout(refreshToken: string) {
    const response = await api.post(ENDPOINTS.LOGOUT, { refresh: refreshToken });
    return response.data;
  },

  async getProfile() {
    const response = await api.get(ENDPOINTS.PROFILE);
    return response.data;
  },

  async updateProfile(payload: Partial<CustomerUser>) {
    const response = await api.put(ENDPOINTS.PROFILE, payload);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get(ENDPOINTS.DASHBOARD_STATS);
    return response.data;
  }
};
