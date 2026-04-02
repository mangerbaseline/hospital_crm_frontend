import { DashboardHeader } from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PipelineStatsCard } from "@/components/pipeline/PipelineStatsCard";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

function Pipeline() {
  return (
    <div>
      <section className="w-full max-w-7xl mx-auto">
        {/* header */}
        <DashboardHeader
          title="Pipeline"
          subTitle="Track deals across all stages"
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

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 w-full">
          <PipelineStatsCard value="6" label="My Hospitals" />
          <PipelineStatsCard value="$183,000" label="HeelPOD ARR" />
          <PipelineStatsCard value="$859,500" label="MAC System ARR" />
          <PipelineStatsCard value="$418,000" label="ELEVATE ARR" />
          <PipelineStatsCard value="0" label="Closed Business" />
        </div>
      </section>

      {/* kanban */}
      <PipelineBoard />
    </div>
  );
}

export default Pipeline;
