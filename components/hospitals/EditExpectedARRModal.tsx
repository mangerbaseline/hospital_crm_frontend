"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
import { Loader2, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProducts } from "@/store/features/product/productSlice";
import {
  addDealProduct,
  updateDealProduct,
  removeDealProduct,
} from "@/store/features/deal/dealSlice";
import { getSingleHospital, updateHospital } from "@/store/features/hospital/hospitalSlice";
import { toast } from "sonner";
import { Hospital, DealProductStage } from "@/store/types";

interface ProductItem {
  _id: string;
  dealId: string;
  productId: string;
  productName: string;
  dealAmount: number;
  beds: string;
  stage: string;
  expectedCloseDate: string;
  isNew?: boolean;
  isRemoved?: boolean;
  isDirty?: boolean;
  leadSource?: string;
  leadSourceDetails?: string;
}

interface EditExpectedARRModalProps {
  hospital: Hospital;
  children: React.ReactNode;
}

const stageOptions = Object.values(DealProductStage);

export function EditExpectedARRModal({
  hospital,
  children,
}: EditExpectedARRModalProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);
  const { isDealProductLoading } = useAppSelector((state) => state.deal);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [totalBeds, setTotalBeds] = useState<number | string>(hospital.totalBeds ?? "");

  useEffect(() => {
    if (open) {
      if (products.length === 0) dispatch(fetchProducts({ limit: 1000 }));

      const deals = hospital.deals || [];
      const allProducts = deals.flatMap((deal) =>
        (deal.products || []).map((p) => ({
          _id: p._id,
          dealId: deal._id || "",
          productId:
            typeof p.product === "object" && p.product !== null
              ? p.product._id
              : p.product || "",
          productName:
            typeof p.product === "object" && p.product !== null
              ? p.product.name
              : "Unknown Product",
          dealAmount: p.dealAmount || 0,
          beds: (p as any).beds || "",
          stage: p.stage || DealProductStage.DEMO,
          expectedCloseDate: p.expectedCloseDate
            ? new Date(p.expectedCloseDate).toISOString().split("T")[0]
            : "",
          isNew: false,
          isRemoved: false,
          isDirty: false,
          leadSource: (p as any).leadSource || "",
          leadSourceDetails: (p as any).leadSourceDetails || "",
        })),
      );
      setItems(allProducts);
      setTotalBeds(hospital.totalBeds ?? "");
    }
  }, [open, hospital, dispatch, products.length]);

  const handleAddProduct = () => {
    setItems((prev) => [
      ...prev,
      {
        _id: `new-${Date.now()}`,
        dealId: "",
        productId: "",
        productName: "",
        dealAmount: 0,
        beds: "",
        stage: DealProductStage.DEMO,
        expectedCloseDate: "",
        isNew: true,
        isRemoved: false,
        isDirty: false,
        leadSource: "",
        leadSourceDetails: "",
      },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isRemoved: true } : item,
      ),
    );
  };

  const handleFieldChange = (
    id: string,
    field: keyof ProductItem,
    value: any,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value, isDirty: true } : item,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<any>[] = [];

      const removedItems = items.filter(
        (item) => item.isRemoved && !item.isNew,
      );
      for (const item of removedItems) {
        if (item.dealId) {
          promises.push(
            dispatch(
              removeDealProduct({
                dealId: item.dealId,
              }),
            ).unwrap(),
          );
        }
      }

      const updatedItems = items.filter(
        (item) => item.isDirty && !item.isNew && !item.isRemoved,
      );
      for (const item of updatedItems) {
        if (item.dealId) {
          promises.push(
            dispatch(
              updateDealProduct({
                dealId: item.dealId,
                product: item.productId,
                dealAmount: item.dealAmount,
                beds: item.beds === "" ? undefined : Number(item.beds),
                stage: item.stage,
                expectedCloseDate: item.expectedCloseDate
                  ? new Date(item.expectedCloseDate).toISOString()
                  : undefined,
                dealDate: new Date().toISOString(),
                leadSource: item.leadSource,
                leadSourceDetails: item.leadSourceDetails,
              }),
            ).unwrap(),
          );
        }
      }

      const newItems = items.filter(
        (item) => item.isNew && !item.isRemoved && item.productId,
      );
      for (const item of newItems) {
        promises.push(
          dispatch(
            addDealProduct({
              hospitalId: hospital._id,
              product: item.productId,
              dealAmount: item.dealAmount,
              stage: item.stage,
              expectedCloseDate: item.expectedCloseDate
                ? new Date(item.expectedCloseDate).toISOString()
                : undefined,
              dealDate: new Date().toISOString(),
              leadSource: item.leadSource,
              leadSourceDetails: item.leadSourceDetails,
              idn:
                typeof hospital.idn === "object"
                  ? hospital.idn._id
                  : hospital.idn,
              gpo:
                typeof hospital.gpo === "object"
                  ? hospital.gpo._id
                  : hospital.gpo,
            }),
          ).unwrap(),
        );
      }

      await Promise.all(promises);

      const newTotalBeds = totalBeds === "" ? 0 : Number(totalBeds);
      if (newTotalBeds !== (hospital.totalBeds ?? 0)) {
        await dispatch(
          updateHospital({
            id: hospital._id,
            totalBeds: newTotalBeds,
          } as any)
        ).unwrap();
      }

      toast.success("Products updated successfully");
      dispatch(getSingleHospital(hospital._id));
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to update products");
    } finally {
      setIsSaving(false);
    }
  };

  const visibleItems = items.filter((item) => !item.isRemoved);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-130 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Edit Deal
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update product amounts, stages, and expected close dates
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {visibleItems.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No products yet. Add one below.
            </div>
          )}

          {visibleItems.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-border p-4 flex flex-col gap-3 relative"
            >
              <div className="flex items-center justify-between">
                {item.isNew ? (
                  <Select
                    value={item.productId}
                    onValueChange={(val) => {
                      const prod = products.find((p) => p._id === val);
                      handleFieldChange(item._id, "productId", val);
                      handleFieldChange(
                        item._id,
                        "productName",
                        prod?.name || "",
                      );
                    }}
                  >
                    <SelectTrigger className="w-full text-sm h-9 bg-muted font-semibold">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter(
                          (prod) =>
                            !visibleItems.some(
                              (v) =>
                                v.productId === prod._id && v._id !== item._id,
                            ),
                        )
                        .map((prod) => (
                          <SelectItem key={prod._id} value={prod._id}>
                            {prod.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={item.productId}
                    onValueChange={(val) => {
                      const prod = products.find((p) => p._id === val);
                      handleFieldChange(item._id, "productId", val);
                      handleFieldChange(
                        item._id,
                        "productName",
                        prod?.name || "",
                      );
                    }}
                  >
                    <SelectTrigger className="w-full text-sm h-9 bg-muted font-semibold">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod._id} value={prod._id}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(item._id)}
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label className="text-xs font-semibold">Amount</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                    $
                  </span>
                  <Input
                    type="number"
                    value={item.dealAmount}
                    onChange={(e) =>
                      handleFieldChange(
                        item._id,
                        "dealAmount",
                        Number(e.target.value),
                      )
                    }
                    className="text-xs h-9 bg-muted pl-7"
                  />
                </div>
              </div>

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
                <Label className="text-xs font-semibold">
                  Implemented Beds
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={item.beds}
                  onChange={(e) =>
                    handleFieldChange(item._id, "beds", e.target.value)
                  }
                  placeholder="No. of beds"
                  className="text-xs h-9 bg-muted mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Deal Stage</Label>
                <Select
                  value={item.stage}
                  onValueChange={(val) =>
                    handleFieldChange(item._id, "stage", val)
                  }
                >
                  <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOptions.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">
                  Expected Close Date
                </Label>
                <Input
                  type="date"
                  value={item.expectedCloseDate}
                  onChange={(e) =>
                    handleFieldChange(
                      item._id,
                      "expectedCloseDate",
                      e.target.value,
                    )
                  }
                  className="text-xs h-9 mt-1.5 bg-muted"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Lead Source</Label>
                <Select
                  value={item.leadSource || ""}
                  onValueChange={(val) =>
                    handleFieldChange(item._id, "leadSource", val)
                  }
                >
                  <SelectTrigger className="w-full mt-1.5 text-xs h-9 bg-muted">
                    <SelectValue placeholder="Select Lead Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Outreach/Marketing">Outreach/Marketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {item.leadSource && (
                <div>
                  <Label className="text-xs font-semibold">Lead Source Details</Label>
                  <Input
                    placeholder="Enter lead source details..."
                    className="text-xs h-9 mt-1.5 bg-muted"
                    value={item.leadSourceDetails || ""}
                    onChange={(e) =>
                      handleFieldChange(item._id, "leadSourceDetails", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {visibleItems.length < products.length && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddProduct}
              className="w-full h-10 border-dashed border-border text-sm font-medium gap-2 cursor-pointer hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          )}
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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
