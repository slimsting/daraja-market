"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
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
import { ShoppingCart, User, LogOut, Package } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  console.log("Navbar auth state:", { user, isAuthenticated, isLoading });
  console.log("user###", user);
  console.log("user role###", user?.role);

  // track whether the window has been scrolled down at all
  const [isScrolled, setIsScrolled] = React.useState(false);

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
      className={`${isScrolled ? " opacity-90 backdrop-blur-xl bg-white" : "bg-white"} sticky top-0 z-50 shadow-sm transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-2xl font-bold text-primary">
              Daraja Market
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className=" text-xl font-medium text-slate-600 hover:text-primary transition-colors hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-xl font-medium text-slate-600 hover:text-primary transition-colors hover:scale-105"
            >
              Products
            </Link>
            {isAuthenticated && user?.role === "farmer" && (
              <Link
                href="/dashboard"
                className="text-xl font-medium text-slate-600 hover:text-primary transition-colors hover:scale-105"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side - Cart & Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {/* Cart badge - we'll add count later */}
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
                        My Products
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
                    className="text-xl font-medium text-white hover:text-primary transition-colors"
                  >
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
