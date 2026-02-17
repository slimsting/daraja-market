// src/services/products.service.ts
import apiClient from "@/lib/api-client";
import { Product, productSchema, productsResponseSchema } from "@/types";
import { z } from "zod";

export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiClient.get("/products");

      console.log("[Products Service] Raw API response:", response.data);

      const data = response.data;

      // Try different response formats
      let products: unknown[] | null = null;

      // Format 1: { products: [...] }
      if (data?.products && Array.isArray(data.products)) {
        console.log("[Products Service] Using format 1: data.products");
        products = data.products;
      }
      // Format 2: { data: { products: [...] } }
      else if (data?.data?.products && Array.isArray(data.data.products)) {
        console.log("[Products Service] Using format 2: data.data.products");
        products = data.data.products;
      }
      // Format 3: Direct array [...]
      else if (Array.isArray(data)) {
        console.log("[Products Service] Using format 3: direct array");
        products = data;
      }
      // Format 4: { data: [...] }
      else if (data?.data && Array.isArray(data.data)) {
        console.log("[Products Service] Using format 4: data.data");
        products = data.data;
      }

      if (!products || products.length === 0) {
        console.warn("[Products Service] No products array found or is empty");
        console.warn("[Products Service] Response structure:", {
          hasProducts: !!data?.products,
          hasData: !!data?.data,
          isArray: Array.isArray(data),
          dataIsArray: data?.data ? Array.isArray(data.data) : "N/A",
          keys: Object.keys(data || {}),
        });
        return [];
      }

      try {
        // Validate products with Zod
        const validatedProducts = z.array(productSchema).parse(products);
        console.log(
          "[Products Service] Successfully validated products:",
          validatedProducts.length,
        );
        return validatedProducts;
      } catch (validationError) {
        console.warn(
          "[Products Service] Zod validation warning, returning unvalidated products",
        );
        if (validationError instanceof z.ZodError) {
          console.warn(
            "[Products Service] Validation errors:",
            validationError.issues.slice(0, 3),
          );
          // Log first invalid product to debug
          if (Array.isArray(products) && products.length > 0) {
            console.warn(
              "[Products Service] First product:",
              JSON.stringify(products[0], null, 2),
            );
          }
        }
        // Return products without validation - they should still be usable
        return products as Product[];
      }
    } catch (error) {
      console.error("[Products Service] Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);

    console.log("[Products Service] Raw product response:", response.data);

    // Try: { product: {...} }
    if (response.data.product) {
      return productSchema.parse(response.data.product);
    }

    // Try: { data: {...} }
    if (response.data.data) {
      return productSchema.parse(response.data.data);
    }

    // Try: direct object {...}
    return productSchema.parse(response.data);
  },

  // Get my products (for farmers)
  async getMyProducts(): Promise<Product[]> {
    const response = await apiClient.get("/products/my-products");

    if (response.data.products) {
      return z.array(productSchema).parse(response.data.products);
    }

    if (response.data.data && Array.isArray(response.data.data)) {
      return z.array(productSchema).parse(response.data.data);
    }

    return z.array(productSchema).parse(response.data);
  },

  // Create product
  async create(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post("/products", data);
    return productSchema.parse(response.data.product || response.data);
  },

  // Update product
  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, data);
    return productSchema.parse(response.data.product || response.data);
  },

  // Delete product
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
