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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createGPO, updateGPO } from "@/store/features/gpo/gpoSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { gpoSchema, GPOFormValues } from "@/validations/gpo.validations";
import { GPOModalProps } from "@/types";

export function GPOModal({ isOpen, onClose, onSuccess, gpo }: GPOModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateGPOLoading, isUpdateGPOLoading } = useAppSelector(
    (state) => state.gpo,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GPOFormValues>({
    resolver: zodResolver(gpoSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (gpo && isOpen) {
      reset({
        name: gpo.name,
      });
    } else if (!isOpen) {
      reset({
        name: "",
      });
    }
  }, [gpo, reset, isOpen]);

  const onSubmit = async (data: GPOFormValues) => {
    try {
      if (gpo) {
        await dispatch(updateGPO({ id: gpo._id, ...data })).unwrap();
        toast.success("GPO updated successfully");
      } else {
        await dispatch(createGPO(data)).unwrap();
        toast.success("GPO created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${gpo ? "update" : "create"} GPO`);
    }
  };

  const isLoading = isCreateGPOLoading || isUpdateGPOLoading;

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{gpo ? "Edit GPO" : "Add New GPO"}</DialogTitle>
          <DialogDescription>
            {gpo
              ? "Update the GPO's information below."
              : "Enter the details for the new GPO."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">
                GPO Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="name"
                placeholder="Enter GPO name"
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
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
              {gpo ? "Update GPO" : "Create GPO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
