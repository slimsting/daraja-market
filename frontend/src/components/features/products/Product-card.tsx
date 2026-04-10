// src/components/features/products/product-card.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";
import { useAddToCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const imageSrc =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : "/fallback-product-image.png";
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleCardClick = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ productId: String(product._id), quantity: 1 });
  };

  return (
    <Card
      onClick={handleCardClick}
      className="overflow-hidden  hover:shadow-lg border-none pt-0 hover:scale-102 transform transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-40 w-full bg-linear-to-br from-green-400 to-primary flex items-center justify-center mt-0">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <CardContent>
        {/* Product Name */}
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {product.name}
        </h3>

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
        <Button
          onClick={handleAddToCart}
          disabled={isPending || product.quantity === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 mt-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
