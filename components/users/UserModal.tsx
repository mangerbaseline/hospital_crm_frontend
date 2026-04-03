"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/store/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createUser, updateUser } from "@/store/features/user/userSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { userSchema } from "@/validations/user.validations";
import { z } from "zod";
import { UserModalProps } from "@/types";

type UserFormValues = z.infer<typeof userSchema>;

export function UserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserModalProps) {
  const dispatch = useAppDispatch();
  const { isCreateUserLoading, isUpdateUserLoading } = useAppSelector(
    (state) => state.user,
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.SALES,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: UserRole.SALES,
      });
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        const { password, ...rest } = data;
        await dispatch(
          updateUser({
            id: user._id,
            ...rest,
            ...(password ? { password } : {}),
          }),
        ).unwrap();
        toast.success("User updated successfully");
      } else {
        if (!data.password) {
          setError("password", {
            message: "Password is required for new users",
          });
          return;
        }
        await dispatch(createUser(data as any)).unwrap();
        toast.success("User created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error || "An error occurred");
    }
  };

  const isLoading = isCreateUserLoading || isUpdateUserLoading;

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update the user's information below."
              : "Enter the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" placeholder="your name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                placeholder="youremail@example.com"
                type="email"
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                Password {user && "(Optional)"}
              </FieldLabel>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.role]} />
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
              className="cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
