"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProduct } from "@/hooks/use-products";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const categoryOptions = [
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "poultry",
  "other",
];

const unitOptions = ["kg", "piece", "bag", "crate"];

type FormValues = {
  name: string;
  category?: string;
  description?: string;
  price: number;
  unit?: string;
  quantity: number;
  available: boolean;
  harvestDate?: string;
  organic: boolean;
  tags?: string;
  images?: FileList;
};

interface EditProductModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditProductModal({
  open,
  product,
  onClose,
  onUpdated,
}: EditProductModalProps) {
  const { mutate, error } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      unit: "",
      quantity: 0,
      available: true,
      harvestDate: "",
      organic: false,
      tags: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price ?? 0,
        unit: product.unit || "",
        quantity: product.quantity ?? 0,
        available: product.available ?? true,
        harvestDate: product.harvestDate ? String(product.harvestDate) : "",
        organic: product.organic ?? false,
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
    }
  }, [product, reset]);

  const submitUpdateProduct = async (data: FormValues) => {
    if (!product) return;

    const payload: Partial<Product> = {
      name: data.name.trim(),
      category: data.category
        ? (data.category as Product["category"])
        : undefined,
      description: data.description?.trim() || undefined,
      price: data.price,
      unit: data.unit ? (data.unit as Product["unit"]) : undefined,
      quantity: data.quantity,
      available: data.available,
      harvestDate: data.harvestDate || undefined,
      organic: data.organic,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      images: data.images ? Array.from(data.images) : undefined,
    };

    mutate(
      { id: String(product._id), data: payload },
      {
        onSuccess: () => {
          reset();
          onUpdated();
          onClose();
        },
      },
    );
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 h-screen sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-green-200 p-4 sm:p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold">Edit Product</h3>
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(submitUpdateProduct)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Name *
              </Label>
              <Input
                className=" bg-white border-none"
                autoComplete="off"
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 1, message: "Name cannot be empty" },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category" className="mb-2">
                Category *
              </Label>
              <select
                id="category"
                {...register("category", {
                  required: "Category is required",
                })}
                className="border-input h-9 w-full rounded-md border-none bg-white px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50"
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price" className="mb-2">
                Price (KSh) *
              </Label>
              <Input
                className="border-none bg-white"
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unit" className="mb-2">
                Unit *
              </Label>
              <select
                id="unit"
                {...register("unit", { required: "Unit is required" })}
                className="border-input h-9 w-full rounded-md border-none bg-white px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50"
              >
                <option value="">Select unit</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-sm text-red-600">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity" className="mb-2">
                Quantity *
              </Label>
              <Input
                className=" border-none bg-white"
                id="quantity"
                type="number"
                min="0"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                  valueAsNumber: true,
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="harvestDate" className="mb-2">
                Harvest Date
              </Label>
              <Input
                className=" bg-white border-none"
                id="harvestDate"
                type="date"
                {...register("harvestDate")}
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                id="available"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                {...register("available")}
              />
              <Label htmlFor="available" className="mb-0">
                Available
              </Label>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                id="organic"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                {...register("organic")}
              />
              <Label htmlFor="organic" className="mb-0">
                Organic
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Description
            </Label>
            <Textarea
              className="border-none bg-white"
              id="description"
              rows={3}
              {...register("description")}
            />
          </div>

          <div>
            <Label htmlFor="tags" className="mb-2">
              Tags (comma-separated)
            </Label>
            <Input
              className="border-none bg-white"
              id="tags"
              {...register("tags")}
            />
          </div>

          <div>
            <Label htmlFor="images" className="mb-2">
              Add New Images
            </Label>
            <Input
              className="border-none bg-white hover:text-green-500"
              id="images"
              type="file"
              multiple
              {...register("images")}
            />
            {Array.isArray(product.images) && product.images.length > 0 && (
              <p className="mt-2 text-sm text-slate-700">
                Existing images will remain unless replaced.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {(() => {
                if (
                  error &&
                  typeof error === "object" &&
                  "message" in error &&
                  typeof (error as { message?: unknown }).message === "string"
                ) {
                  return (error as { message: string }).message;
                }
                return "Failed to update product.";
              })()}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
