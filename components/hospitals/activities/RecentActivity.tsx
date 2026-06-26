"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Phone,
  Plus,
  X,
  Calendar,
  Mail,
  MoreVertical,
  ClipboardList,
  Edit,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllActivities,
  deleteActivity,
} from "@/store/features/activity/activitySlice";
import { ActivityType, ActivityItem } from "@/store/types";
import { format } from "date-fns";
import { AddNoteModal } from "./AddNoteModal";
import { LogCallModal } from "./LogCallModal";
import { AddTaskModal } from "./AddTaskModal";
import { AllActivitiesModal } from "./AllActivitiesModal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentActivityProps {
  hospitalId: string;
  hospitalName: string;
}

export function RecentActivity({
  hospitalId,
  hospitalName,
}: RecentActivityProps) {
  const dispatch = useAppDispatch();
  const { activities, isFetchingActivities } = useAppSelector(
    (state) => state.activity,
  );
  const { selectedHospital } = useAppSelector((state) => state.hospital);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
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
    if (hospitalId) {
      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
    }
  }, [dispatch, hospitalId]);

  const handleDelete = async (id: string, type: ActivityType) => {
    try {
      await dispatch(deleteActivity({ id, type })).unwrap();
      toast.success("Activity deleted");
      dispatch(fetchAllActivities({ hospitalId: hospitalId }));
    } catch (error: any) {
      toast.error(error || "Failed to delete activity");
    }
  };

  const renderActivityItem = (activity: ActivityItem) => {
    switch (activity.activityType) {
      case ActivityType.CALL_LOG:
        return (
          <div
            key={activity._id}
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-2 rounded-full border border-emerald-100 mt-0.5 shrink-0">
                <Phone className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground">Call</h4>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {format(new Date(activity.Date), "MMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="text-sm text-foreground mt-2 font-medium wrap-break-word leading-relaxed">
                  {activity.notes}
                </p>
                <p className="text-[11px] font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                  <span>by</span>
                  <span className="text-muted-foreground">
                    {typeof activity.user === "object"
                      ? (activity.user as any).name
                      : activity.user === currentUser?._id
                        ? currentUser.name
                        : "User"}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1">
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
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-full border border-blue-100 mt-0.5 shrink-0">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground">Note</h4>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {format(
                    new Date(activity.createdAt),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </p>
                <div className="text-sm text-foreground mt-2 font-medium wrap-break-word leading-relaxed">
                  {activity.notes}
                </div>

                {activity.notes.includes("@") && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                      Mentioned:
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-muted-foreground text-[10px] font-semibold px-2 border-border shadow-none"
                    >
                      {activity.notes.split("@")[1].split(" ")[0]}
                    </Badge>
                  </div>
                )}

                <p className="text-[11px] font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                  <span>by</span>
                  <span className="text-muted-foreground">
                    {typeof activity.user === "object"
                      ? (activity.user as any).name
                      : activity.user === currentUser?._id
                        ? currentUser.name
                        : "User"}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1">
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
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground leading-tight">
                  {activity.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 font-medium wrap-break-word leading-tight">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
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
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1">
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
    <Card className="flex flex-col h-full min-h-0 px-6 shadow-md border border-border rounded-xl bg-card">
      <div className="flex flex-col leading-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            Recent Activity & Tasks
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border bg-card text-foreground hover:bg-muted rounded-lg cursor-pointer"
              onClick={() => setIsNoteModalOpen(true)}
            >
              <MessageSquare className="h-4.5 w-4.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border bg-card text-foreground hover:bg-muted rounded-lg cursor-pointer"
              onClick={() => setIsCallModalOpen(true)}
            >
              <Phone className="h-4.5 w-4.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border bg-card text-foreground hover:bg-muted rounded-lg cursor-pointer"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 bg-card text-foreground hover:bg-muted border-border cursor-pointer"
              onClick={() => setIsAllModalOpen(true)}
            >
              View All
            </Button>
          </div>
        </div>
        <p className="text-[12px] font-medium text-muted-foreground">
          Last 30 days
        </p>
      </div>

      <div className="flex-1 max-h-100 overflow-y-auto">
        <div className="flex flex-col gap-4 py-1 pr-3">
          {isFetchingActivities ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground animate-pulse">
                Loading activities...
              </p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground font-medium tracking-tight">
                No activity or tasks in the last 30 days
              </p>
            </div>
          ) : (
            [...activities].reverse().map(renderActivityItem)
          )}
        </div>
      </div>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingActivity(null);
        }}
        hospitalId={hospitalId}
        noteId={editingActivity?.activityType === ActivityType.NOTE ? editingActivity._id : undefined}
        initialNotes={editingActivity?.activityType === ActivityType.NOTE ? editingActivity.notes : undefined}
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
              contact: editingActivity.contact?._id,
              notes: editingActivity.notes,
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
        hospitalName={hospitalName}
        taskId={editingActivity?.activityType === ActivityType.TASK ? editingActivity._id : undefined}
        initialData={
          editingActivity?.activityType === ActivityType.TASK
            ? {
              title: editingActivity.title,
              description: editingActivity.description,
              dueDate: editingActivity.dueDate,
              reminders: editingActivity.reminders || [],
            }
            : undefined
        }
      />
      <AllActivitiesModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        hospitalId={hospitalId}
      />
    </Card>
  );
}
