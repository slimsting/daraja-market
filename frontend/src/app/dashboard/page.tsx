// src/app/dashboard/page.tsx
"use client";

import { useMyProducts } from "@/hooks/use-products";
import { useDeleteProduct } from "@/hooks/use-products";
import { StatsCard } from "@/components/features/dashboard/stats-card";
import { ProductsTable } from "@/components/features/dashboard/products-table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";

export default function DashboardPage() {
  const { data: products, isLoading, error } = useMyProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  // Calculate stats
  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const totalValue =
    products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;
  const availableProducts = products?.filter((p) => p.available).length || 0;

  const handleEdit = (product: Product) => {
    // TODO: Open edit modal
    console.log("Edit product:", product);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage your products and track your sales
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">My Products</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/products">View All</Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Failed to load products. Please try again.
          </div>
        )}

        {/* Products Table */}
        {!isLoading && products && (
          <ProductsTable
            products={products.slice(0, 5)} // Show only first 5
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
