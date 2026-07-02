"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { changePassword } from "@/store/features/auth/authSlice";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/validations/auth.validations";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const dispatch = useAppDispatch();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await dispatch(changePassword(data)).unwrap();
      toast.success("Password changed successfully");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error || "Failed to change password");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="h-5 w-5" /> Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter your current password and a new password.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <Label className="text-xs font-semibold">Current Password</Label>
            <div className="relative mt-1.5">
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    className="text-xs h-9 bg-muted pr-9"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-[10px] text-destructive mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">New Password</Label>
            <div className="relative mt-1.5">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className="text-xs h-9 bg-muted pr-9"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[10px] text-destructive mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">
              Confirm New Password
            </Label>
            <div className="relative mt-1.5">
              <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="text-xs h-9 bg-muted pr-9"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-[10px] text-destructive mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#09090b] text-white hover:bg-[#27272a] cursor-pointer font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
