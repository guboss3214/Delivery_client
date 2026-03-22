import { ReactNode } from "react";

export interface Product {
  _id: string;
  shopId: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface Shop {
  _id: string;
  name: string;
  rating: number;
  imageUrl?: string;
  location?: string;
}

export interface NavLink {
  path: string;
  label: string;
  icon: ReactNode;
}
