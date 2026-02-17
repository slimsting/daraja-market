// src/services/cart.service.ts
import apiClient from "@/lib/api-client";
import { Cart, cartSchema } from "@/types";

export const cartService = {
  // Get cart
  async getCart(): Promise<Cart> {
    const response = await apiClient.get("/cart");
    return cartSchema.parse(response.data.cart || response.data);
  },

  // Add to cart
  async addItem(productId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.post("/cart", { productId, quantity });
    return cartSchema.parse(response.data.cart || response.data);
  },

  // Update cart item
  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.put(`/cart/${itemId}`, { quantity });
    return cartSchema.parse(response.data.cart || response.data);
  },

  // Remove from cart
  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete("/cart", { data: { itemId } });
    return cartSchema.parse(response.data.cart || response.data);
  },

  // Clear cart
  async clearCart(): Promise<void> {
    await apiClient.delete("/cart/clear");
  },

  // Checkout
  async checkout(): Promise<void> {
    await apiClient.post("/cart/checkout");
  },
};
