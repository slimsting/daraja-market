"use client";

import { useState } from "react";
import { useMyProducts, useProducts } from "@/hooks/use-products";
import { useDeleteProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
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
  Eye,
  EyeOff,
} from "lucide-react";
import { Product } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const {
    data: myProducts,
    isLoading: myLoading,
    error: myError,
  } = useMyProducts();
  const {
    data: allProducts,
    isLoading: allLoading,
    error: allError,
  } = useProducts();
  const products = isAdmin ? allProducts : myProducts;
  const isLoading = isAdmin ? allLoading : myLoading;
  const error = isAdmin ? allError : myError;
  const { mutate: deleteProduct } = useDeleteProduct();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Calculate stats
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

  const onProductCreated = () => {
    // could show a toast in future
  };

  return (
    <div className="container mx-auto px-2 py-4 space-y-6 sm:space-y-8">
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={onProductCreated}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isAdmin ? "All Products" : "My Products"}
          </h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            {isAdmin
              ? "Manage all products in the marketplace"
              : "Manage your products and track your sales"}
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

      {/* Stats Grid */}
      <div className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description={`${availableProducts} available`}
        />
        <StatsCard
          title="Total Stock"
          value={totalStock}
          icon={TrendingUp}
          description="Units in inventory"
        />
        <StatsCard
          title="Inventory Value"
          value={`KSh ${totalValue.toLocaleString()}`}
          icon={DollarSign}
          description="Total worth"
        />
        <StatsCard
          title="Active Listings"
          value={availableProducts}
          icon={AlertCircle}
          description={`${totalProducts - availableProducts} inactive`}
        />
      </div>

      {/* Products Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            My Products
          </h2>
          {products && products.length > 5 && (
            <Button
              variant="outline"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="w-full sm:w-auto"
            >
              {showAllProducts ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View All ({products.length})
                </>
              )}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg border">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Loading products...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
            Failed to load products. Please try again.
          </div>
        )}

        {/* Products Table */}
        {!isLoading && products && (
          <ProductsTable
            products={showAllProducts ? products : products.slice(0, 5)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
