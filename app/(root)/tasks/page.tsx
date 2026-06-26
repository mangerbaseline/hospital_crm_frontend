"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchTasks, deleteTask } from "@/store/features/task/taskSlice";
import { DashboardHeader } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle,
  Calendar,
  Building2,
  Mail,
  Bell,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { Task } from "@/store/types";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, isFetchingTasks, totalPages, totalTasks } =
    useAppSelector((state) => state.task);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdminOrExecutive =
    user?.role === "Admin" ||
    user?.role === "Executive" ||
    user?.role === "Customer Success";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadTasks = () => {
    dispatch(
      fetchTasks({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        userId: isAdminOrExecutive ? undefined : user?._id,
      }),
    );
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [dispatch, searchQuery, currentPage, pageSize, user]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setPageSize(parseInt(newLimit));
    setCurrentPage(1);
  };



  const handleDeleteTask = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success("Task deleted successfully");
      loadTasks();
    } catch (error: any) {
      toast.error(error || "Failed to delete task");
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const getDueDateStyle = (dueDateStr: string) => {
    const dueDate = new Date(dueDateStr);
    if (isPast(dueDate) && !isToday(dueDate)) {
      return "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
    }
    if (isToday(dueDate)) {
      return "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
    }
    return "bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50";
  };

  return (
    <section className="max-w-7xl mx-auto w-full">
      <DashboardHeader
        title="Tasks"
        subTitle={
          isAdminOrExecutive
            ? "Manage and track all tasks sorted by nearest due date."
            : "Manage and track your tasks sorted by nearest due date."
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full px-2 md:px-0 mt-4">
        <InputGroup className="flex-1 bg-muted h-11 px-3 duration-300">
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground/60"
          >
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm placeholder:text-muted-foreground/50 transition-all border-none focus-visible:ring-0"
          />
        </InputGroup>
      </div>

      <div className="mt-8 px-2 md:px-0">
        {isFetchingTasks ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-full rounded-2xl bg-muted animate-pulse border border-border"
              />
            ))}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-foreground">
                <thead className="bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-4 px-6">Task</th>
                    <th scope="col" className="py-4 px-6">Hospital</th>
                    <th scope="col" className="py-4 px-6">Due Date</th>
                    <th scope="col" className="py-4 px-6 w-24">Reminders</th>
                    <th scope="col" className="py-4 px-6 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {tasks.map((task) => {
                    const isOverdue = isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
                    return (
                      <tr
                        key={task._id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="py-4 px-6 min-w-[200px]">
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-sm font-bold text-foreground leading-snug",
                                isOverdue && "text-rose-600 dark:text-rose-400"
                              )}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-normal">
                                {task.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {task.hospital ? (
                            <Link
                              href={`/hospitals/${task.hospital._id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-2 py-1 rounded-lg border border-border/60"
                            >
                              <Building2 className="h-3.5 w-3.5" />
                              <span>{task.hospital.hospitalName}</span>
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg",
                              getDueDateStyle(task.dueDate)
                            )}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {isToday(new Date(task.dueDate))
                                ? "Today"
                                : format(new Date(task.dueDate), "MMM d, yyyy")}
                            </span>
                            {isOverdue && (
                              <span className="ml-0.5 flex items-center" title="Overdue">
                                <AlertCircle className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {task.reminders && task.reminders.length > 0 ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {task.reminders.includes("email") && (
                                <span title="Email Reminder Active">
                                  <Mail className="h-4 w-4" />
                                </span>
                              )}
                              {task.reminders.includes("push") && (
                                <span title="Push Notification Active">
                                  <Bell className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(task)}
                              className="h-8 w-8 border-border bg-card hover:bg-muted rounded-lg cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <ConfirmDialog
                              title="Delete Task"
                              description="Are you sure you want to delete this task? This action cannot be undone."
                              onConfirm={() => handleDeleteTask(task._id)}
                              confirmText="Delete"
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-border bg-card text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </ConfirmDialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border gap-4">
            <div className="p-4 rounded-full bg-muted/40">
              <ClipboardList className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                No tasks found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                All caught up! Or try adjusting your search terms.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalTasks > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2 pb-8">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Displaying{" "}
            <span className="text-foreground font-bold">
              {totalTasks === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-bold">
              {Math.min(currentPage * pageSize, totalTasks)}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-bold">{totalTasks}</span>{" "}
            tasks
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
              <span>Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-16 h-8 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-md font-bold shadow-sm transition-all cursor-pointer ${currentPage === pageNum ? "shadow-primary/20 scale-110" : ""
                        }`}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === 2 && currentPage > 3)
                  return (
                    <span key="ellipsis-start" className="w-4 text-center text-muted-foreground">
                      ...
                    </span>
                  );
                if (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  return (
                    <span key="ellipsis-end" className="w-4 text-center text-muted-foreground">
                      ...
                    </span>
                  );
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 w-10 p-0 border shadow-sm transition-all focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSuccess={loadTasks}
      />
    </section>
  );
}
