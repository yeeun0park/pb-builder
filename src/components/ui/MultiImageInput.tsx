import { useRef, type ChangeEvent } from "react";
import { ChevronDown, ChevronUp, ImagePlus, X } from "lucide-react";
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
        className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-porcelain-300 bg-porcelain-50 px-3 py-5 text-[13px] font-bold text-porcelain-600 transition hover:border-navy-600 hover:bg-navy-50 hover:text-navy-600"
      >
        <ImagePlus className="h-4 w-4" />
        이미지 여러 장 추가
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
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-porcelain-200 bg-white p-2"
            >
              <span className="w-5 text-center text-[11px] font-bold text-porcelain-500">
                {i + 1}
              </span>
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 shrink-0 rounded-md object-cover"
              />
              <div className="flex-1 text-[11px] text-porcelain-600">
                {item.name && (
                  <div className="truncate font-bold text-porcelain-800" title={item.name}>
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
                className="rounded p-1 text-porcelain-500 transition hover:bg-porcelain-100 hover:text-navy-600 disabled:opacity-30 disabled:hover:bg-transparent"
                title="위로"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded p-1 text-porcelain-500 transition hover:bg-porcelain-100 hover:text-navy-600 disabled:opacity-30 disabled:hover:bg-transparent"
                title="아래로"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded p-1 text-porcelain-500 transition hover:bg-accent-hot-tint hover:text-accent-hot"
                title="제거"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
