import { useState, type RefObject } from "react";
import {
  Boxes,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  Layout,
  Palette,
  Plus,
  Sliders,
  Star,
  X,
} from "lucide-react";
import { useCampaignStore } from "@/lib/store";
import { readAsDataUrl } from "@/lib/imageUpload";
import { samplePosCards } from "@/lib/posSamples";
import type { POSBlock, BlockStyle } from "@/lib/posSchema";
import { captureIframeAsJpeg } from "@/lib/htmlExport";
import { nanoid } from "nanoid";

type Props = { previewRef: RefObject<HTMLIFrameElement> };

const inputCls =
  "h-11 rounded-lg border border-porcelain-300 bg-white px-3 text-[14px] text-porcelain-800 focus:outline-none";
const inputSmCls =
  "h-9 rounded-lg border border-porcelain-300 bg-white px-2 text-[13px] text-porcelain-800 focus:outline-none";
const chipBtnCls =
  "inline-flex items-center justify-center gap-1 rounded-lg border border-porcelain-300 bg-white px-2.5 py-1.5 text-[12px] font-bold text-porcelain-700 transition hover:border-navy-600 hover:text-navy-600";

const SectionHeader = ({
  icon: Icon,
  children,
}: {
  icon: typeof Star;
  children: React.ReactNode;
}) => (
  <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-porcelain-800">
    <Icon className="h-4 w-4 text-navy-600" />
    {children}
  </h3>
);

export const POSMode = ({ previewRef }: Props) => {
  const card = useCampaignStore((s) => s.posCard);
  const setCard = useCampaignStore((s) => s.setPosCard);
  const updateField = useCampaignStore((s) => s.updatePosCardField);
  const addBlock = useCampaignStore((s) => s.addPosBlock);
  const removeBlock = useCampaignStore((s) => s.removePosBlock);
  const moveBlock = useCampaignStore((s) => s.movePosBlock);
  const updateBlock = useCampaignStore((s) => s.updatePosBlock);

  const [exporting, setExporting] = useState(false);

  const exportJpg = async () => {
    if (!previewRef.current) return;
    if (exporting) return;
    setExporting(true);
    try {
      await captureIframeAsJpeg(previewRef.current, {
        width: 800,
        height: 600,
        filename: `pos-${Date.now()}.jpg`,
        targetSelector: "#pos-root",
      });
    } catch (err) {
      console.error("[POSMode] JPG 내보내기 실패:", err);
      alert("JPG 저장에 실패했습니다. 미리보기가 로드됐는지 확인해주세요.");
    } finally {
      setExporting(false);
    }
  };

  const onUploadKV = async (file: File) => {
    const dataUrl = await readAsDataUrl(file);
    updateField("keyVisualUrl", dataUrl);
  };

  const newBlock = (type: POSBlock["type"]): POSBlock => {
    const id = nanoid(8);
    switch (type) {
      case "eyebrow":
        return { id, type, text: "" };
      case "title":
        return { id, type, lines: [""] };
      case "highlight":
        return { id, type, lines: [""] };
      case "pillRow":
        return { id, type, items: [] };
      case "textLine":
        return { id, type, text: "" };
      case "textGroup":
        return { id, type, lines: [""] };
      case "rankList":
        return { id, type, items: [] };
      case "qrBlock":
        return {
          id,
          type,
          caption: "",
          layout: "horizontal" as const,
          style: { align: "center" as const, scale: 1.15 },
        };
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <button
        type="button"
        onClick={exportJpg}
        disabled={exporting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy-600 px-3 text-[15px] font-bold text-white shadow-pb-sm transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-porcelain-300 disabled:text-porcelain-600 disabled:shadow-none"
      >
        <Download className="h-4 w-4" />
        {exporting ? "저장 중…" : "JPG로 저장 (800×600)"}
      </button>

      <section>
        <SectionHeader icon={Star}>샘플 불러오기</SectionHeader>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(samplePosCards).map(([key, sample], index) => (
            <button
              key={key}
              type="button"
              onClick={() => setCard(sample)}
              className={chipBtnCls}
            >
              샘플 {index + 1}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Layout}>레이아웃</SectionHeader>
        <select
          value={card.layout}
          onChange={(e) =>
            updateField("layout", e.target.value as "split" | "fullbleed")
          }
          className={`${inputCls} w-full`}
        >
          <option value="split">분할 (좌 이미지 / 우 패널)</option>
          <option value="fullbleed">풀블리드 (전체 배경 + 우측 반투명 패널)</option>
        </select>
      </section>

      <section>
        <SectionHeader icon={Sliders}>
          좌측 이미지 비율 ({Math.round(card.splitRatio * 100)}%)
        </SectionHeader>
        <input
          type="range"
          min={30}
          max={80}
          step={1}
          value={Math.round(card.splitRatio * 100)}
          onChange={(e) => updateField("splitRatio", Number(e.target.value) / 100)}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-porcelain-500">
          <span>30%</span>
          <span>50%</span>
          <span>80%</span>
        </div>
      </section>

      <section>
        <SectionHeader icon={ImageIcon}>키비주얼 이미지</SectionHeader>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUploadKV(e.target.files[0])}
          className="text-[12px] text-porcelain-700"
        />
        {card.keyVisualUrl && (
          <>
            <img
              src={card.keyVisualUrl}
              alt="키비주얼"
              className="mt-2 max-h-32 rounded-md border border-porcelain-200"
            />
            <div className="mt-2 flex flex-col gap-2 text-[12px] text-porcelain-700">
              <label className="flex flex-col gap-1">
                좌우 위치 ({card.keyVisualPosition.x}%)
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={card.keyVisualPosition.x}
                  onChange={(e) =>
                    updateField("keyVisualPosition", {
                      ...card.keyVisualPosition,
                      x: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                상하 위치 ({card.keyVisualPosition.y}%)
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={card.keyVisualPosition.y}
                  onChange={(e) =>
                    updateField("keyVisualPosition", {
                      ...card.keyVisualPosition,
                      y: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
          </>
        )}
      </section>

      <section>
        <SectionHeader icon={Palette}>컬러</SectionHeader>
        <div className="grid grid-cols-2 gap-2 text-[12px] text-porcelain-700">
          <label className="flex items-center justify-between gap-2 rounded-lg border border-porcelain-200 px-2 py-1.5">
            패널 배경
            <input
              type="color"
              value={card.panelBg}
              onChange={(e) => updateField("panelBg", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-porcelain-300"
            />
          </label>
          <label className="flex items-center justify-between gap-2 rounded-lg border border-porcelain-200 px-2 py-1.5">
            본문 글자
            <input
              type="color"
              value={card.textPrimary}
              onChange={(e) => updateField("textPrimary", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-porcelain-300"
            />
          </label>
          <label className="flex items-center justify-between gap-2 rounded-lg border border-porcelain-200 px-2 py-1.5">
            강조 글자
            <input
              type="color"
              value={card.textAccent}
              onChange={(e) => updateField("textAccent", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-porcelain-300"
            />
          </label>
          <label className="flex items-center justify-between gap-2 rounded-lg border border-porcelain-200 px-2 py-1.5">
            알약 배경
            <input
              type="color"
              value={card.pillBg}
              onChange={(e) => updateField("pillBg", e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-porcelain-300"
            />
          </label>
        </div>
      </section>

      <section>
        <SectionHeader icon={Plus}>블록 추가</SectionHeader>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              "eyebrow",
              "title",
              "highlight",
              "pillRow",
              "textLine",
              "qrBlock",
            ] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              className={chipBtnCls}
              onClick={() => addBlock(newBlock(t))}
            >
              <Plus className="h-3 w-3" />
              {t}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader icon={Boxes}>블록 ({card.blocks.length})</SectionHeader>
        <div className="flex flex-col gap-2">
          {card.blocks.map((b, i) => (
            <div
              key={b.id}
              className="rounded-lg border border-porcelain-200 bg-white p-3 text-[12px]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-porcelain-800">
                  {i + 1}. {b.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, "up")}
                    disabled={i === 0}
                    title="위로"
                    className="rounded p-1 text-porcelain-500 transition hover:bg-porcelain-100 hover:text-navy-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, "down")}
                    disabled={i === card.blocks.length - 1}
                    title="아래로"
                    className="rounded p-1 text-porcelain-500 transition hover:bg-porcelain-100 hover:text-navy-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(b.id)}
                    title="삭제"
                    className="rounded p-1 text-porcelain-500 transition hover:bg-accent-hot-tint hover:text-accent-hot"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <BlockEditor block={b} update={updateBlock} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const updateStyle = (
  block: POSBlock,
  key: keyof BlockStyle,
  value: BlockStyle[keyof BlockStyle],
) => {
  const nextStyle = { ...(block.style ?? {}) };
  if (value === "" || value === undefined) {
    delete nextStyle[key];
  } else {
    (nextStyle as any)[key] = value;
  }
  const next = {
    ...block,
    style: Object.keys(nextStyle).length > 0 ? nextStyle : undefined,
  } as POSBlock;
  return next;
};

type SliderInputProps = {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
};

const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = "자동",
}: SliderInputProps) => {
  const sliderValue = value ?? min;
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between gap-1 text-porcelain-700">
        <span>{label}</span>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
          className="w-14 rounded-md border border-porcelain-300 px-1 py-0.5 text-right text-[12px]"
          placeholder={placeholder}
        />
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
};

const StyleEditor = ({
  block,
  update,
}: {
  block: POSBlock;
  update: (next: POSBlock) => void;
}) => {
  const s = block.style ?? {};
  return (
    <details className="mt-2 border-t border-porcelain-200 pt-2">
      <summary className="cursor-pointer text-[12px] font-bold text-porcelain-600 hover:text-navy-600">
        스타일 조정
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
        <label className="flex flex-col gap-1 text-porcelain-700">
          정렬
          <select
            value={s.align ?? ""}
            onChange={(e) =>
              update(
                updateStyle(block, "align", (e.target.value || undefined) as any),
              )
            }
            className={inputSmCls}
          >
            <option value="">기본 (가운데)</option>
            <option value="left">좌측</option>
            <option value="center">가운데</option>
            <option value="right">우측</option>
          </select>
        </label>
        <SliderInput
          label="글자 크기 (px)"
          min={8}
          max={72}
          value={s.fontSize}
          onChange={(v) => update(updateStyle(block, "fontSize", v))}
        />
        <SliderInput
          label="행간"
          min={0.8}
          max={3}
          step={0.05}
          value={s.lineHeight}
          onChange={(v) => update(updateStyle(block, "lineHeight", v))}
        />
        <label className="flex flex-col gap-1 text-porcelain-700">
          색상
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={s.color ?? "#000000"}
              onChange={(e) => update(updateStyle(block, "color", e.target.value))}
              className="h-7 w-10 cursor-pointer rounded border border-porcelain-300"
            />
            {s.color && (
              <button
                type="button"
                onClick={() => update(updateStyle(block, "color", undefined))}
                className="text-[11px] text-porcelain-500 hover:text-accent-hot"
              >
                초기화
              </button>
            )}
          </div>
        </label>
        <SliderInput
          label="위 여백 (px)"
          min={0}
          max={200}
          value={s.marginTop}
          onChange={(v) => update(updateStyle(block, "marginTop", v))}
        />
        <SliderInput
          label="아래 여백 (px)"
          min={0}
          max={200}
          value={s.marginBottom}
          onChange={(v) => update(updateStyle(block, "marginBottom", v))}
        />
        <SliderInput
          label="전체 크기 (배율)"
          min={0.3}
          max={3}
          step={0.05}
          value={s.scale}
          onChange={(v) => update(updateStyle(block, "scale", v))}
          placeholder="1"
        />
      </div>
    </details>
  );
};

const BlockEditor = ({
  block,
  update,
}: {
  block: POSBlock;
  update: (next: POSBlock) => void;
}) => {
  switch (block.type) {
    case "eyebrow":
    case "textLine":
      return (
        <>
          <input
            type="text"
            value={block.text}
            onChange={(e) => update({ ...block, text: e.target.value })}
            className={`${inputSmCls} mt-2 w-full`}
          />
          <StyleEditor block={block} update={update} />
        </>
      );
    case "title":
    case "highlight":
    case "textGroup":
      return (
        <>
          <textarea
            value={block.lines.join("\n")}
            rows={3}
            onChange={(e) =>
              update({ ...block, lines: e.target.value.split("\n") })
            }
            className="mt-2 w-full rounded-lg border border-porcelain-300 bg-white px-2 py-1.5 text-[13px] text-porcelain-800 focus:outline-none"
          />
          <StyleEditor block={block} update={update} />
        </>
      );
    case "pillRow":
      return (
        <div className="mt-2 flex flex-col gap-1.5">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                value={item.label}
                placeholder="라벨"
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, label: e.target.value };
                  update({ ...block, items });
                }}
                className={`${inputSmCls} w-1/3`}
              />
              <input
                value={item.value}
                placeholder="값"
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, value: e.target.value };
                  update({ ...block, items });
                }}
                className={`${inputSmCls} flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    ...block,
                    items: block.items.filter((_, j) => j !== i),
                  })
                }
                className="rounded p-1 text-porcelain-500 transition hover:bg-accent-hot-tint hover:text-accent-hot"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update({
                ...block,
                items: [...block.items, { label: "", value: "" }],
              })
            }
            className="inline-flex items-center gap-1 self-start text-[12px] font-bold text-navy-600 hover:text-navy-700"
          >
            <Plus className="h-3 w-3" /> 항목
          </button>
          <StyleEditor block={block} update={update} />
        </div>
      );
    case "rankList":
      return (
        <div className="mt-2 flex flex-col gap-1.5">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                type="number"
                value={item.rank}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, rank: Number(e.target.value) };
                  update({ ...block, items });
                }}
                className={`${inputSmCls} w-14`}
              />
              <input
                value={item.text}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, text: e.target.value };
                  update({ ...block, items });
                }}
                className={`${inputSmCls} flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    ...block,
                    items: block.items.filter((_, j) => j !== i),
                  })
                }
                className="rounded p-1 text-porcelain-500 transition hover:bg-accent-hot-tint hover:text-accent-hot"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update({
                ...block,
                items: [
                  ...block.items,
                  {
                    rank: Math.max(0, ...block.items.map((i) => i.rank)) + 1,
                    text: "",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 self-start text-[12px] font-bold text-navy-600 hover:text-navy-700"
          >
            <Plus className="h-3 w-3" /> 등수
          </button>
          <StyleEditor block={block} update={update} />
        </div>
      );
    case "qrBlock":
      return (
        <div className="mt-2 flex flex-col gap-2">
          <select
            value={block.layout}
            onChange={(e) => {
              const newLayout = e.target.value as "horizontal" | "vertical";
              const newScale = newLayout === "vertical" ? 1.25 : 1.15;
              update({
                ...block,
                layout: newLayout,
                style: { ...(block.style ?? {}), scale: newScale },
              });
            }}
            className={inputSmCls}
          >
            <option value="horizontal">가로 (QR 좌 + 로고/캡션 우)</option>
            <option value="vertical">세로 (QR 위 + 로고/캡션 아래)</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const dataUrl = await readAsDataUrl(file);
              update({ ...block, qrDataUrl: dataUrl });
            }}
            className="text-[12px] text-porcelain-700"
          />
          <textarea
            value={block.caption}
            rows={2}
            placeholder="캡션"
            onChange={(e) => update({ ...block, caption: e.target.value })}
            className="rounded-lg border border-porcelain-300 bg-white px-2 py-1.5 text-[13px] text-porcelain-800 focus:outline-none"
          />
          <SliderInput
            label="로고 크기 (px)"
            min={20}
            max={120}
            value={block.logoSize}
            onChange={(v) => update({ ...block, logoSize: v })}
            placeholder="40"
          />
          <StyleEditor block={block} update={update} />
        </div>
      );
    default:
      return null;
  }
};
