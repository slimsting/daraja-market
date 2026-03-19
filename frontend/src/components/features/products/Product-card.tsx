// src/components/features/products/product-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageSrc, setImageSrc] = React.useState(
    product.images?.[0] || "/fallback-product-image.png",
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-none pt-0">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-green-400 to-primary flex items-center justify-center mt-0">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="100vw"
          className="object-cover"
          onError={() => setImageSrc("/fallback-product-image.png")}
          unoptimized
        />
      </div>

      <CardContent className="p-4">
        {/* Category Badge */}
        <Badge variant="secondary" className="mb-2">
          {product.category}
        </Badge>

        {/* Product Name */}
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-end justify-between text-green-500">
          <div>
            <p className="text-2xl font-bold text-primary">
              KSh {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">
              {product.quantity} units available
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-amber-500">
          <Link href={`/products/${product._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
