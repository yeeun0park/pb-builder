import { useCampaignStore } from "@/lib/store";
import type { GridItem, GridSection } from "@/lib/types";
import { FieldLabel } from "../ui/FieldLabel";
import { ImageInput } from "../ui/ImageInput";

export const GridForm = ({ section }: { section: GridSection }) => {
  const update = useCampaignStore((s) => s.updateSection);

  const updateItem = (idx: number, patch: Partial<GridItem>) => {
    const next = section.items.map((it, i) =>
      i === idx ? { ...it, ...patch } : it,
    );
    update<GridSection>(section.id, { items: next });
  };

  const addItem = () =>
    update<GridSection>(section.id, {
      items: [...section.items, { image: "" }],
    });

  const removeItem = (idx: number) =>
    update<GridSection>(section.id, {
      items: section.items.filter((_, i) => i !== idx),
    });

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel label="제목 (선택)">
        <input
          type="text"
          value={section.headline ?? ""}
          onChange={(e) =>
            update<GridSection>(section.id, {
              headline: e.target.value || undefined,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="열 개수">
        <select
          value={section.columns}
          onChange={(e) =>
            update<GridSection>(section.id, {
              columns: Number(e.target.value) as 2 | 3,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm"
        >
          <option value={2}>2열</option>
          <option value={3}>3열</option>
        </select>
      </FieldLabel>
      <div className="flex flex-col gap-3 border-t border-divider pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">아이템 ({section.items.length})</span>
          <button
            type="button"
            onClick={addItem}
            className="rounded border border-divider px-2 py-1 text-xs hover:border-theme hover:text-theme"
          >
            + 추가
          </button>
        </div>
        {section.items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded border border-divider p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">#{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-xs text-fg-muted hover:text-red-600"
              >
                삭제
              </button>
            </div>
            <ImageInput
              value={item.image}
              onChange={(image, imageMeta) =>
                updateItem(idx, { image, imageMeta })
              }
            />
            <FieldLabel label="제목 (선택)">
              <input
                type="text"
                value={item.title ?? ""}
                onChange={(e) =>
                  updateItem(idx, { title: e.target.value || undefined })
                }
                className="rounded border border-divider px-2 py-1 text-sm focus:border-theme focus:outline-none"
              />
            </FieldLabel>
            <FieldLabel label="캡션 (선택)">
              <input
                type="text"
                value={item.caption ?? ""}
                onChange={(e) =>
                  updateItem(idx, { caption: e.target.value || undefined })
                }
                className="rounded border border-divider px-2 py-1 text-sm focus:border-theme focus:outline-none"
              />
            </FieldLabel>
          </div>
        ))}
      </div>
    </div>
  );
};
