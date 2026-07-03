"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllActivities,
  deleteActivity,
} from "@/store/features/activity/activitySlice";
import { ActivityType, ActivityItem } from "@/store/types";
import { toggleTaskStatus } from "@/store/features/task/taskSlice";
import { format } from "date-fns";
import { X, Phone, MessageSquare, ClipboardList, Edit, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AddNoteModal } from "./AddNoteModal";
import { LogCallModal } from "./LogCallModal";
import { AddTaskModal } from "./AddTaskModal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar } from "lucide-react";

interface AllActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
}

export function AllActivitiesModal({
  isOpen,
  onClose,
  hospitalId,
}: AllActivitiesModalProps) {
  const dispatch = useAppDispatch();
  const { activities, isFetchingActivities, totalActivities } = useAppSelector(
    (state) => state.activity,
  );

  const { selectedHospital } = useAppSelector((state) => state.hospital);

  const limit = 10; // items per page
  const [page, setPage] = useState(1);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);

  const handleEditClick = (activity: ActivityItem) => {
    setEditingActivity(activity);
    if (activity.activityType === ActivityType.NOTE) {
      setIsNoteModalOpen(true);
    } else if (activity.activityType === ActivityType.CALL_LOG) {
      setIsCallModalOpen(true);
    } else if (activity.activityType === ActivityType.TASK) {
      setIsTaskModalOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchAllActivities({
          hospitalId,
          page,
          limit,
          showAll: true,
        }),
      );
    }
  }, [dispatch, isOpen, hospitalId, page]);

  const totalPages = Math.ceil(totalActivities / limit);

  const handleDelete = async (id: string, type: ActivityType) => {
    try {
      await dispatch(deleteActivity({ id, type })).unwrap();
      toast.success("Activity deleted");
      // Refresh current page
      dispatch(
        fetchAllActivities({
          hospitalId,
          page,
          limit,
          showAll: true,
        }),
      );
    } catch (error: any) {
      toast.error(error || "Failed to delete activity");
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    try {
      await dispatch(toggleTaskStatus(taskId)).unwrap();
      dispatch(
        fetchAllActivities({
          hospitalId,
          page,
          limit,
          showAll: true,
        }),
      );
    } catch (error: any) {
      toast.error(error || "Failed to toggle task status");
    }
  };

  const renderActivityItem = (activity: ActivityItem) => {
    switch (activity.activityType) {
      case ActivityType.CALL_LOG:
        return (
          <div
            key={activity._id}
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4"
            style={{
              borderLeftColor: activity.products?.[0]?.name?.toLowerCase().includes("elevate")
                ? "#f59e0b"
                : activity.products?.[0]?.name?.toLowerCase().includes("heelpod") || activity.products?.[0]?.name?.toLowerCase().includes("hellpod")
                  ? "#f43f5e"
                  : activity.products?.[0]?.name?.toLowerCase().includes("mac")
                    ? "#2563eb"
                    : "transparent"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-2 rounded-full border border-emerald-100 mt-0.5 shrink-0">
                {<Phone className="h-4 w-4 text-emerald-600" />}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground">Call</h4>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {format(new Date(activity.Date), "MMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="text-sm text-foreground mt-2 font-medium wrap-break-word leading-relaxed">
                  {activity.notes}
                </p>

                {activity.products && activity.products.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.products.map((p: any, idx: number) => (
                      <Badge key={idx} variant="outline" className={cn(
                        "w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        p.name?.toLowerCase().includes("elevate") && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
                        (p.name?.toLowerCase().includes("heelpod") || p.name?.toLowerCase().includes("hellpod")) && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
                        p.name?.toLowerCase().includes("mac") && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
                      )}>
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-[11px] font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                  <span>by</span>
                  <span className="text-muted-foreground">
                    {typeof activity.user === "object"
                      ? (activity.user as any).name
                      : activity.user}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditClick(activity)}
                className="text-muted-foreground hover:text-foreground transition-all duration-200 p-1 cursor-pointer"
                title="Edit Call Log"
              >
                <Edit className="h-4 w-4" />
              </button>
              <ConfirmDialog
                title="Delete Call Log"
                description="Are you sure you want to delete this call log? This action cannot be undone."
                onConfirm={() => handleDelete(activity._id, ActivityType.CALL_LOG)}
                confirmText="Delete"
              >
                <button
                  className="text-muted-foreground hover:text-destructive transition-all duration-200 p-1 cursor-pointer"
                  title="Delete Call Log"
                >
                  <X className="h-4 w-4" />
                </button>
              </ConfirmDialog>
            </div>
          </div>
        );
      case ActivityType.NOTE:
        return (
          <div
            key={activity._id}
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4"
            style={{
              borderLeftColor: activity.products?.[0]?.name?.toLowerCase().includes("elevate")
                ? "#f59e0b"
                : activity.products?.[0]?.name?.toLowerCase().includes("heelpod") || activity.products?.[0]?.name?.toLowerCase().includes("hellpod")
                  ? "#f43f5e"
                  : activity.products?.[0]?.name?.toLowerCase().includes("mac")
                    ? "#2563eb"
                    : "transparent"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-full border border-blue-100 mt-0.5 shrink-0">
                {<MessageSquare className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground">Note</h4>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
                <div className="text-sm text-foreground mt-2 font-medium wrap-break-word leading-relaxed">
                  {activity.notes}
                </div>
                {activity.notes.includes("@") && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                      Mentioned:
                    </span>
                    {/* Simple mention display */}
                    <span className="text-muted-foreground text-[10px]">{activity.notes.split("@")[1].split(" ")[0]}</span>
                  </div>
                )}

                {activity.products && activity.products.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.products.map((p: any, idx: number) => (
                      <Badge key={idx} variant="outline" className={cn(
                        "w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        p.name?.toLowerCase().includes("elevate") && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
                        (p.name?.toLowerCase().includes("heelpod") || p.name?.toLowerCase().includes("hellpod")) && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
                        p.name?.toLowerCase().includes("mac") && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
                      )}>
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-[11px] font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                  <span>by</span>
                  <span className="text-muted-foreground">
                    {typeof activity.user === "object"
                      ? (activity.user as any).name
                      : activity.user}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditClick(activity)}
                className="text-muted-foreground hover:text-foreground transition-all duration-200 p-1 cursor-pointer"
                title="Edit Note"
              >
                <Edit className="h-4 w-4" />
              </button>
              <ConfirmDialog
                title="Delete Note"
                description="Are you sure you want to delete this note? This action cannot be undone."
                onConfirm={() => handleDelete(activity._id, ActivityType.NOTE)}
                confirmText="Delete"
              >
                <button
                  className="text-muted-foreground hover:text-destructive transition-all duration-200 p-1 cursor-pointer"
                  title="Delete Note"
                >
                  <X className="h-4 w-4" />
                </button>
              </ConfirmDialog>
            </div>
          </div>
        );
      case ActivityType.TASK:
        return (
          <div
            key={activity._id}
            className={cn(
              "group relative flex flex-col gap-2 p-4 border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4",
              activity.completed && "bg-green-50/40 dark:bg-green-950/10"
            )}
            style={{
              borderLeftColor: activity.completed
                ? "#22c55e"
                : activity.products?.[0]?.name?.toLowerCase().includes("elevate")
                  ? "#f59e0b"
                  : activity.products?.[0]?.name?.toLowerCase().includes("heelpod") || activity.products?.[0]?.name?.toLowerCase().includes("hellpod")
                    ? "#f43f5e"
                    : activity.products?.[0]?.name?.toLowerCase().includes("mac")
                      ? "#2563eb"
                      : "transparent"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleToggleTaskStatus(activity._id)}
                  className={cn(
                    "flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all cursor-pointer shrink-0",
                    activity.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-muted-foreground/40 hover:border-green-400 bg-transparent"
                  )}
                  title={activity.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {activity.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <ClipboardList className="h-3.5 w-3.5 text-muted-foreground/40" />
                  )}
                </button>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className={cn(
                  "text-sm font-bold leading-tight",
                  activity.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {activity.title}
                </h4>
                {activity.description && (
                  <p className={cn(
                    "text-sm mt-1 font-medium wrap-break-word leading-tight",
                    activity.completed ? "line-through text-muted-foreground/60" : "text-muted-foreground"
                  )}>
                    {activity.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {format(new Date(activity.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  {activity.reminders && activity.reminders.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 px-2 py-0 h-4.5 rounded text-[9px] font-bold uppercase shadow-none">
                        Email
                      </Badge>
                    </div>
                  )}
                  {activity.products && activity.products.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {activity.products.map((p: any, idx: number) => (
                        <Badge key={idx} variant="outline" className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                          p.name?.toLowerCase().includes("elevate") && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
                          (p.name?.toLowerCase().includes("heelpod") || p.name?.toLowerCase().includes("hellpod")) && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
                          p.name?.toLowerCase().includes("mac") && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50"
                        )}>
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary and Secondary Assignees */}
                <div className="text-[10px] font-semibold text-muted-foreground mt-2 flex flex-wrap items-center gap-2">
                  <span>Assigned to:</span>
                  <span className={cn("font-bold", activity.completed ? "text-muted-foreground/60" : "text-foreground")}>
                    {activity.user?.name || (typeof activity.user === "object" ? (activity.user as any).name : "User")}
                  </span>
                  {activity.secondaryAssignees && activity.secondaryAssignees.length > 0 && (
                    <>
                      <span>with</span>
                      {activity.secondaryAssignees.map((u: any, idx: number) => (
                        <span key={u._id || idx} className="bg-muted px-1.5 py-0.5 rounded text-foreground font-bold">
                          {u.name || u}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditClick(activity)}
                className="text-muted-foreground hover:text-foreground transition-all duration-200 p-1 cursor-pointer"
                title="Edit Task"
              >
                <Edit className="h-4 w-4" />
              </button>
              <ConfirmDialog
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={() => handleDelete(activity._id, ActivityType.TASK)}
                confirmText="Delete"
              >
                <button
                  className="text-muted-foreground hover:text-destructive transition-all duration-200 p-1 cursor-pointer"
                  title="Delete Task"
                >
                  <X className="h-4 w-4" />
                </button>
              </ConfirmDialog>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">All Activities</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Showing all activities for this hospital.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 max-h-[400px]">
            <div className="flex flex-col gap-4 py-1 pr-3">
              {isFetchingActivities ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activities found.</p>
              ) : (
                activities.map(renderActivityItem)
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
          <DialogFooter />
        </DialogContent>
      </Dialog>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingActivity(null);
        }}
        hospitalId={hospitalId}
        noteId={editingActivity?.activityType === ActivityType.NOTE ? editingActivity._id : undefined}
        initialNotes={editingActivity?.activityType === ActivityType.NOTE ? editingActivity.notes : undefined}
        initialProducts={editingActivity?.activityType === ActivityType.NOTE ? (editingActivity.products || []).map((p: any) => typeof p === "object" ? p._id : p) : undefined}
      />
      <LogCallModal
        isOpen={isCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setEditingActivity(null);
        }}
        hospitalId={hospitalId}
        contacts={selectedHospital?.contacts || []}
        callLogId={editingActivity?.activityType === ActivityType.CALL_LOG ? editingActivity._id : undefined}
        initialData={
          editingActivity?.activityType === ActivityType.CALL_LOG
            ? {
              Date: editingActivity.Date,
              contact: typeof editingActivity.contact === "object" ? (editingActivity.contact as any)?._id : editingActivity.contact,
              notes: editingActivity.notes,
              products: (editingActivity.products || []).map((p: any) => typeof p === "object" ? p._id : p),
            }
            : undefined
        }
      />
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingActivity(null);
        }}
        hospitalId={hospitalId}
        hospitalName={selectedHospital?.hospitalName || ""}
        taskId={editingActivity?.activityType === ActivityType.TASK ? editingActivity._id : undefined}
        initialData={
          editingActivity?.activityType === ActivityType.TASK
            ? {
              title: editingActivity.title,
              description: editingActivity.description,
              dueDate: editingActivity.dueDate,
              reminders: editingActivity.reminders || [],
              products: (editingActivity.products || []).map((p: any) => typeof p === "object" ? p._id : p),
              user: typeof editingActivity.user === "object" ? (editingActivity.user as any)?._id : editingActivity.user,
              secondaryAssignees: (editingActivity.secondaryAssignees || []).map((u: any) => typeof u === "object" ? u._id : u),
            }
            : undefined
        }
      />
    </>
  );
}
