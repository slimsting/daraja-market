"use client";

import React from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/features/products/Product-card";
import { ProductCardSkeleton } from "@/components/features/products/Product-card-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, Filter } from "lucide-react";

export default function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const { data: categories = [] } = useCategories();

  // Search and filter state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [showFilters, setShowFilters] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    let list = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          (p.category && p.category.toLowerCase().includes(term)),
      );
    }
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [products, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <section className="bg-linear-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Our Marketplace</h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto">
              Discover fresh, locally grown products from trusted farmers across
              Kisii
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto ">
            <div className="bg-amber-500 rounded-2xl p-6 shadow-lg">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, categories, or descriptions..."
                  className="pl-12 pr-4 py-6 text-lg text-slate-500 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-green-600 border-slate-200 hover:bg-green-700"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedCategory || searchTerm) && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {(selectedCategory ? 1 : 0) + (searchTerm ? 1 : 0)}
                    </span>
                  )}
                </Button>

                {(selectedCategory || searchTerm) && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Category Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={
                        selectedCategory === null ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className={
                        selectedCategory === null
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-slate-300 hover:bg-slate-50"
                      }
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.category}
                        variant={
                          selectedCategory === category.category
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.category
                              ? null
                              : category.category,
                          )
                        }
                        className={
                          selectedCategory === category.category
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-slate-300 hover:bg-slate-50"
                        }
                      >
                        {category.category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 md:px-12">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {searchTerm || selectedCategory
                  ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                  : `All Products (${filteredProducts.length})`}
              </h2>
              {(searchTerm || selectedCategory) && (
                <p className="text-slate-600 mt-1">
                  {searchTerm && `Searching for "${searchTerm}"`}
                  {searchTerm && selectedCategory && " in "}
                  {selectedCategory && `${selectedCategory} category`}
                </p>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to load products</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                {searchTerm || selectedCategory
                  ? "No products found"
                  : "No products available"}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Check back soon as farmers add their products to the market."}
              </p>
              {(searchTerm || selectedCategory) && (
                <Button
                  onClick={clearFilters}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
