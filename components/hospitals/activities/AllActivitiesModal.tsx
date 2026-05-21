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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllActivities,
  deleteActivity,
} from "@/store/features/activity/activitySlice";
import { ActivityType, ActivityItem } from "@/store/types";
import { format } from "date-fns";
import { X, Phone, MessageSquare, CheckSquare } from "lucide-react";
import { toast } from "sonner";

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

  const limit = 10; // items per page
  const [page, setPage] = useState(1);

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
              </div>
            </div>
            <button
              onClick={() => handleDelete(activity._id, ActivityType.CALL_LOG)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X className="h-4 w-4" />
            </button>
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
                <p className="text-[11px] font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                  <span>by</span>
                  <span className="text-muted-foreground">{activity.user?.toString()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(activity._id, ActivityType.NOTE)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      case ActivityType.TASK:
        return (
          <div
            key={activity._id}
            className="group relative flex flex-col gap-2 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <CheckSquare className="h-5 w-5 text-indigo-600" />
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground leading-tight">
                  {activity.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 font-medium wrap-break-word leading-tight">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {format(new Date(activity.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(activity._id, ActivityType.TASK)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
  );
}
