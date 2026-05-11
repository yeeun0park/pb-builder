import { useCampaignStore } from "@/lib/store";
import { FieldLabel } from "./ui/FieldLabel";

const inputCls =
  "h-11 rounded-lg border border-porcelain-300 bg-white px-3 text-[14px] text-porcelain-800 focus:outline-none";

export const MetaBar = () => {
  const campaign = useCampaignStore((s) => s.campaign);
  const updateMeta = useCampaignStore((s) => s.updateMeta);

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-porcelain-200 bg-porcelain-50 p-5">
      <FieldLabel label="캠페인 제목">
        <input
          type="text"
          value={campaign.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
          className={inputCls}
        />
      </FieldLabel>
      <FieldLabel label="Slug (영문 소문자·숫자·하이픈)">
        <input
          type="text"
          value={campaign.slug}
          onChange={(e) => updateMeta({ slug: e.target.value })}
          className={inputCls}
        />
      </FieldLabel>
      <FieldLabel label="기간">
        <input
          type="text"
          value={campaign.period ?? ""}
          onChange={(e) =>
            updateMeta({ period: e.target.value || undefined })
          }
          placeholder="2026-04-09 ~ 2026-12-31"
          className={inputCls}
        />
      </FieldLabel>
      <FieldLabel label="테마 컬러">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={campaign.themeColor}
            onChange={(e) => updateMeta({ themeColor: e.target.value })}
            className="h-11 w-14 cursor-pointer rounded-lg border border-porcelain-300"
          />
          <input
            type="text"
            value={campaign.themeColor}
            onChange={(e) => updateMeta({ themeColor: e.target.value })}
            className={`${inputCls} flex-1`}
          />
        </div>
      </FieldLabel>
    </div>
  );
};
