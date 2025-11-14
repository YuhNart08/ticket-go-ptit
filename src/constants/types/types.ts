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
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  name: string;
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
