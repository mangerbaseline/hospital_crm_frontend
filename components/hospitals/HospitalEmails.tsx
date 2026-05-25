"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Mail,
  Send,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  RefreshCw,
  Loader2,
  Reply,
  Paperclip,
  Download,
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchReceivedEmails,
  fetchSentEmails,
  syncEmails,
  replyToEmail,
  sendEmail,
} from "@/store/features/mailbox/mailboxSlice";
import { EmailMessage } from "@/store/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  composeEmailSchema,
  ComposeEmailFormValues,
} from "@/validations/email.validations";

function EmailItem({
  email,
  type,
  onClick,
}: {
  email: EmailMessage;
  type: "received" | "sent";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col gap-1.5 p-4 w-full text-left bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-border ${
        type === "received"
          ? "border-l-4 border-l-blue-600"
          : "border-l-4 border-l-emerald-600"
      } overflow-hidden`}
    >
      <div className="flex flex-col w-full min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-1 w-full min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {type === "received" ? (
              <>
                <Inbox className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-sm font-bold text-foreground truncate">
                  {email.from?.address || "Unknown"}
                </span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-foreground truncate">
                  {email.toRecipients?.map((r) => r.address).join(", ") ||
                    "Unknown"}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col items-end shrink-0 ml-2">
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
              {format(new Date(email.receivedDateTime), "MMM d, yyyy")}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
              {format(new Date(email.receivedDateTime), "h:mm a")}
            </span>
          </div>
        </div>

        <p className="text-sm font-bold text-foreground truncate">
          {email.subject || "(No Subject)"}
        </p>

        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {email.bodyPreview || "No preview available"}
        </p>

        {email.ccRecipients && email.ccRecipients.length > 0 && (
          <p className="text-[11px] text-muted-foreground mt-1.5 truncate">
            CC: {email.ccRecipients.map((r) => r.address).join(", ")}
          </p>
        )}
      </div>
    </button>
  );
}

function EmailDetailModal({
  email,
  open,
  onClose,
  type,
}: {
  email: EmailMessage | null;
  open: boolean;
  onClose: () => void;
  type: "received" | "sent";
}) {
  const dispatch = useAppDispatch();
  const { isReplying } = useAppSelector((state) => state.mailbox);
  const [isReplyingMode, setIsReplyingMode] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [ccEmails, setCcEmails] = useState("");
  const [bccEmails, setBccEmails] = useState("");

  useEffect(() => {
    if (!open) {
      setIsReplyingMode(false);
      setReplyText("");
      setCcEmails("");
      setBccEmails("");
    }
  }, [open]);

  if (!email) return null;

  const isHtml = email.body?.contentType === "html";
  let bodyContent = isHtml
    ? email.body.content
    : email.body?.content || email.bodyPreview || "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Email Details
          </DialogTitle>
          <DialogDescription>
            Email from {email.from?.address}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="flex items-center gap-2">
            {type === "received" ? (
              <Inbox className="h-4 w-4 text-blue-500" />
            ) : (
              <Send className="h-4 w-4 text-emerald-500" />
            )}
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold uppercase shadow-none ${
                type === "received"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}
            >
              {type === "received" ? "Received" : "Sent"}
            </Badge>
            {email.importance === "high" && (
              <Badge
                variant="secondary"
                className="text-[10px] font-bold uppercase bg-red-50 text-red-600 border-red-200 shadow-none"
              >
                High Priority
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                From:
              </p>
              <p className="text-sm font-medium text-foreground">
                {email.from?.name}{" "}
                <span className="text-xs text-muted-foreground">
                  &lt;{email.from.address}&gt;
                </span>
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                To:
              </p>
              {email.toRecipients?.map((r, i) => (
                <p key={i} className="text-sm font-medium text-foreground">
                  {r.name}{" "}
                  <span className="text-xs text-muted-foreground">
                    &lt;{r.address}&gt;
                  </span>
                </p>
              ))}
            </div>

            {email.ccRecipients && email.ccRecipients.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  CC:
                </p>
                {email.ccRecipients.map((r, i) => (
                  <p key={i} className="text-sm font-medium text-foreground">
                    {r.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      &lt;{r.address}&gt;
                    </span>
                  </p>
                ))}
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Date:
              </p>
              <p className="text-sm font-medium text-foreground">
                {format(
                  new Date(email.receivedDateTime),
                  "EEEE, MMMM d, yyyy 'at' h:mm a",
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Subject:
              </p>
              <p className="text-sm font-bold text-foreground">
                {email.subject || "(No Subject)"}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            {isHtml ? (
              <div
                className="text-sm text-foreground leading-relaxed wrap-break-word [&>p]:mb-3 [&>a]:text-blue-600 [&>a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_table]:block [&_table]:overflow-x-auto overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            ) : (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word overflow-x-auto">
                {bodyContent}
              </p>
            )}
          </div>

          {email.attachments &&
            email.attachments.filter(
              (att) =>
                !att.isInline &&
                (!att.contentId ||
                  !bodyContent.includes(`cid:${att.contentId}`)),
            ).length > 0 && (
              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Paperclip className="h-3.5 w-3.5" />
                  Attachments (
                  {
                    email.attachments.filter(
                      (att) =>
                        !att.isInline &&
                        (!att.contentId ||
                          !bodyContent.includes(`cid:${att.contentId}`)),
                    ).length
                  }
                  )
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {email.attachments
                    .filter(
                      (att) =>
                        !att.isInline &&
                        (!att.contentId ||
                          !bodyContent.includes(`cid:${att.contentId}`)),
                    )
                    .map((att, i) => {
                      const ext =
                        (att.name || "").split(".").pop()?.toLowerCase() || "";
                      let Icon = FileIcon;
                      let iconColor = "text-blue-500";
                      let bgColor = "bg-blue-50";

                      if (["pdf"].includes(ext)) {
                        Icon = FileText;
                        iconColor = "text-red-500";
                        bgColor = "bg-red-50";
                      } else if (
                        ["jpg", "jpeg", "png", "gif", "svg"].includes(ext)
                      ) {
                        Icon = FileImage;
                        iconColor = "text-purple-500";
                        bgColor = "bg-purple-50";
                      } else if (["zip", "rar", "tar", "gz"].includes(ext)) {
                        Icon = FileArchive;
                        iconColor = "text-amber-500";
                        bgColor = "bg-amber-50";
                      } else if (["xls", "xlsx", "csv"].includes(ext)) {
                        Icon = FileSpreadsheet;
                        iconColor = "text-emerald-500";
                        bgColor = "bg-emerald-50";
                      } else if (["doc", "docx"].includes(ext)) {
                        Icon = FileText;
                        iconColor = "text-blue-600";
                        bgColor = "bg-blue-50";
                      }

                      return (
                        <a
                          key={i}
                          href={att.fileUrl}
                          download={att.name || "attachment"}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-linear-to-br from-background to-muted/20 hover:border-primary/30 hover:shadow-sm transition-all group overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                          <div className="flex items-center gap-3 overflow-hidden relative z-10">
                            <div
                              className={`p-2.5 rounded-lg ${bgColor} border border-border/50`}
                            >
                              <Icon className={`h-5 w-5 ${iconColor}`} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p
                                className="text-sm font-semibold text-foreground truncate"
                                title={att.name}
                              >
                                {att.name || "Attachment"}
                              </p>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase">
                                {ext || "FILE"}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all group-hover:scale-105 ml-2 shrink-0 relative z-10 shadow-sm"
                          >
                            <Download className="h-4 w-4 text-primary" />
                          </Button>
                        </a>
                      );
                    })}
                </div>
              </div>
            )}

          {isReplyingMode && (
            <div className="mt-4 space-y-3 p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-xs font-bold text-foreground">
                Reply to {email.from?.name || email.from?.address}
              </p>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                  CC Emails
                </label>
                <Input
                  placeholder="Separate multiple emails with commas"
                  value={ccEmails}
                  onChange={(e) => setCcEmails(e.target.value)}
                  className="h-8 text-sm bg-background border-border"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                  BCC Emails
                </label>
                <Input
                  placeholder="Separate multiple emails with commas"
                  value={bccEmails}
                  onChange={(e) => setBccEmails(e.target.value)}
                  className="h-8 text-sm bg-background border-border"
                />
              </div>

              <div className="bg-background rounded-md [&_.sun-editor]:border-border [&_.sun-editor]:rounded-md [&_.se-toolbar]:bg-muted/50 [&_.se-toolbar]:rounded-t-md [&_.se-toolbar]:outline-none [&_.se-resizing-bar]:bg-muted/50 [&_.se-resizing-bar]:border-border [&_.se-list-layer]:max-h-50! [&_.se-list-layer]:overflow-y-auto! [&_.se-list-layer]:top-full! [&_.se-list-layer]:bottom-auto!">
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
                    placeholder: "Type your reply here...",
                  }}
                  onChange={(content) => setReplyText(content)}
                  defaultValue={replyText}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsReplyingMode(false);
                    setReplyText("");
                    setCcEmails("");
                    setBccEmails("");
                  }}
                  disabled={isReplying}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    const isReplyEmpty =
                      !replyText ||
                      replyText === "<p><br></p>" ||
                      !replyText.trim();
                    if (isReplyEmpty) return;

                    const parseEmails = (emailsStr: string) =>
                      emailsStr
                        .split(",")
                        .map((e) => e.trim())
                        .filter((e) => e !== "");

                    try {
                      await dispatch(
                        replyToEmail({
                          messageId: email.graphId,
                          comment: replyText,
                          ccEmails: parseEmails(ccEmails),
                          bccEmails: parseEmails(bccEmails),
                        }),
                      ).unwrap();
                      toast.success("Reply sent successfully");
                      setIsReplyingMode(false);
                      setReplyText("");
                      setCcEmails("");
                      setBccEmails("");
                    } catch (error: any) {
                      toast.error(error || "Failed to send reply");
                    }
                  }}
                  disabled={
                    isReplying ||
                    !replyText ||
                    replyText === "<p><br></p>" ||
                    !replyText.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isReplying ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {isReplying ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 mt-4 pt-4 border-t border-border">
          {!isReplyingMode && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              onClick={() => setIsReplyingMode(true)}
            >
              <Reply className="h-3.5 w-3.5 mr-1.5" />
              Reply
            </Button>
          )}
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ComposeEmailModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { isSending } = useAppSelector((state) => state.mailbox);
  const authUser = useAppSelector((state) => state.auth.user);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
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
    if (!open) {
      reset();
      setShowCc(false);
      setShowBcc(false);
    }
  }, [open, reset]);

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
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to send email");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Compose Email
          </DialogTitle>
          <DialogDescription>
            Send a new email from {authUser?.email || "your account"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                To
              </label>
              <Input
                placeholder="recipient@example.com"
                {...register("toEmail")}
                className="h-8 text-sm bg-muted/30 border-border"
              />
              {errors.toEmail && (
                <p className="text-xs text-destructive mt-1">
                  {errors.toEmail.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider cursor-pointer"
                >
                  + CC
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider cursor-pointer"
                >
                  + BCC
                </button>
              )}
            </div>

            {showCc && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    CC
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCc(false)}
                    className="cursor-pointer"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <Input
                  placeholder="Separate multiple emails with commas"
                  {...register("ccEmails")}
                  className="h-8 text-sm bg-muted/30 border-border"
                />
                {errors.ccEmails && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.ccEmails.message}
                  </p>
                )}
              </div>
            )}

            {showBcc && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    BCC
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowBcc(false)}
                    className="cursor-pointer"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <Input
                  placeholder="Separate multiple emails with commas"
                  {...register("bccEmails")}
                  className="h-8 text-sm bg-muted/30 border-border"
                />
                {errors.bccEmails && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.bccEmails.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                Subject
              </label>
              <Input
                placeholder="Email subject"
                {...register("subject")}
                className="h-8 text-sm bg-muted/30 border-border"
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                Content
              </label>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <div className="bg-background rounded-md [&_.sun-editor]:border-border [&_.sun-editor]:rounded-md [&_.se-toolbar]:bg-muted/50 [&_.se-toolbar]:rounded-t-md [&_.se-toolbar]:outline-none [&_.se-resizing-bar]:bg-muted/50 [&_.se-resizing-bar]:border-border [&_.se-list-layer]:max-h-50! [&_.se-list-layer]:overflow-y-auto! [&_.se-list-layer]:top-full! [&_.se-list-layer]:bottom-auto!">
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
                        placeholder: "Type your email here...",
                      }}
                      onChange={(val) => field.onChange(val)}
                      defaultValue={field.value}
                    />
                  </div>
                )}
              />
              {errors.content && (
                <p className="text-xs text-destructive mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 mt-4 pt-4 border-t border-border">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                disabled={isSending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={isSending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HospitalEmails({ hospitalId }: { hospitalId: string }) {
  const dispatch = useAppDispatch();
  const {
    receivedEmails,
    sentEmails,
    isFetchingReceived,
    isFetchingSent,
    totalReceived,
    totalSent,
    pageReceived,
    pageSent,
    isSyncing,
  } = useAppSelector((state) => state.mailbox);

  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [emailType, setEmailType] = useState<"received" | "sent">("received");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 10;
  const currentPage = emailType === "received" ? pageReceived : pageSent;
  const totalItems = emailType === "received" ? totalReceived : totalSent;
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchReceivedEmails({
          page: 1,
          limit,
          search: searchQuery,
          hospitalId,
        }),
      );
      dispatch(
        fetchSentEmails({ page: 1, limit, search: searchQuery, hospitalId }),
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, hospitalId]);

  const handleEmailClick = (email: EmailMessage, type: "received" | "sent") => {
    setSelectedEmail(email);
    setEmailType(type);
    setIsDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    if (emailType === "received") {
      dispatch(
        fetchReceivedEmails({
          page: newPage,
          limit,
          search: searchQuery,
          hospitalId,
        }),
      );
    } else {
      dispatch(
        fetchSentEmails({
          page: newPage,
          limit,
          search: searchQuery,
          hospitalId,
        }),
      );
    }
  };

  const handleSync = async () => {
    try {
      await dispatch(syncEmails({ hospitalId })).unwrap();
      toast.success("Emails synced successfully");
      dispatch(
        fetchReceivedEmails({
          page: 1,
          limit,
          search: searchQuery,
          hospitalId,
        }),
      );
      dispatch(
        fetchSentEmails({ page: 1, limit, search: searchQuery, hospitalId }),
      );
    } catch (error: any) {
      toast.error(error || "Failed to sync emails");
    }
  };

  const renderEmptyState = (type: string) => (
    <div className="flex flex-col items-center justify-center py-16">
      <Mail className="h-8 w-8 text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground font-medium">
        No {type} emails found
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16 shrink-0" />
          </div>
          <Skeleton className="h-4 w-1/2 mt-1" />
          <div className="space-y-2 mt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[85%]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="flex flex-col gap-0 h-full min-h-0 min-w-0 overflow-hidden pt-6 pb-4 px-6 shadow-md border border-border rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Mail className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">
            Email Communications
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
            onClick={() => setIsComposeOpen(true)}
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:block ">Compose</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg cursor-pointer shadow-sm hover:bg-muted transition-all"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:block">
              {isSyncing ? "Syncing..." : "Sync Mails"}
            </span>
          </Button>
        </div>
      </div>

      <div className="relative mt-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search emails..."
          className="pl-9 pr-8 h-8 border-border bg-muted/30 focus-visible:bg-background transition-colors rounded-lg shadow-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Tabs
        defaultValue="received"
        className="mt-3"
        onValueChange={(val) => setEmailType(val as "received" | "sent")}
      >
        <TabsList className="w-full">
          <TabsTrigger
            value="received"
            className="flex-1 gap-1.5 text-xs font-semibold"
          >
            <Inbox className="h-3.5 w-3.5" />
            Received
            {totalReceived > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4.5 px-1.5 text-[9px] font-bold bg-blue-50 text-blue-600 border-blue-200 shadow-none"
              >
                {totalReceived}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="flex-1 gap-1.5 text-xs font-semibold"
          >
            <Send className="h-3.5 w-3.5" />
            Sent
            {totalSent > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4.5 px-1.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 border-emerald-200 shadow-none"
              >
                {totalSent}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4 outline-none">
          <ScrollArea className="h-75">
            <div className="flex flex-col gap-3">
              {isFetchingReceived
                ? renderLoadingState()
                : receivedEmails.length === 0
                  ? renderEmptyState("received")
                  : receivedEmails.map((email) => (
                      <EmailItem
                        key={email._id}
                        email={email}
                        type="received"
                        onClick={() => handleEmailClick(email, "received")}
                      />
                    ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sent" className="mt-4 outline-none">
          <ScrollArea className="h-75">
            <div className="flex flex-col gap-3">
              {isFetchingSent
                ? renderLoadingState()
                : sentEmails.length === 0
                  ? renderEmptyState("sent")
                  : sentEmails.map((email) => (
                      <EmailItem
                        key={email._id}
                        email={email}
                        type="sent"
                        onClick={() => handleEmailClick(email, "sent")}
                      />
                    ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={
                currentPage <= 1 || isFetchingReceived || isFetchingSent
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage >= totalPages ||
                isFetchingReceived ||
                isFetchingSent
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EmailDetailModal
        email={selectedEmail}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        type={emailType}
      />

      <ComposeEmailModal
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </Card>
  );
}
