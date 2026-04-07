import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";

function GposVasPage() {
  return (
    <section className="max-w-7xl mx-auto w-full">
      <DashboardHeader
        title="GPOs & VAs"
        subTitle="Group Purchasing Organizations, Veteran Affairs Hospitals and their expected revenue"
      >
        <UserSelect className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer" />
      </DashboardHeader>
    </section>
  );
}

export default GposVasPage;
