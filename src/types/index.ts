export interface UserProfile {
  id: number;
  cx_id?: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  city?: string;
  state?: string;
}

export interface CatalogService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: string;
  discount_price: string | null;
  is_active: boolean;
}

export interface Order {
  id: string;
  short_id: string;
  user: number;
  user_email: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  service_title: string;
  service_description: string | null;
  quantity: number;
  price: string;
  currency: string;
  total_amount: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  notes: string | null;
  ordered_at: string;
  confirmed_at: string | null;
  processed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  pdf_url: string;
  issued_at: string;
  amount: string;
  tax_amount: string;
  status: string;
  order_id: string;
  order_short_id: string;
  service_title: string;
}

export interface Report {
  id: number;
  user: UserProfile;
  mobile_number: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  mulank?: number | null;
  bhagyank?: number | null;
  mobile_total?: number | null;
  report_data?: Record<string, any> | null;
  created_at: string;
  completed_at: string | null;
}

export interface NotificationLog {
  id: number;
  recipient: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'SYSTEM';
  subject: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'BOUNCED';
  created_at: string;
}

export interface DashboardStats {
  total_reports: number;
  active_reports: number;
  total_orders: number;
  pending_orders: number;
}
