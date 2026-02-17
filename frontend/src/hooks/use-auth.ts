"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterData } from "@/types";
import { useRouter } from "next/navigation";

// Query keys
export const authKeys = {
  currentUser: ["auth", "current-user"] as const,
};

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        // User is not logged in - return null instead of throwing
        return null;
      }
    },
    retry: false,
    staleTime: Infinity, // User data doesn't change often
  });
}

// Hook for login
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (user) => {
      // Update cache with user data
      queryClient.setQueryData(authKeys.currentUser, user);
      // Redirect to home
      router.push("/");
      router.refresh();
    },
  });
}

// Hook for register
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (user) => {
      // Update cache with user data
      queryClient.setQueryData(authKeys.currentUser, user);
      // Redirect to home
      router.push("/");
      router.refresh();
    },
  });
}

// Hook for logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(authKeys.currentUser, null);
      // Clear all queries
      queryClient.clear();
      // Redirect to login
      router.push("/login");
    },
  });
}

// Combined auth hook with all functionality
export function useAuth() {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
