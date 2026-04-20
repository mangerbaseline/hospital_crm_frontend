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
  onToggleStatus: (id: string, active: boolean) => void;
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

export interface GPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  gpo?: import("@/store/types").GPO | null;
}

export interface GPOTableProps {
  gpos: import("@/store/types").GPO[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface IDNModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  idn?: import("@/store/types").IDN | null;
}

export interface IDNTableProps {
  idns: import("@/store/types").IDN[];
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
