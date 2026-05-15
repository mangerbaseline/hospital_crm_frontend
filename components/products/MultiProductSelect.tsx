"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProducts } from "@/store/features/product/productSlice";
import { useEffect, useState } from "react";

interface MultiProductSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiProductSelect({
  value = [],
  onValueChange,
  className,
  placeholder = "Select Products",
}: MultiProductSelectProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 1000 }));
    }
  }, [dispatch, products.length]);

  const handleSelect = (currentValue: string) => {
    if (!onValueChange) return;
    const newValue = value.includes(currentValue)
      ? value.filter((item) => item !== currentValue)
      : [...value, currentValue];
    onValueChange(newValue);
  };

  const selectedProducts = products.filter((p) => value.includes(p._id));
  const displayText =
    selectedProducts.length > 0
      ? selectedProducts.length === 1
        ? selectedProducts[0].name
        : `${selectedProducts.length} Products selected`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="truncate">{displayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command onWheel={(e) => e.stopPropagation()}>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product._id}
                  value={product.name}
                  onSelect={() => handleSelect(product._id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(product._id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
