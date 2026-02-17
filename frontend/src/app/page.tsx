// src/app/page.tsx
"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/features/products/Product-card";
import { ProductCardSkeleton } from "@/components/features/products/Product-card-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const { data: products, isLoading, error } = useProducts();

  // Debugging logs
  if (typeof window !== "undefined") {
    console.log("🔍 HomePage Debug Info:", {
      products: products ? `Array of ${products.length} items` : undefined,
      isLoading,
      error: error?.message || error,
      productsType: typeof products,
      productsIsArray: Array.isArray(products),
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🌾 Welcome to Daraja Market
          </h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto">
            Connecting farmers with brokers for fresh, quality agricultural
            products
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Fresh Products
          </h2>
          <p className="text-slate-600">
            Browse our selection of fresh agricultural products from local
            farmers
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Products</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : typeof error === "string"
                  ? error
                  : "Failed to load products. Please try again later. Check browser console for details."}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State - Only show if NOT loading, no products, and no error */}
        {!isLoading && (!products || products.length === 0) && !error && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-xl">No products available yet.</p>
            <p className="text-slate-400 text-sm mt-2">
              Check back soon as farmers add their products to the market.
            </p>
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-gray-700 max-h-64 overflow-auto">
            <details>
              <summary className="cursor-pointer font-semibold mb-2">
                🐛 Debug Info (Development Only)
              </summary>
              <pre>
                {JSON.stringify(
                  {
                    isLoading,
                    hasProducts: !!products,
                    productsLength: products?.length || 0,
                    hasError: !!error,
                    errorMessage:
                      error instanceof Error ? error.message : error,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}
