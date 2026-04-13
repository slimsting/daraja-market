// src/components/features/auth/register-form.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { registerSchema } from "@/types";
import { useRegister } from "@/hooks/use-auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf } from "lucide-react";

// Extend register schema with confirmPassword
const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error shows on confirmPassword field
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "farmer",
      location: "",
    },
  });

  const [selectedRole, setSelectedRole] = useState<"farmer" | "broker">(
    "farmer",
  );

  const onSubmit = (data: RegisterFormData) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    void confirmPassword;
    register(registerData);
  };

  // Extract error message from ApiError
  const errorMessage =
    error instanceof ApiError ? error.message : (error?.message ?? null);

  return (
    <Card className="w-full max-w-2xl shadow-lg bg-green-200 border-none">
      <CardHeader className="space-y-1 text-center">
        <div className="text-5xl mb-2 flex items-center justify-center">
          <Leaf />
        </div>
        <CardTitle className="text-2xl font-bold">Join Daraja Market</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API Error */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...registerField("name")}
                  className={`${errors.name ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  {...registerField("email")}
                  className={`${errors.email ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  {...registerField("phone")}
                  className={`${errors.phone ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>

              {selectedRole === "farmer" && (
                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="Nairobi, Kenya"
                    {...registerField("location")}
                    className={`${errors.location ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Role Field */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select
                  defaultValue="farmer"
                  onValueChange={(value) => {
                    const roleValue = value as "farmer" | "broker";
                    setValue("role", roleValue);
                    setSelectedRole(roleValue);
                  }}
                >
                  <SelectTrigger
                    className={`${errors.role ? "border-red-500" : ""} bg-green-500 text-white border-none`}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className=" bg-white border-none">
                    <SelectItem value="farmer">
                      <span className=" hover:text-green-500">
                        Farmer - I want to sell products
                      </span>
                    </SelectItem>
                    <SelectItem value="broker" className=" hover:bg-green-500">
                      <span className=" hover:text-green-500">
                        Customer - I want to buy products
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...registerField("password")}
                  className={`${errors.password ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerField("confirmPassword")}
                  className={`${errors.confirmPassword ? "border-red-500" : ""} bg-white text-slate-500 border-none`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-sm">
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
        <Link href="/" className="text-slate-500 hover:text-slate-700">
          ← Back to Home
        </Link>
      </CardFooter>
    </Card>
  );
}
