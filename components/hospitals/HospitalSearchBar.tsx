import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HospitalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function HospitalSearchBar({ value, onChange }: HospitalSearchBarProps) {
  return (
    <div className="relative w-full mb-6">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search hospitals, IDNs, cities, or products..."
        className="pl-10 w-full bg-muted border border-border shadow-sm h-12 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
