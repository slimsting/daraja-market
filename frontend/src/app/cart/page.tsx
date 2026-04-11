"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartItem,
  useClearCart,
  useCheckout,
} from "@/hooks/use-cart";
import { Cart } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const {
    data: cart,
    isLoading,
    error,
  } = useCart() as {
    data: Cart | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    if (cart?.items && cart.items.length > 0) {
      clearCart();
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem({ productId, quantity: newQuantity });
  };

  const handleCheckout = () => {
    if (cart?.items && cart.items.length > 0) {
      checkout();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart?.items || cart?.items.length === 0;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <section className="bg-linear-to-r from-green-600 to-green-700 text-white py-8 px-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-8 w-8" />
                Shopping Cart
              </h1>
              <p className="text-green-50 font-bold ml-6 mt-1">
                {isEmpty
                  ? "Your cart is empty"
                  : `${cart.items.length} item${cart.items.length !== 1 ? "s" : ""} in your cart`}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button
                asChild
                variant="secondary"
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              {!isEmpty && (
                <Button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  {isClearing ? "Clearing..." : "Clear Cart"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-2 md:px-12">
        <div className="container mx-auto px-4">
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading cart</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {isEmpty ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 mb-6">
                  Start shopping to add products to your cart.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Link
                    key={item._id}
                    href={`/products/${item.productId}`}
                    className="block bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-xl overflow-hidden bg-slate-200">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={String(item.product.images[0])}
                          alt={item.product?.name || "Product"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate hover:text-green-600 transition-colors">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-slate-600 text-sm mb-2">
                        {item.product?.category || "Uncategorized"}
                      </p>

                      {/* Price and Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Unit Price</p>
                          <p className="text-lg font-semibold text-primary">
                            KSh {item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div
                          className="flex items-center gap-3"
                          onClick={(e) => e.preventDefault()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1,
                              );
                            }}
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4 text-slate-600" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value, 10);
                              if (newQty > 0) {
                                handleUpdateQuantity(item.productId, newQty);
                              }
                            }}
                            disabled={isUpdating}
                            className="w-12 text-center border border-slate-300 rounded-lg py-1 disabled:opacity-50"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1,
                              );
                            }}
                            disabled={isUpdating}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total and Remove */}
                    <div className="flex flex-col items-end justify-between ml-2">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Subtotal</p>
                        <p className="text-xl font-bold text-slate-900">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.productId);
                        }}
                        disabled={isRemoving}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="h-fit">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({cart.items.length} items)</span>
                      <span>KSh {cart.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-2xl text-primary">
                        KSh {cart.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || isEmpty}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Secure checkout powered by Daraja Market
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
