import { DashboardHeader } from "@/components/Header";
import { UserSelect } from "@/components/UserSelect";

function IDNs() {
  return (
    <section className="max-w-7xl mx-auto w-full">
      <DashboardHeader
        title="All IDNs"
        subTitle="Integrated Delivery Networks and their expected revenue"
      >
        <UserSelect className="w-full sm:w-[180px] bg-muted border-border shadow-sm cursor-pointer" />
      </DashboardHeader>
    </section>
  );
}

export default IDNs;
