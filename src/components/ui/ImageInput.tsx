import { useRef, type ChangeEvent } from "react";
import {
  type ImageMeta,
  processImageFile,
} from "@/lib/imageUpload";

export type { ImageMeta };

type Props = {
  value: string;
  onChange: (dataUrl: string, meta?: ImageMeta) => void;
  label?: string;
};

export const ImageInput = ({ value, onChange, label }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { image, imageMeta } = await processImageFile(file);
    onChange(image, imageMeta);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm text-fg-muted">{label}</span>}
      <div className="flex items-start gap-3">
        <div
          className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-divider bg-gray-50 text-xs text-fg-muted hover:border-theme"
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            "이미지 선택"
          )}
        </div>
        {value && (
          <button
            type="button"
            className="text-xs text-fg-muted underline hover:text-fg"
            onClick={() => onChange("")}
          >
            제거
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
};
