import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";
import { useCampaignStore } from "@/lib/store";
import type { Section, SectionType } from "@/lib/types";

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "히어로",
  fullbleed: "풀블리드 이미지",
  split: "스플릿 (이미지+텍스트)",
  textBlock: "텍스트 블록",
  grid: "이미지 그리드",
};

const SectionRow = ({ section }: { section: Section }) => {
  const selected = useCampaignStore((s) => s.selectedSectionId === section.id);
  const select = useCampaignStore((s) => s.selectSection);
  const remove = useCampaignStore((s) => s.removeSection);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] transition ${
        selected
          ? "border-navy-600 bg-navy-50"
          : "border-porcelain-200 bg-white hover:border-porcelain-400"
      }`}
    >
      <button
        type="button"
        className="cursor-grab rounded p-1 text-porcelain-500 hover:bg-porcelain-100 hover:text-navy-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        title="드래그해서 순서 변경"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => select(section.id)}
        className="flex-1 text-left"
      >
        <span className="font-bold text-porcelain-800">
          {SECTION_TYPE_LABELS[section.type]}
        </span>
        {section.type === "hero" && section.headline && (
          <span className="ml-2 truncate text-porcelain-600">
            {section.headline}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => remove(section.id)}
        className="rounded p-1 text-porcelain-500 transition hover:bg-accent-hot-tint hover:text-accent-hot"
        title="섹션 삭제"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const AddSectionButton = () => {
  const add = useCampaignStore((s) => s.addSection);
  return (
    <div className="grid grid-cols-3 gap-2">
      {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => add(type)}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-porcelain-300 bg-white px-2 py-2.5 text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:bg-navy-50 hover:text-navy-600"
        >
          <Plus className="h-3 w-3" />
          {SECTION_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
};

export const SectionList = () => {
  const sections = useCampaignStore((s) => s.campaign.sections);
  const reorder = useCampaignStore((s) => s.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sections.findIndex((s) => s.id === active.id);
    const toIndex = sections.findIndex((s) => s.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) reorder(fromIndex, toIndex);
  };

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-porcelain-800">
          섹션 ({sections.length})
        </h2>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {sections.map((s) => (
              <SectionRow key={s.id} section={s} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {sections.length === 0 && (
        <p className="text-center text-[13px] text-porcelain-500">
          아래에서 섹션을 추가하세요.
        </p>
      )}
      <div className="border-t border-porcelain-200 pt-4">
        <p className="mb-2 text-[12px] font-bold text-porcelain-600">섹션 추가</p>
        <AddSectionButton />
      </div>
    </div>
  );
};
