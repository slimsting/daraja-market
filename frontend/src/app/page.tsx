// src/app/page.tsx
"use client";
import React from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/features/products/Product-card";
import { ProductCardSkeleton } from "@/components/features/products/Product-card-skeleton";
import { CategoryCard } from "@/components/features/categories/CategoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function HomePage() {
  const { data: products, isLoading, error } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // filter/search state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [categoriesExpanded, setCategoriesExpanded] = React.useState(false);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    let list = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term),
      );
    }
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [products, searchTerm, selectedCategory]);

  // Debugging logs
  if (typeof window !== "undefined") {
    console.log("🔍 HomePage Debug Info:", {
      products: products ? `Array of ${products.length} items` : undefined,
      filtered: filteredProducts
        ? `Array of ${filteredProducts.length} items`
        : undefined,
      selectedCategory,
      isLoading,
      error: error?.message || error,
      productsType: typeof products,
      productsIsArray: Array.isArray(products),
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className=" bg-fixed bg-cover bg-center bg-no-repeat bg-[url(https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybSUyMHByb2R1Y2V8ZW58MHwwfDB8fHwy)] bg-linear-to-r from-green-600 to-green-700 text-white">
        <div className=" bg-slate-900/30 h-full py-20">
          <div className="container opacity-100 mx-auto px-4  text-center">
            <h1 className="text-5xl font-bold mb-4">
              Direct Access to Kisii&apos;s Finest Harvest
            </h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto">
              Connecting Daraja Mbili&apos;s trusted farmers with brokers
              nationwide. <br />
              <span className=" text-green-400 bg-opacity-20 px-2">
                Real-time prices, verified quality.
              </span>
            </p>

            {/* Search Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mb-6 flex justify-center mt-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops..."
                className="w-full max-w-md px-4 py-2 text-xl bg-white text-black border border-gray-300 rounded-l focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white text-xl rounded-r hover:bg-green-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Browse by Category / Products Layout */}
      <div className="container mx-auto px-12 py-12 lg:flex lg:space-x-8">
        {/* sidebar */}
        <aside className="lg:w-1/6 md:border-r md:border-green-500">
          {!categoriesLoading && categories && categories.length > 0 && (
            <>
              {/* small-screen toggle button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="flex items-center justify-between w-full py-3 px-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  aria-expanded={categoriesExpanded}
                  aria-controls="categories-grid"
                >
                  <span className="font-medium text-green-800">
                    Browse Categories
                  </span>
                  {categoriesExpanded ? (
                    <ChevronUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  )}
                </button>
              </div>

              {/* small-screen card grid */}
              {categoriesExpanded && (
                <div
                  id="categories-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden mb-8 transition-all duration-300 ease-in-out"
                >
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.category}
                      category={cat.category}
                      samples={cat.samples}
                      onClick={() =>
                        setSelectedCategory((prev) =>
                          prev === cat.category ? null : cat.category,
                        )
                      }
                      selected={selectedCategory === cat.category}
                    />
                  ))}
                </div>
              )}

              {/* large-screen list */}
              <div className="hidden lg:block sticky top-20">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.category}>
                      <button
                        onClick={() =>
                          setSelectedCategory((prev) =>
                            prev === cat.category ? null : cat.category,
                          )
                        }
                        className={`w-full text-left py-2 px-4 rounded transition-colors duration-150 capitalize ${
                          selectedCategory === cat.category
                            ? "bg-green-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {cat.category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </aside>

        {/* main content (products) */}
        <main className="lg:flex-1">
          {selectedCategory && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                Filtering by category:&nbsp;
                <span className="font-semibold capitalize">
                  {selectedCategory}
                </span>
                &nbsp;(
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="underline text-green-600 hover:text-green-700"
                >
                  clear
                </button>
                )
              </p>
            </div>
          )}

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
          {!isLoading && filteredProducts && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State - Only show if NOT loading, no products, and no error */}
          {!isLoading &&
            (!filteredProducts || filteredProducts.length === 0) &&
            !error && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-xl">
                  No products available yet.
                </p>
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
        </main>
      </div>
    </div>
  );
}
