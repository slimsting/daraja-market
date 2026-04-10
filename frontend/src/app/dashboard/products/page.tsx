"use client";

import { useState } from "react";
import { useMyProducts, useDeleteProduct } from "@/hooks/use-products";
import { StatsCard } from "@/components/features/dashboard/stats-card";
import { ProductsTable } from "@/components/features/dashboard/products-table";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { EditProductModal } from "@/components/modals/EditProductModal";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Product } from "@/types";

export default function DashboardProductsPage() {
  const { data: products, isLoading, error } = useMyProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const totalValue =
    products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;
  const availableProducts = products?.filter((p) => p.available).length || 0;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="container mx-auto px-2 py-4 space-y-6 sm:space-y-8">
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={() => {
          setAddModalOpen(false);
        }}
      />
      <EditProductModal
        open={isEditModalOpen}
        product={editingProduct}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProduct(null);
        }}
        onUpdated={() => {
          setEditModalOpen(false);
          setEditingProduct(null);
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Products
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            Manage all products you have listed on Daraja Market.
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className=" h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg border">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Loading your products...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          Failed to load products. Please try again.
        </div>
      )}

      {!isLoading && products && (
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
