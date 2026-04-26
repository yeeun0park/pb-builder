import { useCampaignStore } from "@/lib/store";
import type { FullbleedSection } from "@/lib/types";
import { FieldLabel } from "../ui/FieldLabel";
import { ImageInput } from "../ui/ImageInput";

export const FullbleedForm = ({ section }: { section: FullbleedSection }) => {
  const update = useCampaignStore((s) => s.updateSection);

  return (
    <div className="flex flex-col gap-3">
      <ImageInput
        label="이미지 (원본 비율로 자동 조정)"
        value={section.image}
        onChange={(image, imageMeta) =>
          update<FullbleedSection>(section.id, { image, imageMeta })
        }
      />
      <FieldLabel label="캡션 (선택)">
        <input
          type="text"
          value={section.caption ?? ""}
          onChange={(e) =>
            update<FullbleedSection>(section.id, {
              caption: e.target.value || undefined,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
    </div>
  );
};
