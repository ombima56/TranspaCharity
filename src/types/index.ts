// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

// Cause types
export interface Cause {
  id: number;
  title: string;
  organization: string;
  description: string;
  image_url: string;
  goal_amount: number;
  current_amount?: number;
  raised_amount?: number;
  category_id: number;
  category?: Category;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCauseRequest {
  title: string;
  organization: string;
  description: string;
  image_url: string;
  goal_amount: number;
  category_id: number;
  featured: boolean; // Keep as boolean in frontend for easier form handling
}

// Donation types
export interface Donation {
  id: number;
  user_id?: number;
  cause_id: number;
  amount: number;
  transaction_hash?: string;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

export interface CreateDonationRequest {
  cause_id: number;
  amount: number;
  transaction_hash?: string;
  message?: string;
  anonymous: boolean;
}
