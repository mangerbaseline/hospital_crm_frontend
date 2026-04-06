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

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: import("@/store/types").Product | null;
}

export interface ProductTableProps {
  products: import("@/store/types").Product[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  phoneNumber: string;
  hospital?:
    | {
        _id: string;
        idn?: { name: string };
        hospitalName: string;
      }
    | string;
  isPrimary?: boolean;
}

export interface ContactCardProps {
  contact: Contact;
  className?: string;
}
