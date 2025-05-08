import axios, { InternalAxiosRequestConfig } from "axios";

// Type definitions for API data structures
export interface Cause {
  id: number;
  title: string;
  organization: string;
  description: string;
  image_url: string;
  raised_amount: number;
  goal_amount: number;
  category_id: number;
  category: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: number;
  user_id?: number;
  cause_id: number;
  amount: number;
  is_anonymous: boolean;
  status: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
  cause?: string;
  user_name?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions for causes
export const causesApi = {
  getAll: () => api.get<Cause[]>("/causes"),
  getFeatured: () => api.get<Cause[]>("/causes/featured"),
  getById: (id: string | number) => api.get<Cause>(`/causes/${id}`),
  create: (data: Omit<Cause, "id" | "created_at" | "updated_at">) =>
    api.post<Cause>("/causes", data),
  update: (id: string | number, data: Partial<Cause>) =>
    api.put<Cause>(`/causes/${id}`, data),
  delete: (id: string | number) => api.delete(`/causes/${id}`),
};

// API functions for categories
export const categoriesApi = {
  getAll: () => api.get<Category[]>("/categories"),
  getById: (id: string | number) => api.get<Category>(`/categories/${id}`),
  create: (data: Omit<Category, "id" | "created_at" | "updated_at">) =>
    api.post<Category>("/categories", data),
  update: (id: string | number, data: Partial<Category>) =>
    api.put<Category>(`/categories/${id}`, data),
  delete: (id: string | number) => api.delete(`/categories/${id}`),
};

// API functions for donations
export const donationsApi = {
  create: (data: Omit<Donation, "id" | "created_at" | "updated_at">) =>
    api.post<Donation>("/donations", data),
  getAll: () => api.get<Donation[]>("/donations"),
  getById: (id: string | number) => api.get<Donation>(`/donations/${id}`),
  getRecent: (limit = 5) =>
    api.get<Donation[]>(`/donations/recent?limit=${limit}`),
  getByCauseId: (id: string | number) =>
    api.get<Donation[]>(`/causes/${id}/donations`),
  getByUserId: (id: string | number) =>
    api.get<Donation[]>(`/users/${id}/donations`),
  getMyDonations: () => api.get<Donation[]>("/users/me/donations"),
};

// API functions for users
export const usersApi = {
  register: (data: RegisterData) =>
    api.post<AuthResponse>("/users/register", data),
  login: (data: LoginData) => api.post<AuthResponse>("/users/login", data),
  getMe: () => api.get<User>("/users/me"),
  updateMe: (data: Partial<User>) => api.put<User>("/users/me", data),
  getById: (id: string | number) => api.get<User>(`/users/${id}`),
};

// Auth helper functions
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await usersApi.login({ email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  },
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await usersApi.register({ name, email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  },
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};

export default api;
