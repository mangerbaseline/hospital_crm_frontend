"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PipelineColumn, ColumnData } from "./PipelineColumn";
import { PipelineCard, PipelineCardDeal } from "./PipelineCard";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { DealProductStage } from "@/store/types";
import { updateDealStage } from "@/store/features/deal/dealSlice";
import { Skeleton } from "@/components/ui/skeleton";

const emptyColumnsSkeleton: Record<string, ColumnData> = {
  demo: { id: "demo", title: "Demo", color: "#3b82f6", deals: [] },
  cpa: { id: "cpa", title: "CPA", color: "#8b5cf6", deals: [] },
  committee: {
    id: "committee",
    title: "Committee",
    color: "#ff8c00",
    deals: [],
  },
  trial: { id: "trial", title: "Trial", color: "#eab308", deals: [] },
  pending: {
    id: "pending",
    title: "Pending Decision",
    color: "#ec4899",
    deals: [],
  },
  closed: { id: "closed", title: "Closed Won", color: "#22c55e", deals: [] },
  implemented: {
    id: "implemented",
    title: "Implemented",
    color: "#16a34a",
    deals: [],
  },
};

const columnOrder = [
  "demo",
  "cpa",
  "committee",
  "trial",
  "pending",
  "closed",
  "implemented",
];

const stageToColumnId = (stage?: string) => {
  switch (stage) {
    case DealProductStage.DEMO:
      return "demo";
    case DealProductStage.CPA:
      return "cpa";
    case DealProductStage.COMMITTEE:
      return "committee";
    case DealProductStage.TRIAL:
      return "trial";
    case DealProductStage.PENDING_DECISION:
      return "pending";
    case DealProductStage.CLOSED_WON:
      return "closed";
    case DealProductStage.IMPLEMENTED:
      return "implemented";
    default:
      return "demo";
  }
};

const columnIdToStage = (id: string) => {
  switch (id) {
    case "demo":
      return DealProductStage.DEMO;
    case "cpa":
      return DealProductStage.CPA;
    case "committee":
      return DealProductStage.COMMITTEE;
    case "trial":
      return DealProductStage.TRIAL;
    case "pending":
      return DealProductStage.PENDING_DECISION;
    case "closed":
      return DealProductStage.CLOSED_WON;
    case "implemented":
      return DealProductStage.IMPLEMENTED;
    default:
      return DealProductStage.DEMO;
  }
};

interface PipelineBoardProps {
  onStageChange?: () => void;
}

export function PipelineBoard({ onStageChange }: PipelineBoardProps = {}) {
  const dispatch = useAppDispatch();
  const { deals, isFetchingDeals } = useAppSelector((state) => state.deal);

  const derivedColumns = useMemo(() => {
    const cols = JSON.parse(JSON.stringify(emptyColumnsSkeleton)) as Record<
      string,
      ColumnData
    >;
    deals.forEach((deal) => {
      const colId = stageToColumnId(deal.stage as string);
      const pipelineCardDeal: PipelineCardDeal = {
        ...deal,
        id: `${deal._id}-${deal.product?._id || Math.random()}`,
      };
      if (cols[colId]) {
        cols[colId].deals.push(pipelineCardDeal);
      }
    });
    return cols;
  }, [deals]);

  const [columns, setColumns] =
    useState<Record<string, ColumnData>>(derivedColumns);
  const [activeDeal, setActiveDeal] = useState<PipelineCardDeal | null>(null);
  const [topScrollContentWidth, setTopScrollContentWidth] = useState<number>(0);
  const topScrollbarRef = useRef<HTMLDivElement | null>(null);
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  const syncTopToMain = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  }, []);

  const syncMainToTop = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (topScrollbarRef.current) {
      topScrollbarRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  }, []);

  useEffect(() => {
    setColumns(derivedColumns);
  }, [derivedColumns]);

  useEffect(() => {
    const main = mainScrollRef.current;
    if (!main) return;

    setTopScrollContentWidth(main.scrollWidth);
    const handleResize = () => {
      if (main) {
        setTopScrollContentWidth(main.scrollWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(main);

    return () => {
      resizeObserver.disconnect();
    };
  }, [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type !== "Column") {
      setActiveDeal(active.data.current as PipelineCardDeal);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumnId = Object.keys(columns).find((key) =>
      columns[key].deals.some((deal) => deal.id === activeId),
    );

    let overColumnId = Object.keys(columns).find((key) => key === overId);
    if (!overColumnId) {
      overColumnId = Object.keys(columns).find((key) =>
        columns[key].deals.some((deal) => deal.id === overId),
      );
    }

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return;
    }

    setColumns((prev) => {
      const activeItems = prev[activeColumnId].deals;
      const overItems = prev[overColumnId!].deals;

      const activeIndex = activeItems.findIndex((d) => d.id === activeId);

      let overIndex;
      if (overId in prev) {
        overIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        const targetIndex = overItems.findIndex((d) => d.id === overId);
        overIndex =
          targetIndex >= 0 ? targetIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeColumnId]: {
          ...prev[activeColumnId],
          deals: activeItems.filter((deal) => deal.id !== activeId),
        },
        [overColumnId!]: {
          ...prev[overColumnId!],
          deals: [
            ...overItems.slice(0, overIndex),
            activeItems[activeIndex],
            ...overItems.slice(overIndex, overItems.length),
          ],
        },
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnId = Object.keys(columns).find((key) =>
      columns[key].deals.some((deal) => deal.id === activeId),
    );

    let overColumnId = Object.keys(columns).find((key) => key === overId);
    if (!overColumnId) {
      overColumnId = Object.keys(columns).find((key) =>
        columns[key].deals.some((deal) => deal.id === overId),
      );
    }

    if (!activeColumnId || !overColumnId) {
      return;
    }

    if (activeColumnId === overColumnId) {
      setColumns((prev) => {
        const items = prev[activeColumnId].deals;
        const activeIndex = items.findIndex((d) => d.id === activeId);
        const overIndex = items.findIndex((d) => d.id === overId);

        if (activeIndex !== overIndex) {
          return {
            ...prev,
            [activeColumnId]: {
              ...prev[activeColumnId],
              deals: arrayMove(items, activeIndex, overIndex),
            },
          };
        }
        return prev;
      });
    }

    if (activeDeal) {
      const newStage = columnIdToStage(overColumnId!);

      if (activeDeal.stage !== newStage) {
        dispatch(
          updateDealStage({
            hospitalId: activeDeal.hospital._id,
            dealId: activeDeal.dealId,
            productId: activeDeal.product._id,
            stage: newStage,
          }),
        )
          .unwrap()
          .then(() => {
            if (onStageChange) onStageChange();
          });
      }
    }
  };

  return (
    <div className="w-full min-h-112.5 pt-6 min-w-0 max-w-full flex flex-col">
      {isFetchingDeals ? (
        <div className="flex-1 w-full overflow-x-hidden flex gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-full w-70 shrink-0 bg-muted/20 rounded-xl border border-border/50 p-3"
            >
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-2.5 h-2.5 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                {i % 2 === 0 && <Skeleton className="h-32 w-full rounded-lg" />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col gap-2">
          <div
            ref={topScrollbarRef}
            onScroll={syncTopToMain}
            className="top-scrollbar-wrapper rounded-lg"
          >
            <div
              style={{
                width: `${topScrollContentWidth}px`,
                minHeight: 1,
              }}
            />
          </div>

          <div
            ref={mainScrollRef}
            onScroll={syncMainToTop}
            className="w-full flex-1 overflow-x-auto pb-4 pipeline-main-scroll"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            >
              <div className="flex gap-4 min-w-max pr-4 h-full outline-none">
                {columnOrder.map((columnId) => (
                  <PipelineColumn key={columnId} column={columns[columnId]} />
                ))}
              </div>

              <DragOverlay>
                {activeDeal ? (
                  <div className="opacity-90 scale-[1.02] shadow-xl z-50">
                    <PipelineCard deal={activeDeal} index={0} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}
