export const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_INTERNAL_API_URL || 'http://localhost:8000'); // Fallback to host port

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login/',
  REGISTER: '/api/auth/register/',
  REFRESH: '/api/auth/refresh/',
  LOGOUT: '/api/auth/logout/',
  FORGOT_PASSWORD: '/api/auth/forgot-password/',
  RESET_PASSWORD: '/api/auth/reset-password/',
  PROFILE: '/api/me/profile/',
  DASHBOARD_STATS: '/api/me/dashboard/',
  
  // Catalog Services
  SERVICES: '/api/commerce/services/',
  
  // Orders & Invoices
  ORDERS: '/api/commerce/orders/',
  CREATE_ORDER: '/api/commerce/orders/create/',
  VERIFY_PAYMENT: '/api/commerce/payments/verify/',
  INVOICES: '/api/commerce/customer/invoices/',
  
  // Reports
  REPORTS: '/api/mobile-numerology/reports/',
  REPORT_STATUS: (id: number | string) => `/api/mobile-numerology/reports/${id}/status_api/`,
  REPORT_PREVIEW: (id: number | string) => `/api/mobile-numerology/reports/${id}/preview/`,
  REPORT_DOWNLOAD: (id: number | string) => `/api/mobile-numerology/reports/${id}/download/`,
  REPORT_PDF_PREVIEW: (id: number | string) => `/api/mobile-numerology/reports/${id}/pdf-preview/`,
  
  // Notifications
  NOTIFICATIONS: '/api/notifications/',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'astro_access_token',
  REFRESH_TOKEN: 'astro_refresh_token',
  USER: 'astro_user',
};
