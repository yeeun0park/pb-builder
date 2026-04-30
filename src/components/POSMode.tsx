import { useState, type RefObject } from "react";
import { useCampaignStore } from "@/lib/store";
import { readAsDataUrl } from "@/lib/imageUpload";
import { samplePosCards } from "@/lib/posSamples";
import type { POSBlock, BlockStyle } from "@/lib/posSchema";
import { captureIframeAsJpeg } from "@/lib/htmlExport";
import { nanoid } from "nanoid";

type Props = { previewRef: RefObject<HTMLIFrameElement> };

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
      case "rankList":
        return { id, type, items: [] };
      case "qrBlock":
        return { id, type, caption: "" };
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <section>
        <button
          type="button"
          onClick={exportJpg}
          disabled={exporting}
          className="w-full rounded bg-theme px-3 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? "저장 중..." : "JPG로 저장 (800×600)"}
        </button>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">샘플 불러오기</h3>
        <div className="flex flex-wrap gap-1">
          {Object.entries(samplePosCards).map(([key, sample]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCard(sample)}
              className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">레이아웃</h3>
        <select
          value={card.layout}
          onChange={(e) =>
            updateField("layout", e.target.value as "split" | "fullbleed")
          }
          className="w-full rounded border px-2 py-1 text-sm"
        >
          <option value="split">분할 (좌 이미지 / 우 패널)</option>
          <option value="fullbleed">풀블리드 (전체 배경 + 우측 반투명 패널)</option>
        </select>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">좌측 이미지 비율 ({Math.round(card.splitRatio * 100)}%)</h3>
        <input
          type="range"
          min={30}
          max={80}
          step={1}
          value={Math.round(card.splitRatio * 100)}
          onChange={(e) => updateField("splitRatio", Number(e.target.value) / 100)}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>30%</span>
          <span>50%</span>
          <span>80%</span>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">키비주얼 이미지</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUploadKV(e.target.files[0])}
        />
        {card.keyVisualUrl && (
          <>
            <img src={card.keyVisualUrl} alt="키비주얼" className="mt-2 max-h-32" />
            <div className="mt-2 flex flex-col gap-2 text-xs">
              <label className="flex flex-col gap-1">
                좌우 위치 ({card.keyVisualPosition.x}%)
                <input
                  type="range" min={0} max={100}
                  value={card.keyVisualPosition.x}
                  onChange={(e) => updateField("keyVisualPosition", { ...card.keyVisualPosition, x: Number(e.target.value) })}
                />
              </label>
              <label className="flex flex-col gap-1">
                상하 위치 ({card.keyVisualPosition.y}%)
                <input
                  type="range" min={0} max={100}
                  value={card.keyVisualPosition.y}
                  onChange={(e) => updateField("keyVisualPosition", { ...card.keyVisualPosition, y: Number(e.target.value) })}
                />
              </label>
            </div>
          </>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">컬러</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label>
            패널 배경{" "}
            <input
              type="color"
              value={card.panelBg}
              onChange={(e) => updateField("panelBg", e.target.value)}
            />
          </label>
          <label>
            본문 글자{" "}
            <input
              type="color"
              value={card.textPrimary}
              onChange={(e) => updateField("textPrimary", e.target.value)}
            />
          </label>
          <label>
            강조 글자{" "}
            <input
              type="color"
              value={card.textAccent}
              onChange={(e) => updateField("textAccent", e.target.value)}
            />
          </label>
          <label>
            알약 배경{" "}
            <input
              type="color"
              value={card.pillBg}
              onChange={(e) => updateField("pillBg", e.target.value)}
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">블록 추가</h3>
        <div className="flex flex-wrap gap-1">
          {(
            [
              "eyebrow",
              "title",
              "highlight",
              "pillRow",
              "textLine",
              "rankList",
              "qrBlock",
            ] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={() => addBlock(newBlock(t))}
            >
              + {t}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold">블록 ({card.blocks.length})</h3>
        <div className="flex flex-col gap-2">
          {card.blocks.map((b, i) => (
            <div key={b.id} className="rounded border p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold">
                  {i + 1}. {b.type}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, "up")}
                    disabled={i === 0}
                    className="disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, "down")}
                    disabled={i === card.blocks.length - 1}
                    className="disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(b.id)}
                    className="text-red-600"
                  >
                    ×
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

const updateStyle = (block: POSBlock, key: keyof BlockStyle, value: BlockStyle[keyof BlockStyle]) => {
  const nextStyle = { ...(block.style ?? {}) };
  if (value === "" || value === undefined) {
    delete nextStyle[key];
  } else {
    (nextStyle as any)[key] = value;
  }
  const next = { ...block, style: Object.keys(nextStyle).length > 0 ? nextStyle : undefined } as POSBlock;
  return next;
};

const StyleEditor = ({ block, update }: { block: POSBlock; update: (next: POSBlock) => void }) => {
  const s = block.style ?? {};
  return (
    <details className="mt-2 border-t pt-2">
      <summary className="cursor-pointer text-xs font-bold text-gray-600">스타일 조정</summary>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <label className="flex flex-col gap-1">
          정렬
          <select
            value={s.align ?? ""}
            onChange={(e) => update(updateStyle(block, "align", (e.target.value || undefined) as any))}
            className="rounded border px-1 py-0.5"
          >
            <option value="">기본 (가운데)</option>
            <option value="left">좌측</option>
            <option value="center">가운데</option>
            <option value="right">우측</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          글자 크기 (px)
          <input
            type="number" min={8} max={72}
            value={s.fontSize ?? ""}
            onChange={(e) => update(updateStyle(block, "fontSize", e.target.value === "" ? undefined : Number(e.target.value)))}
            className="rounded border px-1 py-0.5"
            placeholder="자동"
          />
        </label>
        <label className="flex flex-col gap-1">
          행간 (예: 1.3)
          <input
            type="number" step={0.05} min={0.8} max={3}
            value={s.lineHeight ?? ""}
            onChange={(e) => update(updateStyle(block, "lineHeight", e.target.value === "" ? undefined : Number(e.target.value)))}
            className="rounded border px-1 py-0.5"
            placeholder="자동"
          />
        </label>
        <label className="flex flex-col gap-1">
          색상
          <div className="flex gap-1">
            <input
              type="color"
              value={s.color ?? "#000000"}
              onChange={(e) => update(updateStyle(block, "color", e.target.value))}
              className="h-7 w-10"
            />
            {s.color && (
              <button type="button" onClick={() => update(updateStyle(block, "color", undefined))} className="text-[10px] text-gray-500 hover:text-red-500">초기화</button>
            )}
          </div>
        </label>
        <label className="flex flex-col gap-1">
          위 여백 (px)
          <input
            type="number" min={0} max={200}
            value={s.marginTop ?? ""}
            onChange={(e) => update(updateStyle(block, "marginTop", e.target.value === "" ? undefined : Number(e.target.value)))}
            className="rounded border px-1 py-0.5"
            placeholder="자동"
          />
        </label>
        <label className="flex flex-col gap-1">
          아래 여백 (px)
          <input
            type="number" min={0} max={200}
            value={s.marginBottom ?? ""}
            onChange={(e) => update(updateStyle(block, "marginBottom", e.target.value === "" ? undefined : Number(e.target.value)))}
            className="rounded border px-1 py-0.5"
            placeholder="자동"
          />
        </label>
        <label className="flex flex-col gap-1">
          전체 크기 (배율)
          <input
            type="number" step={0.05} min={0.3} max={3}
            value={s.scale ?? ""}
            onChange={(e) => update(updateStyle(block, "scale", e.target.value === "" ? undefined : Number(e.target.value)))}
            className="rounded border px-1 py-0.5"
            placeholder="1"
          />
        </label>
      </div>
    </details>
  );
};

const BlockEditor = ({ block, update }: { block: POSBlock; update: (next: POSBlock) => void }) => {
  switch (block.type) {
    case "eyebrow":
    case "textLine":
      return (
        <>
          <input
            type="text"
            value={block.text}
            onChange={(e) => update({ ...block, text: e.target.value })}
            className="mt-1 w-full rounded border px-2 py-1 text-xs"
          />
          <StyleEditor block={block} update={update} />
        </>
      );
    case "title":
    case "highlight":
      return (
        <>
          <textarea
            value={block.lines.join("\n")}
            rows={3}
            onChange={(e) =>
              update({ ...block, lines: e.target.value.split("\n") })
            }
            className="mt-1 w-full rounded border px-2 py-1 text-xs"
          />
          <StyleEditor block={block} update={update} />
        </>
      );
    case "pillRow":
      return (
        <div className="mt-1 flex flex-col gap-1">
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-1">
              <input
                value={item.label}
                placeholder="라벨"
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, label: e.target.value };
                  update({ ...block, items });
                }}
                className="w-1/3 rounded border px-1 text-xs"
              />
              <input
                value={item.value}
                placeholder="값"
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, value: e.target.value };
                  update({ ...block, items });
                }}
                className="flex-1 rounded border px-1 text-xs"
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    ...block,
                    items: block.items.filter((_, j) => j !== i),
                  })
                }
              >
                ×
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
            className="text-xs text-blue-600"
          >
            + 항목
          </button>
          <StyleEditor block={block} update={update} />
        </div>
      );
    case "rankList":
      return (
        <div className="mt-1 flex flex-col gap-1">
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-1">
              <input
                type="number"
                value={item.rank}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, rank: Number(e.target.value) };
                  update({ ...block, items });
                }}
                className="w-12 rounded border px-1 text-xs"
              />
              <input
                value={item.text}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...item, text: e.target.value };
                  update({ ...block, items });
                }}
                className="flex-1 rounded border px-1 text-xs"
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    ...block,
                    items: block.items.filter((_, j) => j !== i),
                  })
                }
              >
                ×
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
                  { rank: Math.max(0, ...block.items.map((i) => i.rank)) + 1, text: "" },
                ],
              })
            }
            className="text-xs text-blue-600"
          >
            + 등수
          </button>
          <StyleEditor block={block} update={update} />
        </div>
      );
    case "qrBlock":
      return (
        <div className="mt-1 flex flex-col gap-1">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const dataUrl = await readAsDataUrl(file);
              update({ ...block, qrDataUrl: dataUrl });
            }}
          />
          <textarea
            value={block.caption}
            rows={2}
            placeholder="캡션"
            onChange={(e) => update({ ...block, caption: e.target.value })}
            className="rounded border px-1 text-xs"
          />
          <StyleEditor block={block} update={update} />
        </div>
      );
    default:
      return null;
  }
};
