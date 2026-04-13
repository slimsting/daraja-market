"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Cart } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Menu,
  X,
  Leaf,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { data: cart } = useCart() as { data: Cart | undefined };
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    // run once in case the page loads already scrolled
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`${isScrolled ? " md:opacity-90 backdrop-blur-xl bg-white" : "bg-white"} sticky top-0 z-50 shadow-sm transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">
              <Leaf className=" text-green-500" />
            </span>
            <span className="text-2xl font-bold text-primary">
              Daraja Market
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="  text-xl font-medium text-slate-600  hover:text-green-600 transition-all hover:scale-105 duration-300"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-xl font-medium text-slate-600 hover:text-green-600 transition-all hover:scale-105 duration-300"
            >
              Products
            </Link>
            {isAuthenticated &&
              (user?.role === "farmer" || user?.role === "admin") && (
                <Link
                  href="/dashboard"
                  className="text-xl font-medium text-slate-600 hover:text-green-600 transition-all hover:scale-105 duration-300"
                >
                  Dashboard
                </Link>
              )}
          </div>

          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Right Side - Cart & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Auth Section */}

            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="relative h-12 w-12 rounded-full bg-green-500 font-bold hover:bg-green-600 cursor-pointer "
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white border-none p-4"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium leading-none">
                        {user.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "farmer" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="cursor-pointer text-green-500"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="cursor-pointer text-green-500"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer text-green-500"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link
                    href="/login"
                    className=" text-xl font-medium text-slate-600 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                </Button>
                <Button asChild className="bg-green-500 hover:bg-green-600">
                  <Link
                    href="/register"
                    className="text-xl font-medium text-white transition-colors"
                  >
                    Buy/Sell
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-5 space-y-4">
            <Link
              href="/"
              className="block text-xl font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block text-xl font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            {isAuthenticated && user?.role === "farmer" && (
              <Link
                href="/dashboard"
                className="block text-xl font-medium text-slate-600 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-slate-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Cart</span>
                  {cart?.items && cart.items.length > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                {user.role === "farmer" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center rounded-lg border border-gray-200 px-4 py-3 text-slate-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Products
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center rounded-lg border border-gray-200 px-4 py-3 text-slate-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-red-600 hover:bg-red-100"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block rounded-lg border border-gray-200 px-4 py-3 text-center text-xl font-medium text-slate-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block rounded-lg bg-green-500 px-4 py-3 text-center text-xl font-medium text-white hover:bg-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
