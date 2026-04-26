import { useCampaignStore } from "@/lib/store";
import type { SplitSection } from "@/lib/types";
import { FieldLabel } from "../ui/FieldLabel";
import { ImageInput } from "../ui/ImageInput";

export const SplitForm = ({ section }: { section: SplitSection }) => {
  const update = useCampaignStore((s) => s.updateSection);

  return (
    <div className="flex flex-col gap-3">
      <ImageInput
        label="이미지"
        value={section.image}
        onChange={(image, imageMeta) =>
          update<SplitSection>(section.id, { image, imageMeta })
        }
      />
      <FieldLabel label="이미지 위치">
        <select
          value={section.imageSide ?? "left"}
          onChange={(e) =>
            update<SplitSection>(section.id, {
              imageSide: e.target.value as SplitSection["imageSide"],
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm"
        >
          <option value="left">좌측</option>
          <option value="right">우측</option>
        </select>
      </FieldLabel>
      <FieldLabel label="제목">
        <input
          type="text"
          value={section.headline}
          onChange={(e) =>
            update<SplitSection>(section.id, { headline: e.target.value })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="본문">
        <textarea
          rows={5}
          value={section.body}
          onChange={(e) =>
            update<SplitSection>(section.id, { body: e.target.value })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="리스트 (선택, 줄바꿈으로 구분)">
        <textarea
          rows={3}
          value={(section.bullets ?? []).join("\n")}
          onChange={(e) => {
            const items = e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            update<SplitSection>(section.id, {
              bullets: items.length > 0 ? items : undefined,
            });
          }}
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
    </div>
  );
};
