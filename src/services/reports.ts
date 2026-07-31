import api from './api';
import { ENDPOINTS } from '../constants';

export const reportService = {
  // Reports
  async listReports(email?: string) {
    const response = await api.get(ENDPOINTS.REPORTS, {
      params: email ? { email } : {},
    });
    return response.data;
  },

  async getReportDetail(id: number | string, token?: string) {
    const response = await api.get(`${ENDPOINTS.REPORTS}${id}/`, {
      params: token ? { token } : {},
    });
    return response.data;
  },

  async createReport(payload: {
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    mobile_number: string;
  }) {
    const response = await api.post(ENDPOINTS.REPORTS, payload);
    return response.data;
  },

  async checkReportStatus(id: number | string) {
    const response = await api.get(ENDPOINTS.REPORT_STATUS(id));
    return response.data;
  },

  // E-commerce & Payments
  async getServices() {
    const response = await api.get(ENDPOINTS.SERVICES);
    return response.data;
  },

  async createOrder(payload: {
    name: string;
    email: string;
    phone: string;
    service_type: string;
    service_title: string;
    price: number;
    currency?: string;
    notes?: string;
    metadata?: Record<string, any>;
  }) {
    const response = await api.post(ENDPOINTS.CREATE_ORDER, payload);
    return response.data;
  },

  async verifyPayment(payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    const response = await api.post(ENDPOINTS.VERIFY_PAYMENT, payload);
    return response.data;
  },

  async listOrders() {
    const response = await api.get(ENDPOINTS.ORDERS);
    return response.data;
  },

  async listInvoices() {
    const response = await api.get(ENDPOINTS.INVOICES);
    return response.data;
  },

  // Notifications
  async listNotifications() {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS);
    return response.data;
  },
};
