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
import { createIDN, updateIDN } from "@/store/features/idn/idnSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { idnSchema, IDNFormValues } from "@/validations/idn.validations";
import { IDNModalProps } from "@/types";

export function IDNModal({ isOpen, onClose, onSuccess, idn }: IDNModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateIDNLoading, isUpdateIDNLoading } = useAppSelector(
    (state) => state.idn,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IDNFormValues>({
    resolver: zodResolver(idnSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (idn && isOpen) {
      reset({
        name: idn.name,
      });
    } else if (!isOpen) {
      reset({
        name: "",
      });
    }
  }, [idn, reset, isOpen]);

  const onSubmit = async (data: IDNFormValues) => {
    try {
      if (idn) {
        await dispatch(updateIDN({ id: idn._id, ...data })).unwrap();
        toast.success("IDN updated successfully");
      } else {
        await dispatch(createIDN(data)).unwrap();
        toast.success("IDN created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error || `Failed to ${idn ? "update" : "create"} IDN`);
    }
  };

  const isLoading = isCreateIDNLoading || isUpdateIDNLoading;

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{idn ? "Edit IDN" : "Add New IDN"}</DialogTitle>
          <DialogDescription>
            {idn
              ? "Update the IDN's information below."
              : "Enter the details for the new IDN."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">
                IDN Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="name"
                placeholder="Enter IDN name"
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
              {idn ? "Update IDN" : "Create IDN"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
