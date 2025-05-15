import axios, { AxiosResponse } from "axios";
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Category,
  CreateCategoryRequest,
  Cause,
  CreateCauseRequest,
  Donation,
  CreateDonationRequest
} from "@/types";

// Create an axios instance with base URL and default headers
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
console.log("API URL:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions for causes
export const causesApi = {
  getAll: async () => {
    try {
      const response = await api.get<Cause[]>("/causes");
      return response;
    } catch (error) {
      console.error("Error fetching causes:", error);
      throw error;
    }
  },
  getFeatured: async () => {
    try {
      const response = await api.get<Cause[]>("/causes/featured");
      return response;
    } catch (error) {
      console.error("Error fetching featured causes:", error);
      throw error;
    }
  },
  getById: async (id: string | number) => {
    try {
      return await api.get<Cause>(`/causes/${id}`);
    } catch (error) {
      console.error(`Error fetching cause ${id}:`, error);
      throw error;
    }
  },
  create: async (data: CreateCauseRequest) => {
    try {
      // Convert boolean featured to integer (0 or 1)
      const modifiedData = {
        ...data,
        featured: data.featured ? 1 : 0
      };
      
      return await api.post<Cause>("/causes", modifiedData);
    } catch (error) {
      console.error("Error creating cause:", error);
      throw error;
    }
  },
  update: async (id: string | number, data: Partial<Cause>) => {
    try {
      // Convert boolean featured to integer if it exists
      const modifiedData = { ...data };
      if (typeof modifiedData.featured === 'boolean') {
        modifiedData.featured = modifiedData.featured ? 1 : 0;
      }
      
      return await api.put<Cause>(`/causes/${id}`, modifiedData);
    } catch (error) {
      console.error(`Error updating cause ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: string | number) => {
    try {
      return await api.delete(`/causes/${id}`);
    } catch (error) {
      console.error(`Error deleting cause ${id}:`, error);
      throw error;
    }
  },
};

// API functions for categories
export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  getById: async (id: string | number) => {
    try {
      return await api.get<Category>(`/categories/${id}`);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },
  create: async (data: CreateCategoryRequest) => {
    try {
      return await api.post<Category>("/categories", data);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
  update: async (id: string | number, data: Partial<Category>) => {
    try {
      return await api.put<Category>(`/categories/${id}`, data);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: string | number) => {
    try {
      return await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

// API functions for donations
export const donationsApi = {
  create: async (data: CreateDonationRequest) => {
    try {
      return await api.post<Donation>("/donations", data);
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      return await api.get<Donation[]>("/donations");
    } catch (error) {
      console.error("Error fetching donations:", error);
      throw error;
    }
  },
  getById: async (id: string | number) => {
    try {
      return await api.get<Donation>(`/donations/${id}`);
    } catch (error) {
      console.error(`Error fetching donation ${id}:`, error);
      throw error;
    }
  },
  getRecent: async (limit = 5) => {
    try {
      return await api.get<Donation[]>(`/donations/recent?limit=${limit}`);
    } catch (error) {
      console.error("Error fetching recent donations:", error);
      throw error;
    }
  },
  getByCauseId: async (id: string | number) => {
    try {
      return await api.get<Donation[]>(`/causes/${id}/donations`);
    } catch (error) {
      console.error(`Error fetching donations for cause ${id}:`, error);
      throw error;
    }
  },
  getByUserId: async (id: string | number) => {
    try {
      return await api.get<Donation[]>(`/users/${id}/donations`);
    } catch (error) {
      console.error(`Error fetching donations for user ${id}:`, error);
      throw error;
    }
  },
  getMyDonations: async () => {
    try {
      return await api.get<Donation[]>("/users/me/donations");
    } catch (error) {
      console.error("Error fetching my donations:", error);
      throw error;
    }
  },
};

// API functions for users
export const usersApi = {
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post<AuthResponse>("/users/register", data),
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> => 
    api.post<AuthResponse>("/users/login", data),
  getMe: () => api.get<User>("/users/me"),
  updateMe: (data: Partial<User>) => {
    // Only send the name field when updating profile
    const updateData = { name: data.name };
    return api.put<User>("/users/me", updateData);
  },
  getById: (id: string | number) => api.get<User>(`/users/${id}`),
};

// Auth helper functions
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("Attempting login with:", { email });
      
      const response = await usersApi.login({ email, password });
      
      console.log("Login response:", response);
      
      if (!response.data || !response.data.token) {
        console.error("Invalid login response format:", response);
        throw new Error("Invalid server response. Please try again.");
      }
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      console.error("Login error details:", error);
      
      // Check if it's an Axios error with response data
      if (error.response) {
        console.error("Server response:", error.response.data);
        const message = error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        throw new Error(message);
      }
      
      // Network error or other issues
      throw new Error(error.message || "Login failed. Please check your connection.");
    }
  },
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await usersApi.register({ name, email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed. Please try again.");
    }
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
  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'admin';
  },
};

export default api;
