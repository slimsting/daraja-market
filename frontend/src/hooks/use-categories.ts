import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

import { CategorySample } from "@/types";

export function useCategories() {
  return useQuery<CategorySample[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/products/categories");
      // expected shape: { data: { categories: Array<{category,samples: string[]}> } }
      return response.data?.data?.categories || [];
    },
  });
}
