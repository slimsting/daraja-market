// src/components/features/products/product-card.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useAddToCart, useCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: cart } = useCart({ enabled: isAuthenticated });
  const imageSrc =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : "/fallback-product-image.png";
  const { mutate: addToCart, isPending } = useAddToCart();

  const isInCart = cart?.items?.some(
    (item) => String(item.productId) === String(product._id),
  );

  const handleCardClick = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) return;
    addToCart({ productId: String(product._id), quantity: 1 });
  };

  return (
    <Card
      onClick={handleCardClick}
      className="overflow-hidden  hover:shadow-lg border-none pt-0 hover:scale-102 transform transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="group relative h-40 w-full bg-linear-to-br from-green-400 to-primary flex items-center justify-center mt-0 cursor-pointer">
        <p className="z-50 bg-white rounded-md px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-50">
          click to view
        </p>
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
          disabled={isPending || product.quantity === 0 || isInCart}
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 mt-2 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart className="h-4 w-4" />
          {isPending ? "Adding..." : isInCart ? "In Cart" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
