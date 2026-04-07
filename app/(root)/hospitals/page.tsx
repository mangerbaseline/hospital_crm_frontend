import { DashboardHeader } from "@/components/Header";
import { HospitalSearchBar } from "@/components/hospitals/HospitalSearchBar";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { hospitals } from "@/lib/hospital-data";
import { UserSelect } from "@/components/UserSelect";

function Hospitals() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* header */}
      <DashboardHeader
        title="All Hospitals"
        subTitle="Hospitals organized by expected close date"
      >
        <UserSelect className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer" />
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
