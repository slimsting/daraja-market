// src/services/cart.service.ts
import apiClient from "@/lib/api-client";
import { Cart, cartSchema } from "@/types";

export const cartService = {
  // Get cart
  async getCart(): Promise<Cart> {
    const response = await apiClient.get("/cart");
    return response.data.data;
  },

  // Add to cart
  async addItem(productId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.post("/cart", { productId, quantity });
    return response.data.data;
  },

  // Update cart item
  async updateItem(productId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.put("/cart", { productId, quantity });
    return response.data.data;
  },

  // Remove from cart
  async removeItem(productId: string): Promise<Cart> {
    const response = await apiClient.delete("/cart", { data: { productId } });
    return response.data.data;
  },

  // Clear cart
  async clearCart(): Promise<void> {
    await apiClient.delete("/cart/clear-cart");
  },

  // Checkout
  async checkout(): Promise<void> {
    await apiClient.post("/cart/checkout");
  },
};
