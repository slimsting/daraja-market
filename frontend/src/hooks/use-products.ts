"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { Product } from "@/types";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  myProducts: () => [...productKeys.all, "my-products"] as const,
};

// Get all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: productsService.getAll,
  });
}

// Get single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: !!id, // Only run if ID exists
  });
}

// Get my products (for farmers)
export function useMyProducts() {
  return useQuery({
    queryKey: productKeys.myProducts(),
    queryFn: productsService.getMyProducts,
  });
}

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Product>) => productsService.create(data),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
    },
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
    },
  });
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts() });
    },
  });
}
