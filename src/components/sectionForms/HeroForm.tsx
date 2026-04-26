import { useCampaignStore } from "@/lib/store";
import type { HeroSection } from "@/lib/types";
import { FieldLabel } from "../ui/FieldLabel";
import { ImageInput } from "../ui/ImageInput";

export const HeroForm = ({ section }: { section: HeroSection }) => {
  const update = useCampaignStore((s) => s.updateSection);

  return (
    <div className="flex flex-col gap-3">
      <ImageInput
        label="배경 이미지 (풀블리드)"
        value={section.image}
        onChange={(image, imageMeta) =>
          update<HeroSection>(section.id, { image, imageMeta })
        }
      />
      <FieldLabel label="제목">
        <textarea
          rows={2}
          value={section.headline}
          onChange={(e) =>
            update<HeroSection>(section.id, { headline: e.target.value })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="부제 (선택)">
        <input
          type="text"
          value={section.subhead ?? ""}
          onChange={(e) =>
            update<HeroSection>(section.id, {
              subhead: e.target.value || undefined,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="기간 (선택, YYYY-MM-DD ~ YYYY-MM-DD)">
        <input
          type="text"
          value={section.period ?? ""}
          onChange={(e) =>
            update<HeroSection>(section.id, {
              period: e.target.value || undefined,
            })
          }
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="오버레이">
          <select
            value={section.overlay ?? "dark"}
            onChange={(e) =>
              update<HeroSection>(section.id, {
                overlay: e.target.value as HeroSection["overlay"],
              })
            }
            className="rounded border border-divider px-2 py-1.5 text-sm"
          >
            <option value="dark">어둠 (밝은 텍스트)</option>
            <option value="light">밝음 (어두운 텍스트)</option>
            <option value="none">없음</option>
          </select>
        </FieldLabel>
        <FieldLabel label="정렬">
          <select
            value={section.align ?? "center"}
            onChange={(e) =>
              update<HeroSection>(section.id, {
                align: e.target.value as HeroSection["align"],
              })
            }
            className="rounded border border-divider px-2 py-1.5 text-sm"
          >
            <option value="center">중앙</option>
            <option value="left">좌측</option>
          </select>
        </FieldLabel>
      </div>
    </div>
  );
};
