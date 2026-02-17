// src/components/features/products/product-card-skeleton.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-6 w-full bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
