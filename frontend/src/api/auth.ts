import api from "./client";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    [key: string]: unknown;
  };
}

export async function register(credentials: RegisterParams): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", credentials);
  return response.data;
}

export async function login(credentials: LoginParams): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
}