"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { sendEmail } from "@/store/features/mailbox/mailboxSlice";
import {
  composeEmailSchema,
  ComposeEmailFormValues,
} from "@/validations/email.validations";
import { toast } from "sonner";

interface SendEmailToContactModalProps {
  children: React.ReactNode;
  contact: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    designation?: string;
  };
}

export function SendEmailToContactModal({
  children,
  contact,
}: SendEmailToContactModalProps) {
  const dispatch = useAppDispatch();
  const { isSending } = useAppSelector((state) => state.mailbox);
  const authUser = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ComposeEmailFormValues>({
    resolver: zodResolver(composeEmailSchema),
    defaultValues: {
      toEmail: "",
      subject: "",
      content: "",
      ccEmails: "",
      bccEmails: "",
    },
  });

  useEffect(() => {
    if (open && contact?.email) {
      setValue("toEmail", contact.email);
    } else if (!open) {
      reset();
      setShowCc(false);
      setShowBcc(false);
    }
  }, [open, contact, reset, setValue]);

  const parseEmails = (str: string = "") =>
    str
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e !== "");

  const onSubmit = async (data: ComposeEmailFormValues) => {
    try {
      await dispatch(
        sendEmail({
          fromEmail: authUser?.email || "",
          toEmail: data.toEmail.trim(),
          subject: data.subject.trim(),
          content: data.content,
          ccEmails: parseEmails(data.ccEmails),
          bccEmails: parseEmails(data.bccEmails),
        }),
      ).unwrap();
      toast.success("Email sent successfully");
      setOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error || "Failed to send email");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          reset();
          setShowCc(false);
          setShowBcc(false);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email {contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName}
          </DialogTitle>
          <DialogDescription>
            Send an email to {contact.email}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto space-y-3 pr-3"
        >
          <div>
            <Label className="text-xs font-semibold">To:</Label>
            <Input
              type="email"
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              {...register("toEmail")}
              readOnly
            />
            {errors.toEmail && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.toEmail.message}
              </p>
            )}
          </div>

          {showCc && (
            <div>
              <Label className="text-xs font-semibold">CC:</Label>
              <Input
                type="text"
                placeholder="Separate multiple emails with commas"
                className="text-xs h-9 mt-1.5 bg-muted border-border"
                {...register("ccEmails")}
              />
            </div>
          )}

          {showBcc && (
            <div>
              <Label className="text-xs font-semibold">BCC:</Label>
              <Input
                type="text"
                placeholder="Separate multiple emails with commas"
                className="text-xs h-9 mt-1.5 bg-muted border-border"
                {...register("bccEmails")}
              />
            </div>
          )}

          <div className="flex gap-2">
            {!showCc && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCc(true)}
              >
                + CC
              </Button>
            )}
            {!showBcc && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowBcc(true)}
              >
                + BCC
              </Button>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Subject:</Label>
            <Input
              type="text"
              className="text-xs h-9 mt-1.5 bg-muted border-border"
              placeholder="Enter subject"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Message:</Label>
            <div className="mt-1.5 bg-background rounded-md [&_.sun-editor]:border-border [&_.sun-editor]:rounded-md [&_.se-toolbar]:bg-muted/50 [&_.se-toolbar]:rounded-t-md [&_.se-toolbar]:outline-none [&_.se-resizing-bar]:bg-muted/50 [&_.se-resizing-bar]:border-border [&_.se-list-layer]:max-h-50! [&_.se-list-layer]:overflow-y-auto! [&_.se-list-layer]:top-full! [&_.se-list-layer]:bottom-auto!">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <SunEditor
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize", "formatBlock"],
                        ["bold", "underline", "italic", "strike"],
                        ["fontColor", "hiliteColor"],
                        ["removeFormat"],
                        "/",
                        [
                          "outdent",
                          "indent",
                          "align",
                          "horizontalRule",
                          "list",
                          "table",
                        ],
                        ["link", "image"],
                        ["fullScreen", "showBlocks", "codeView"],
                      ],
                      minHeight: "250px",
                      placeholder: "Type your email message here...",
                    }}
                    onChange={(content) => field.onChange(content)}
                    defaultValue={field.value}
                  />
                )}
              />
            </div>
            {errors.content && (
              <p className="text-[10px] text-destructive mt-1 font-medium">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
