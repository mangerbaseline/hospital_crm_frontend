export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponseData extends User {
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
