import React from "react";
export interface CategoryCardProps {
  category: string;
  samples?: string[];
  onClick?: () => void;
  selected?: boolean;
}

export function CategoryCard({
  category,
  samples = [],
  onClick,
  selected = false,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative h-40 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-150
        ${selected ? "ring-2 ring-green-500" : "hover:scale-105"}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://source.unsplash.com/featured/?${encodeURIComponent(
            category,
          )})`,
        }}
      />
      <div className="relative z-10 p-4 bg-black bg-opacity-30 h-full flex flex-col justify-end">
        <h3 className="text-white text-xl font-semibold capitalize">
          {category}
        </h3>
        <p className="text-white text-sm">
          {samples && samples.length > 0
            ? samples.join(", ")
            : "No samples yet"}
        </p>
      </div>
    </div>
  );
}
