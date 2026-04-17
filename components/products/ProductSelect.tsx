"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProducts } from "@/store/features/product/productSlice";

interface ProductSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function ProductSelect({
  value,
  onValueChange,
  className,
  placeholder = "Select Product",
}: ProductSelectProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 1000 }));
    }
  }, [dispatch, products.length]);

  return (
    <Select value={value || "all"} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-border">
        <SelectItem value="all">All Products</SelectItem>
        {products.map((product) => (
          <SelectItem key={product?._id} value={product?._id}>
            {product?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
