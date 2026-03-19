// src/services/products.service.ts
import apiClient from "@/lib/api-client";
import { productsLogger, logZodError } from "@/lib/loggers";
import { Product, productSchema } from "@/types";
import { z, ZodError } from "zod";

const isFileLike = (value: unknown): value is File =>
  !!value &&
  typeof value === "object" &&
  "name" in (value as any) &&
  "size" in (value as any);

const buildFormData = (data: Partial<Product>) => {
  const form = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Handle arrays (tags, images, etc.)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        // File objects should be appended as files, strings as regular fields
        if (isFileLike(item)) {
          form.append(key, item);
        } else {
          form.append(key, String(item));
        }
      });
      return;
    }

    // Primitive values
    if (value !== undefined && value !== null) {
      form.append(key, String(value));
    }
  });

  return form;
};

export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiClient.get("/products");
      const data = response.data;

      productsLogger.debug(
        {
          structure: Object.keys(data),
        },
        "Parsing products response",
      );

      let productsArray: unknown[] = [];

      if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
        productsLogger.debug("Found products in data.data");
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
        productsLogger.debug("Found products in data.products");
      } else if (Array.isArray(data)) {
        productsArray = data;
        productsLogger.debug("Data is direct array");
      } else {
        productsLogger.error(
          { keys: Object.keys(data) },
          "Unexpected response structure",
        );
        throw new Error("Unexpected API response format");
      }

      productsLogger.debug(
        { count: productsArray.length, sample: productsArray[0] },
        "Validating products",
      );

      const parsed = z.array(productSchema).safeParse(productsArray);

      if (!parsed.success) {
        logZodError(productsLogger, "getAll", parsed.error, productsArray[0]);
        throw new Error(
          `Product validation failed: ${parsed.error.issues[0]?.message}`,
        );
      }

      productsLogger.info(
        { count: parsed.data.length },
        "Products loaded successfully",
      );
      return parsed.data;
    } catch (error) {
      if (error instanceof ZodError) {
        logZodError(productsLogger, "getAll", error);
      } else {
        productsLogger.error({ error }, "Failed to fetch products");
      }
      throw error;
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const productData =
        response.data.product || response.data.data || response.data;

      const parsed = productSchema.safeParse(productData);

      if (!parsed.success) {
        logZodError(productsLogger, "getById", parsed.error, productData);
        throw new Error("Product validation failed");
      }

      return parsed.data;
    } catch (error) {
      if (error instanceof ZodError) {
        logZodError(productsLogger, "getById", error);
      } else {
        productsLogger.error({ error, id }, "Failed to fetch product");
      }
      throw error;
    }
  },

  // Get my products
  async getMyProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get("/products/my-products");
      const productsArray =
        response.data.products || response.data.data || response.data;

      const parsed = z.array(productSchema).safeParse(productsArray);

      if (!parsed.success) {
        logZodError(
          productsLogger,
          "getMyProducts",
          parsed.error,
          productsArray[0],
        );
        throw new Error("Products validation failed");
      }

      return parsed.data;
    } catch (error) {
      productsLogger.error({ error }, "Failed to fetch my products");
      throw error;
    }
  },

  // Create product
  async create(data: Partial<Product>): Promise<Product> {
    try {
      const hasFileUpload =
        Array.isArray(data.images) &&
        data.images.some((img) => isFileLike(img));

      const payload = hasFileUpload ? buildFormData(data) : data;

      const response = await apiClient.post("/products", payload);
      const parsed = productSchema.safeParse(
        response.data.product || response.data,
      );

      if (!parsed.success) {
        logZodError(productsLogger, "create", parsed.error, response.data);
        throw new Error("Product validation failed");
      }

      productsLogger.info(
        { id: parsed.data._id },
        "Product created successfully",
      );
      return parsed.data;
    } catch (error) {
      productsLogger.error({ error }, "Failed to create product");
      throw error;
    }
  },

  // Update product
  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const hasFileUpload =
        Array.isArray(data.images) &&
        data.images.some((img) => isFileLike(img));

      const payload = hasFileUpload ? buildFormData(data) : data;

      const response = await apiClient.put(`/products/${id}`, payload);
      const parsed = productSchema.safeParse(
        response.data.product || response.data,
      );

      if (!parsed.success) {
        logZodError(productsLogger, "update", parsed.error, response.data);
        throw new Error("Product validation failed");
      }

      productsLogger.info({ id }, "Product updated successfully");
      return parsed.data;
    } catch (error) {
      productsLogger.error({ error, id }, "Failed to update product");
      throw error;
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
      productsLogger.info({ id }, "Product deleted successfully");
    } catch (error) {
      productsLogger.error({ error, id }, "Failed to delete product");
      throw error;
    }
  },
};
