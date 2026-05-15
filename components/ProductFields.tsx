import { useFormContext, Controller } from "react-hook-form";
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
import { DealProductStage } from "@/store/types";

interface ProductFieldsProps {
  index: number;
}

export function ProductFields({ index }: ProductFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const productErrors = (errors.products as any)?.[index];

  return (
    <div className="pl-6 space-y-3 mt-3 mb-2">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[11px] font-semibold">Deal Amount</Label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3 text-xs text-muted-foreground font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              className="pl-7 text-xs h-9 bg-muted border-border"
              {...register(`products.${index}.dealAmount`, {
                valueAsNumber: true,
              })}
            />
          </div>
          {productErrors?.dealAmount && (
            <p className="text-[10px] text-destructive mt-1">
              {productErrors.dealAmount.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-[11px] font-semibold">Quantity</Label>
          <Input
            type="number"
            min={1}
            className="mt-1.5 text-xs h-9 bg-muted border-border"
            {...register(`products.${index}.quantity`, {
              valueAsNumber: true,
            })}
          />
          {productErrors?.quantity && (
            <p className="text-[10px] text-destructive mt-1">
              {productErrors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-[11px] font-semibold">Beds</Label>
          <Input
            type="number"
            min={0}
            className="mt-1.5 text-xs h-9 bg-muted border-border"
            {...register(`products.${index}.beds`, {
              valueAsNumber: true,
            })}
          />
          {productErrors?.beds && (
            <p className="text-[10px] text-destructive mt-1">
              {productErrors.beds.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-[11px] font-semibold">Deal Stage</Label>
        <Controller
          control={control}
          name={`products.${index}.stage`}
          defaultValue={DealProductStage.DEMO}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted border-border">
                <SelectValue placeholder="Select deal stage" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DealProductStage).map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="text-[11px] font-semibold">Expected Close Date</Label>
        <Controller
          control={control}
          name={`products.${index}.expectedCloseDate`}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "mt-1.5 flex h-9 w-full justify-start items-center rounded-md border border-border bg-muted/70 px-3 py-1 text-xs shadow-sm transition-colors cursor-pointer hover:bg-muted",
                    !field.value ? "text-muted-foreground" : "text-zinc-900",
                  )}
                >
                  <CalendarIcon className="-ml-1 mr-2 h-[14px] w-[14px]" />
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-100" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
}
