import { z } from "zod";

// User Schema (Firebase Auth)
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Product Category Schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  categoryId: z.string(),
  stock: z.number(),
  imageUrl: z.string(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().optional(),
});

export const insertProductSchema = productSchema.omit({ id: true });

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Address Schema
export const addressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  isDefault: z.boolean().default(false),
});

export const insertAddressSchema = addressSchema.omit({ id: true });

export type Address = z.infer<typeof addressSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

// Cart Item Schema
export const cartItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().min(1),
});

export const insertCartItemSchema = cartItemSchema.omit({ id: true });

export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Wishlist Item Schema
export const wishlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
});

export const insertWishlistItemSchema = wishlistItemSchema.omit({ id: true });

export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

// Order Status
export const orderStatusSchema = z.enum(["On Process", "Shipped", "Delivered"]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

// Order Item Schema
export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productImage: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Order Schema
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  total: z.number(),
  addressId: z.string(),
  status: orderStatusSchema,
  createdAt: z.string(),
});

export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true, status: true });

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
