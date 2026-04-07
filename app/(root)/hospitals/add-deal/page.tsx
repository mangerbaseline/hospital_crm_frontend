"use client";

import AddDealForm from "@/components/AddDealForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";

function AddDealPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* header */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-sm">Sales Rep</CardTitle>
          <CardDescription className="text-lg text-primary font-semibold">
            {user?.name}
          </CardDescription>
        </CardHeader>
      </Card>

      <AddDealForm />
    </section>
  );
}

export default AddDealPage;
