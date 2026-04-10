"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";

// Query keys
export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

// Get cart
export function useCart() {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartService.getCart,
  });
}

// Add to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => cartService.addItem(productId, quantity),
    onSuccess: () => {
      // Refetch cart
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Update cart item
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => cartService.updateItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Remove from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Checkout
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.checkout,
    onSuccess: () => {
      // Clear cart after successful checkout
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}
