// src/components/features/auth/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginCredentials } from "@/types";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  // Extract error message from ApiError
  const errorMessage =
    error instanceof ApiError ? error.message : (error?.message ?? null);

  return (
    <Card className="w-full max-w-md shadow-lg border-none bg-green-200">
      <CardHeader className="space-y-1 text-center">
        <div className="text-5xl mb-2 flex items-center justify-center">
          <Leaf />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
        <CardDescription>Login to access Daraja Market</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API Error */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              {...register("email")}
              className={`${errors.email ? "border-red-500" : ""} bg-white border-none text-slate-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`${errors.password ? "border-red-500" : ""} bg-white border-none text-slate-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-sm">
        <p className="text-slate-600">
          Don{`&#39`}t have an account?
          <Link
            href="/register"
            className="text-primary pl-2 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
        <Link href="/" className="text-slate-500 hover:text-slate-700">
          ← Back to Home
        </Link>
      </CardFooter>
    </Card>
  );
}
