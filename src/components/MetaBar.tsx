import { useCampaignStore } from "@/lib/store";
import { FieldLabel } from "./ui/FieldLabel";

export const MetaBar = () => {
  const campaign = useCampaignStore((s) => s.campaign);
  const updateMeta = useCampaignStore((s) => s.updateMeta);

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-divider bg-gray-50 p-4">
      <FieldLabel label="캠페인 제목">
        <input
          type="text"
          value={campaign.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="Slug (영문 소문자, 숫자, 하이픈)">
        <input
          type="text"
          value={campaign.slug}
          onChange={(e) => updateMeta({ slug: e.target.value })}
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="기간 (YYYY-MM-DD ~ YYYY-MM-DD)">
        <input
          type="text"
          value={campaign.period ?? ""}
          onChange={(e) =>
            updateMeta({ period: e.target.value || undefined })
          }
          placeholder="2026-04-09 ~ 2026-12-31"
          className="rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
        />
      </FieldLabel>
      <FieldLabel label="테마 컬러">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={campaign.themeColor}
            onChange={(e) => updateMeta({ themeColor: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border border-divider"
          />
          <input
            type="text"
            value={campaign.themeColor}
            onChange={(e) => updateMeta({ themeColor: e.target.value })}
            className="flex-1 rounded border border-divider px-2 py-1.5 text-sm focus:border-theme focus:outline-none"
          />
        </div>
      </FieldLabel>
    </div>
  );
};
