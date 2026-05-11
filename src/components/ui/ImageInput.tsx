import { useRef, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
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
      {label && (
        <span className="text-[13px] font-bold text-porcelain-700">
          {label}
        </span>
      )}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-porcelain-300 bg-porcelain-50 text-[11px] text-porcelain-600 transition hover:border-navy-600 hover:text-navy-600"
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              이미지 선택
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            className="text-xs font-bold text-porcelain-600 underline-offset-2 transition hover:text-navy-600 hover:underline"
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
