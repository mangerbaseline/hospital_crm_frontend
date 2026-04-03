import { User } from "@/store/types";

export interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: User | null;
}

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
