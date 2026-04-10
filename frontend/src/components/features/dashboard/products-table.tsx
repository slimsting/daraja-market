// src/components/features/dashboard/products-table.tsx
"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-slate-500">
          No products yet. Create your first product!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[200px]">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Price
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Stock
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50">
                <td className="px-3 sm:px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 bg-gradient-to-br from-green-400 to-primary rounded-lg flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover rounded-lg h-full w-full"
                      />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {product.name}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 line-clamp-1 max-w-[120px] sm:max-w-none">
                        {product.description}
                      </div>
                      <div className="text-xs text-slate-400 sm:hidden">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </td>
                <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                  <div className="text-sm text-slate-900">
                    KSh {product.price.toLocaleString()}
                    {product.unit && (
                      <span className="text-slate-500 text-xs">
                        /{product.unit}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-slate-900">
                    {product.quantity} {product.unit || "units"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                  {product.available ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link href={`/products/${product._id}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      onClick={() => onDelete(product._id)}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
