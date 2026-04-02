"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PipelineColumn, ColumnData } from "./PipelineColumn";
import { PipelineCard, Deal } from "./PipelineCard";

const initialData: Record<string, ColumnData> = {
  demo: {
    id: "demo",
    title: "Demo",
    color: "#3b82f6",
    deals: [
      {
        id: "d1",
        hospitalName: "VA Palo Alto Health Care System",
        location: "Palo Alto, CA",
        product: "MAC System",
        arr: 225,
        idn: "VA",
        gpo: "VA",
      },
    ],
  },
  cpa: {
    id: "cpa",
    title: "CPA",
    color: "#8b5cf6",
    deals: [
      {
        id: "d2",
        hospitalName: "St. Joseph Medical Center",
        location: "Webster, TX",
        product: "ELEVATE",
        arr: 145,
        idn: "CommonSpirit Health",
        gpo: "Premier",
      },
    ],
  },
  committee: {
    id: "committee",
    title: "Committee",
    color: "#ff8c00",
    deals: [
      {
        id: "d3",
        hospitalName: "St. Joseph Medical Center",
        location: "Webster, TX",
        product: "MAC System",
        arr: 89,
        idn: "CommonSpirit Health",
        gpo: "Premier",
      },
    ],
  },
  trial: {
    id: "trial",
    title: "Trial",
    color: "#eab308",
    deals: [
      {
        id: "d4",
        hospitalName: "AdventHealth Orlando",
        location: "Orlando, FL",
        product: "MAC System",
        arr: 185,
        idn: "AdventHealth",
        gpo: "HealthTrust",
      },
    ],
  },
  pending: {
    id: "pending",
    title: "Pending Decision",
    color: "#ec4899",
    deals: [
      {
        id: "d5",
        hospitalName: "AdventHealth Orlando",
        location: "Orlando, FL",
        product: "HeelPOD",
        arr: 95,
        idn: "AdventHealth",
        gpo: "HealthTrust",
      },
    ],
  },
  closed: {
    id: "closed",
    title: "Closed Won",
    color: "#22c55e",
    deals: [],
  },
  implemented: {
    id: "implemented",
    title: "Implemented",
    color: "#16a34a",
    deals: [
      {
        id: "d6",
        hospitalName: "NYU Langone Tisch Hospital",
        location: "New York, NY",
        product: "MAC System",
        arr: 195,
        idn: "NYU Langone Health",
        gpo: "Premier",
      },
      {
        id: "d7",
        hospitalName: "NYU Langone Tisch Hospital",
        location: "New York, NY",
        product: "HeelPOD",
        arr: 88,
        idn: "NYU Langone Health",
        gpo: "Premier",
      },
    ],
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

export function PipelineBoard() {
  const [columns, setColumns] =
    useState<Record<string, ColumnData>>(initialData);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type !== "Column") {
      setActiveDeal(active.data.current as Deal);
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
  };

  return (
    <div className="w-full min-h-[450px] pt-6 min-w-0 max-w-full flex flex-col">
      <div className="w-full flex-1 overflow-x-auto pb-4">
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
  );
}
