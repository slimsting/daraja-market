"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useProduct } from "@/hooks/use-products";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, CheckCircle2, XCircle } from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;
  const { data: product, isLoading, error } = useProduct(productId || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset selected image index when product changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  if (!productId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Product not found
          </h1>
          <p className="text-slate-600 mb-6">
            We could not find the product you were looking for. Please check the
            link or head back to the product list.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Product Details
            </h1>
            <p className="text-slate-600 mt-1">
              View product information, availability, and farmer details.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Back to Products</Link>
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-xl bg-white p-10 shadow-sm text-center text-slate-700">
            Loading product details...
          </div>
        )}

        {error && !isLoading && (
          <Alert className="mb-6">
            <AlertTitle>Cannot load product</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load the product."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && !product && (
          <div className="rounded-xl bg-white p-10 shadow-sm text-center text-slate-700">
            Product not found.
          </div>
        )}

        {!isLoading && product && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-6">
              <div className="rounded-3xl overflow-hidden bg-white shadow-sm">
                {product.images && product.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main large image */}
                    <div className="relative h-96 w-full overflow-hidden bg-slate-200">
                      <Image
                        src={String(product.images[selectedImageIndex])}
                        alt={`${product.name} main image`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Thumbnail images */}
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 px-4">
                        {product.images.map((image, index) => (
                          <button
                            key={`${String(image)}-${index}`}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative shrink-0 h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                              selectedImageIndex === index
                                ? "border-primary"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Image
                              src={String(image)}
                              alt={`${product.name} thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-96 bg-slate-200 flex items-center justify-center text-slate-500">
                    No product images available
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Badge className="mb-3">
                      {product.category || "Uncategorized"}
                    </Badge>
                    <h2 className="text-3xl font-semibold text-slate-900">
                      {product.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      KSh {product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {product.quantity} units available
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-slate-700">
                  <p>{product.description || "No description provided."}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Harvest Date
                        </span>
                      </div>
                      <p className="text-slate-900">
                        {product.harvestDate
                          ? new Date(product.harvestDate).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        {product.available ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          Availability
                        </span>
                      </div>
                      <p
                        className={`font-semibold ${product.available ? "text-emerald-700" : "text-red-600"}`}
                      >
                        {product.available ? "In stock" : "Out of stock"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">No tags</Badge>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Farmer details
                </h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    <span>
                      {typeof product.farmer === "string"
                        ? product.farmer
                        : product.farmer?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {typeof product.farmer === "string"
                        ? "Farm location not available"
                        : product.farmer?.location?.county ||
                          "Location not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Unit:</span>
                    <span>{product.unit || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Quick actions
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    asChild
                  >
                    <Link href="/">Browse more products</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">Manage my products</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
