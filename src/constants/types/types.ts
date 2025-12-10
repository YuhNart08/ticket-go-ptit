export type Booking = {
  ticket_id: string;
  event_name: string;
  event_date: string;
  ticket_type: string;
  price: number;
  status: "success" | "pending" | "cancelled";
  booking_date: string;
  ticket_code: string;
};

export type TicketType = {
  id: number;
  type: string;
  price: number;
  quantity: number;
  description: string;
};

export const userBookings: Booking[] = [];

export type Event = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  duration: string;
  organizer: string;
  bannerUrl: string;
  ticketTypes: TicketType[];
};

export type Category = {
  id: string;
  label: string;
};

// Authentication types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: "user" | "admin" | "organizer";
  isVerified?: boolean;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationErrors {
  [key: string]: string | undefined;
}

// Password reset types
export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
  confirmPassword: string;
}

export type MyJwtPayload = {
  id: number;
  email: string;
  name?: string;
};

// Order History Types
export interface EventDetailsForTicket {
  id: number;
  title: string;
  location?: string;
  startDate: string;
  duration?: string;
}

export interface TicketTypeForOrder {
  id: number;
  type: string;
  event: EventDetailsForTicket;
}

export interface RawTicketOrderDetail {
  id: number;
  price: number;
  quantity: number;
  ticketType: TicketTypeForOrder;
}

export interface RawOrder {
  id: number;
  status: string;
  orderDetails?: RawTicketOrderDetail[];
  ticketOrderDetails?: RawTicketOrderDetail[];
}

export interface OrdersHistoryResponse {
  orders: RawOrder[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
}

export interface MappedTicket {
  id: number;
  ticket_id: string;
  event_name: string;
  event_date: string;
  event_location?: string;
  event_duration?: string;
  status: string;
  ticket_type: string;
  quantity: number;
}