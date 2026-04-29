import type { RefObject } from "react";
import { useCampaignStore } from "@/lib/store";
import { readAsDataUrl } from "@/lib/imageUpload";
import { samplePosCards } from "@/lib/posSamples";
import type { POSBlock } from "@/lib/posSchema";
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

  const exportJpg = async () => {
    if (!previewRef.current) return;
    await captureIframeAsJpeg(previewRef.current, {
      width: 800,
      height: 600,
      filename: `pos-${Date.now()}.jpg`,
      targetSelector: "#pos-root",
    });
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
          className="w-full rounded bg-theme px-3 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          JPG로 저장 (800×600)
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
        <h3 className="mb-2 text-sm font-bold">키비주얼 이미지</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUploadKV(e.target.files[0])}
        />
        {card.keyVisualUrl && (
          <img src={card.keyVisualUrl} alt="키비주얼" className="mt-2 max-h-32" />
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

const BlockEditor = ({ block, update }: { block: POSBlock; update: (next: POSBlock) => void }) => {
  switch (block.type) {
    case "eyebrow":
    case "textLine":
      return (
        <input
          type="text"
          value={block.text}
          onChange={(e) => update({ ...block, text: e.target.value })}
          className="mt-1 w-full rounded border px-2 py-1 text-xs"
        />
      );
    case "title":
    case "highlight":
      return (
        <textarea
          value={block.lines.join("\n")}
          rows={3}
          onChange={(e) =>
            update({ ...block, lines: e.target.value.split("\n") })
          }
          className="mt-1 w-full rounded border px-2 py-1 text-xs"
        />
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
        </div>
      );
    default:
      return null;
  }
};
