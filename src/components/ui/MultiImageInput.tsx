import { useRef, type ChangeEvent } from "react";
import { type ImageMeta, processImageFile } from "@/lib/imageUpload";

export type MultiImageItem = {
  image: string;
  imageMeta: ImageMeta;
  name?: string;
};

type Props = {
  items: MultiImageItem[];
  onChange: (items: MultiImageItem[]) => void;
};

export const MultiImageInput = ({ items, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const added: MultiImageItem[] = [];
    for (const file of files) {
      added.push(await processImageFile(file));
    }
    onChange([...items, ...added]);
    e.target.value = "";
  };

  const remove = (idx: number) =>
    onChange(items.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded border border-dashed border-divider bg-gray-50 px-3 py-4 text-sm text-fg-muted hover:border-theme hover:text-theme"
      >
        + 이미지 여러 장 추가
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded border border-divider bg-white p-2"
            >
              <span className="w-5 text-center text-xs text-fg-muted">
                {i + 1}
              </span>
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
              <div className="flex-1 text-xs text-fg-muted">
                {item.name && (
                  <div className="truncate text-fg" title={item.name}>
                    {item.name}
                  </div>
                )}
                <div>
                  {item.imageMeta.w} × {item.imageMeta.h}
                </div>
              </div>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
                title="위로"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
                title="아래로"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-fg-muted hover:text-red-600"
                title="제거"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
