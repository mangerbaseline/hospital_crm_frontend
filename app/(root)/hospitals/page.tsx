import { DashboardHeader } from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HospitalSearchBar } from "@/components/hospitals/HospitalSearchBar";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { hospitals } from "@/lib/hospital-data";

function Hospitals() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* header */}
      <DashboardHeader
        title="All Hospitals"
        subTitle="Hospitals organized by expected close date"
      >
        <Select defaultValue="karlee">
          <SelectTrigger className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer">
            <SelectValue placeholder="Select Sales Rep" />
          </SelectTrigger>
          <SelectContent className="border-border">
            <SelectItem value="all">All Sales Reps</SelectItem>
            <SelectItem value="karlee">Karlee Mason</SelectItem>
            <SelectItem value="jason">Jason Bobay</SelectItem>
            <SelectItem value="katie">Katie Zerbe</SelectItem>
            <SelectItem value="zac">Zac Mires</SelectItem>
          </SelectContent>
        </Select>
      </DashboardHeader>

      {/* searchbar */}
      <HospitalSearchBar />

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {hospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </section>
  );
}

export default Hospitals;
