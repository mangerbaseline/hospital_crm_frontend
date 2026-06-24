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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUsers } from "@/store/features/user/userSlice";
import { fetchProducts } from "@/store/features/product/productSlice";
import { fetchGPOs } from "@/store/features/gpo/gpoSlice";
import { updateHospital } from "@/store/features/hospital/hospitalSlice";
import { updateDealProduct } from "@/store/features/deal/dealSlice";
import { toast } from "sonner";
import { PipelineDeal, DealProductStage, UserRole } from "@/store/types";

interface EditDealModalProps {
  deal: PipelineDeal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const stageOptions = Object.values(DealProductStage);

export function EditDealModal({
  deal,
  open,
  onOpenChange,
  onSuccess,
}: EditDealModalProps) {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { products } = useAppSelector((state) => state.product);
  const { gpos } = useAppSelector((state) => state.gpo);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isSales = currentUser?.role === UserRole.SALES;

  const [userOpen, setUserOpen] = useState(false);
  const [gpoOpen, setGpoOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(deal.user?._id || "");
  const [selectedProductId, setSelectedProductId] = useState(
    deal.product?._id || "",
  );
  const [selectedGpoId, setSelectedGpoId] = useState(deal.hospital?.gpo?._id || "");
  const [dealAmount, setDealAmount] = useState(deal.dealAmount || 0);
  const [totalBeds, setTotalBeds] = useState<number | string>(typeof deal.hospital === "object" ? (deal.hospital.totalBeds ?? (deal as any).quantity ?? "") : "");

  const [beds, setBeds] = useState(deal.beds || "");
  const [stage, setStage] = useState(deal.stage || DealProductStage.DEMO);
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    deal.expectedCloseDate
      ? new Date(deal.expectedCloseDate).toISOString().split("T")[0]
      : "",
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchUsers({ limit: 1000 }));
      if (products.length === 0) dispatch(fetchProducts({ limit: 1000 }));
      if (gpos.length === 0) dispatch(fetchGPOs({ limit: 1000 }));

      setSelectedUserId(deal.user?._id || "");
      setSelectedProductId(deal.product?._id || "");
      setSelectedGpoId(deal.hospital?.gpo?._id || "");
      setDealAmount(deal.dealAmount || 0);
      setTotalBeds(typeof deal.hospital === "object" ? (deal.hospital.totalBeds ?? (deal as any).quantity ?? "") : "");

      setBeds(deal.beds || "");
      setStage(deal.stage || DealProductStage.DEMO);
      setExpectedCloseDate(
        deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toISOString().split("T")[0]
          : "",
      );
    }
  }, [open, deal, dispatch, users.length, products.length, gpos.length]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const hospitalUpdates: any = {};
      if (selectedGpoId !== deal.hospital?.gpo?._id) {
        hospitalUpdates.gpo = selectedGpoId;
      }
      const newTotalBeds = totalBeds === "" ? 0 : Number(totalBeds);
      const currentTotalBeds = typeof deal.hospital === "object" ? (deal.hospital.totalBeds ?? (deal as any).quantity ?? 0) : 0;
      if (newTotalBeds !== currentTotalBeds) {
        hospitalUpdates.totalBeds = newTotalBeds;
      }
      if (Object.keys(hospitalUpdates).length > 0) {
        await dispatch(
          updateHospital({
            id: deal.hospital._id,
            ...hospitalUpdates,
          } as any)
        ).unwrap();
      }

      await dispatch(
        updateDealProduct({
          dealId: deal.dealId,
          product:
            selectedProductId !== deal.product?._id
              ? selectedProductId
              : undefined,
          dealAmount,

          beds: beds === "" ? undefined : Number(beds),
          stage: stage as string,
          expectedCloseDate: expectedCloseDate
            ? new Date(expectedCloseDate).toISOString()
            : undefined,
          userId:
            selectedUserId !== deal.user?._id ? selectedUserId : undefined,
        }),
      ).unwrap();
      toast.success("Deal updated successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error || "Failed to update deal");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedUserName =
    users.find((u) => u._id === selectedUserId)?.name || deal.user?.name || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Deal</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update deal details for{" "}
            <span className="font-semibold text-foreground">
              {deal.product?.name}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-foreground">
              {deal.hospital?.hospitalName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {isAdmin && (
            <div>
              <Label className="text-xs font-semibold">
                Assigned Sales Rep
              </Label>
              <Popover open={userOpen} onOpenChange={setUserOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={userOpen}
                    className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted"
                  >
                    <span className="truncate text-left flex-1">
                      {selectedUserName || "Select Sales Rep"}
                    </span>
                    <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0 z-100"
                  align="start"
                >
                  <Command onWheel={(e) => e.stopPropagation()}>
                    <CommandInput
                      placeholder="Search sales rep..."
                      className="h-9 text-xs"
                    />
                    <CommandList>
                      <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                        No sales rep found.
                      </CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user._id}
                            value={user.name}
                            onSelect={() => {
                              setSelectedUserId(user._id);
                              setUserOpen(false);
                            }}
                            className="text-xs"
                          >
                            {user.name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedUserId === user._id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold">Hospital GPO</Label>
            <Popover open={gpoOpen} onOpenChange={setGpoOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={gpoOpen}
                  className="w-full justify-between mt-1.5 text-xs h-9 bg-muted/70 font-normal border-border shadow-none hover:bg-muted cursor-pointer"
                >
                  <span className="truncate text-left flex-1">
                    {selectedGpoId
                      ? gpos.find((gpo) => gpo._id === selectedGpoId)?.name || "Select GPO"
                      : "Select GPO"}
                  </span>
                  <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0 z-100"
                align="start"
              >
                <Command onWheel={(e) => e.stopPropagation()}>
                  <CommandInput
                    placeholder="Search GPO..."
                    className="h-9 text-xs"
                  />
                  <CommandList>
                    <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                      No GPO found.
                    </CommandEmpty>
                    <CommandGroup>
                      {gpos.map((gpo) => (
                        <CommandItem
                          key={gpo._id}
                          value={gpo.name}
                          onSelect={() => {
                            setSelectedGpoId(gpo._id === selectedGpoId ? "" : gpo._id);
                            setGpoOpen(false);
                          }}
                          className="text-xs"
                        >
                          {gpo.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedGpoId === gpo._id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-xs font-semibold">Product</Label>
            <Select
              value={selectedProductId}
              onValueChange={(val) => setSelectedProductId(val)}
            >
              <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((prod) => (
                  <SelectItem key={prod._id} value={prod._id}>
                    {prod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold">Deal Amount</Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                $
              </span>
              <Input
                type="number"
                value={dealAmount}
                onChange={(e) => setDealAmount(Number(e.target.value))}
                className="text-xs h-9 bg-muted pl-7"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Total Beds</Label>
              <Input
                type="number"
                min={0}
                value={totalBeds}
                onChange={(e) => setTotalBeds(e.target.value === "" ? "" : Number(e.target.value))}
                className="text-xs h-9 bg-muted mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Implemented Beds</Label>
              <Input
                type="number"
                min={0}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder="No. of beds"
                className="text-xs h-9 bg-muted mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Deal Stage</Label>
            <Select
              value={stage as string}
              onValueChange={(val) => setStage(val)}
            >
              <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold">Expected Close Date</Label>
            <Input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="text-xs h-9 mt-1.5 bg-muted"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="bg-[#09090b] text-white hover:bg-[#27272a] cursor-pointer font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
