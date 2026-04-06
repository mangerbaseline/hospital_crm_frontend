import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

export function ProductFields() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="pl-6 space-y-3 mt-3 mb-2">
      <div>
        <Label className="text-[11px] font-semibold">Deal Amount</Label>
        <div className="relative mt-1.5 flex items-center">
          <span className="absolute left-3 text-xs text-muted-foreground font-medium">
            $
          </span>
          <Input
            placeholder="0.00"
            className="pl-7 text-xs h-9 bg-muted border-border"
          />
        </div>
      </div>
      <div>
        <Label className="text-[11px] font-semibold">Deal Stage</Label>
        <Select>
          <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted border-border text-muted-foreground">
            <SelectValue placeholder="Select deal stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">Stage 1</SelectItem>
            <SelectItem value="s2">Stage 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-[11px] font-semibold">Expected Close Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "mt-1.5 flex h-9 w-full justify-start items-center rounded-md border border-border bg-muted/70 px-3 py-1 text-xs shadow-sm transition-colors cursor-pointer hover:bg-muted",
                !date ? "text-muted-foreground" : "text-zinc-900",
              )}
            >
              <CalendarIcon className="-ml-1 mr-2 h-[14px] w-[14px]" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-100" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
