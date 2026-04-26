import { useCampaignStore } from "@/lib/store";
import type { TextBlockSection } from "@/lib/types";
import { FieldLabel } from "../ui/FieldLabel";

export const TextBlockForm = ({ section }: { section: TextBlockSection }) => {
  const update = useCampaignStore((s) => s.updateSection);

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel label="제목 (선택)">
        <input
          type="text"
          value={section.headline ?? ""}
          onChange={(e) =>
            update<TextBlockSection>(section.id, {
              headline: e.target.value || undefined,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="본문">
        <textarea
          rows={6}
          value={section.body}
          onChange={(e) =>
            update<TextBlockSection>(section.id, { body: e.target.value })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="정렬">
          <select
            value={section.align ?? "center"}
            onChange={(e) =>
              update<TextBlockSection>(section.id, {
                align: e.target.value as TextBlockSection["align"],
              })
            }
            className="rounded border border-divider px-2 py-1.5 text-sm"
          >
            <option value="center">중앙</option>
            <option value="left">좌측</option>
          </select>
        </FieldLabel>
        <FieldLabel label="배경">
          <select
            value={section.bg ?? "white"}
            onChange={(e) =>
              update<TextBlockSection>(section.id, {
                bg: e.target.value as TextBlockSection["bg"],
              })
            }
            className="rounded border border-divider px-2 py-1.5 text-sm"
          >
            <option value="white">흰색</option>
            <option value="muted">연한 회색</option>
            <option value="themeTint">테마 틴트</option>
          </select>
        </FieldLabel>
      </div>
    </div>
  );
};
