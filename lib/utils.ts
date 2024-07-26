import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Cart {
  id: string;
  name: string;
  href: string;
  color: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
}

export function calculateTotalPrice(cart: Cart[]): number {
  return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export interface Product {
  id: string;
  name: string;
  amount: number;
  price: number;
  initial: number;
  active: boolean;
}
