import { useState } from "react";
import {
  clearGeminiKey,
  getGeminiKey,
  maskKey,
  setGeminiKey,
} from "@/lib/geminiKey";

type Props = {
  onChange: () => void;
};

export const GeminiKeyPanel = ({ onChange }: Props) => {
  const [editing, setEditing] = useState(!getGeminiKey());
  const [draft, setDraft] = useState(getGeminiKey());
  const current = getGeminiKey();

  const save = () => {
    setGeminiKey(draft);
    setEditing(false);
    onChange();
  };

  const remove = () => {
    if (!confirm("API 키를 제거할까요?")) return;
    clearGeminiKey();
    setDraft("");
    setEditing(true);
    onChange();
  };

  if (!editing && current) {
    return (
      <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 text-xs">
        <div>
          <div className="font-bold text-fg">🔑 Gemini API 키 등록됨</div>
          <div className="mt-0.5 font-mono text-fg-muted">
            {maskKey(current)}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-divider bg-white px-2 py-1 hover:border-theme"
          >
            변경
          </button>
          <button
            type="button"
            onClick={remove}
            className="rounded border border-divider bg-white px-2 py-1 text-fg-muted hover:border-red-400 hover:text-red-600"
          >
            제거
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-xs">
      <div className="font-bold text-fg">🔑 Gemini API 키 설정</div>
      <div className="text-fg-muted">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-theme underline"
        >
          aistudio.google.com/app/apikey
        </a>
        &nbsp;에서 발급한 키를 붙여넣어주세요. 이 브라우저 localStorage에만
        저장되고 리포에 커밋되지 않습니다.
      </div>
      <div className="flex gap-2">
        <input
          type="password"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="AIza..."
          className="flex-1 rounded border border-divider px-2 py-1.5 font-mono text-xs focus:border-theme focus:outline-none"
        />
        <button
          type="button"
          onClick={save}
          disabled={draft.trim().length < 10}
          className="rounded bg-theme px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          저장
        </button>
        {current && (
          <button
            type="button"
            onClick={() => {
              setDraft(current);
              setEditing(false);
            }}
            className="rounded border border-divider bg-white px-3 py-1.5 text-xs"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
};
