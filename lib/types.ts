export type UserRole = "buyer" | "admin";
export type OrderStatus = "pending" | "paid" | "failed";
export type PaymentProvider = "stripe_sim" | "paddle_sim";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug: string;
  slug: string;
  title: string;
  description: string;
  price_sar: number;
  download_link: string;
  image_url: string;
  featured: boolean;
  created_at?: string;
}

export interface MarketplaceUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  buyer_email: string;
  product_id: string;
  amount_sar: number;
  payment_provider: PaymentProvider;
  payment_reference: string;
  status: OrderStatus;
  download_link: string;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  title: string;
  rating: number;
  quote: string;
}
