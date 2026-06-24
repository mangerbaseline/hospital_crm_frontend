import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ProductTheme {
  bgSolid: string;
  bgLight: string;
  border: string;
  textTitle: string;
  textAmount: string;
  textLabel: string;
  bgKanban: string;
}

export function getProductTheme(productName: string): ProductTheme {
  const name = (productName || "").toLowerCase();
  
  if (name.includes("mac")) {
    return {
      bgSolid: "bg-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      textTitle: "text-blue-900",
      textAmount: "text-blue-700",
      textLabel: "text-blue-800",
      bgKanban: "bg-blue-500",
    };
  }
  
  if (name.includes("elevate")) {
    return {
      bgSolid: "bg-amber-500",
      bgLight: "bg-amber-50",
      border: "border-amber-200",
      textTitle: "text-amber-900",
      textAmount: "text-amber-700",
      textLabel: "text-amber-800",
      bgKanban: "bg-amber-500",
    };
  }
  
  if (name.includes("heelpod") || name.includes("hellpod")) {
    return {
      bgSolid: "bg-rose-500",
      bgLight: "bg-rose-50",
      border: "border-rose-200",
      textTitle: "text-rose-900",
      textAmount: "text-rose-700",
      textLabel: "text-rose-800",
      bgKanban: "bg-rose-500",
    };
  }

  return {
    bgSolid: "bg-slate-600",
    bgLight: "bg-slate-50",
    border: "border-slate-200",
    textTitle: "text-slate-900",
    textAmount: "text-slate-700",
    textLabel: "text-slate-800",
    bgKanban: "bg-slate-500",
  };
}
