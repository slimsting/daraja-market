// src/components/features/products/product-card-skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none pt-0">
      {/* Product Image Skeleton */}
      <div className="relative h-40 w-full bg-gradient-to-br from-green-400 to-primary flex items-center justify-center mt-0">
        <div className="h-40 w-full bg-slate-200 animate-pulse" />
      </div>

      <CardContent>
        {/* Product Name Skeleton */}
        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />

        {/* Price and Stock Section Skeleton */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex-1">
            {/* Price Skeleton */}
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-2" />
            {/* Quantity Skeleton */}
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full bg-slate-200 rounded animate-pulse mt-2" />
      </CardContent>
    </Card>
  );
}
