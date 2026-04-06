"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createProduct,
  updateProduct,
} from "@/store/features/product/productSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { productSchema, ProductFormValues } from "@/validations/product.validations";
import { ProductModalProps } from "@/types";

export function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateProductLoading, isUpdateProductLoading } = useAppSelector(
    (state) => state.product,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        description: product.description,
      });
    } else if (!isOpen) {
      reset({
        name: "",
        description: "",
      });
    }
  }, [product, reset, isOpen]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (product) {
        await dispatch(
          updateProduct({ id: product._id, ...data }),
        ).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success("Product created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${product ? "update" : "create"} product`);
    }
  };

  const isLoading = isCreateProductLoading || isUpdateProductLoading;

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product's information below."
              : "Enter the details for the new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Product Name <span className="text-destructive">*</span></FieldLabel>
              <Input id="name" placeholder="Enter product name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description <span className="text-destructive">*</span></FieldLabel>
              <Textarea
                id="description"
                placeholder="Enter product description"
                className="resize-none min-h-[100px]"
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
