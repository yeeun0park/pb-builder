import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { processImageFile } from "@/lib/imageUpload";
import { useCampaignStore } from "@/lib/store";

type Props = {
  previewRef: RefObject<HTMLIFrameElement | null>;
};

const rgbToHex = (rgb: string): string => {
  if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") {
    return "#ffffff";
  }
  const m = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!m) return rgb.startsWith("#") ? rgb : "#ffffff";
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
      .join("")
  );
};

const textToHex = (color: string): string => {
  if (!color) return "#000000";
  if (color.startsWith("#")) return color;
  return rgbToHex(color);
};

const getRenderedColorHex = (el: HTMLElement): string => {
  const inline = el.style.color;
  if (inline) return textToHex(inline);
  const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
  return textToHex(cs?.color ?? "");
};

const collectTextElements = (root: HTMLElement): HTMLElement[] => {
  const out: HTMLElement[] = [];
  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        const el = node as HTMLElement;
        if (el.tagName === "IMG" || el.tagName === "SCRIPT" || el.tagName === "STYLE") {
          return NodeFilter.FILTER_REJECT;
        }
        const hasDirectText = Array.from(el.childNodes).some(
          (n) =>
            n.nodeType === Node.TEXT_NODE &&
            (n.textContent?.trim().length ?? 0) > 2,
        );
        return hasDirectText ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    },
  );
  while (walker.nextNode()) {
    out.push(walker.currentNode as HTMLElement);
  }
  return out;
};

const ensureTextId = (el: HTMLElement): string => {
  let id = el.getAttribute("data-pb-tid");
  if (!id) {
    id = `pb-t-${Math.random().toString(36).slice(2, 9)}`;
    el.setAttribute("data-pb-tid", id);
  }
  return id;
};

export const HtmlDetailMode = ({ previewRef }: Props) => {
  const htmlOutput = useCampaignStore((s) => s.htmlOutput);
  const setHtmlOutput = useCampaignStore((s) => s.setHtmlOutput);

  const [sectionCount, setSectionCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeInnerKey, setActiveInnerKey] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndexRef = useRef<number | null>(null);

  const getDoc = useCallback(() => {
    return previewRef.current?.contentDocument ?? null;
  }, [previewRef]);

  const refreshCounts = useCallback(() => {
    const doc = getDoc();
    if (!doc?.body) return;
    setSectionCount(doc.body.children.length);
    setImageCount(doc.querySelectorAll("img").length);
    setTick((t) => t + 1);
  }, [getDoc]);

  const serializeDom = useCallback((): string | null => {
    const doc = getDoc();
    if (!doc) return null;
    const editableBefore = doc.body.getAttribute("contenteditable");
    const outlineBefore = doc.body.style.outline;
    doc.body.removeAttribute("contenteditable");
    doc.body.style.outline = "";
    const html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
    if (editableBefore) doc.body.setAttribute("contenteditable", editableBefore);
    if (outlineBefore) doc.body.style.outline = outlineBefore;
    return html;
  }, [getDoc]);

  useEffect(() => {
    const iframe = previewRef.current;
    if (!iframe) return;

    const handleClick = (e: Event) => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      let target = e.target as HTMLElement | null;
      // Walk up to find body's direct child
      while (target && target.parentElement && target.parentElement !== doc.body) {
        target = target.parentElement;
      }
      if (!target || target.parentElement !== doc.body) {
        setActiveIdx(null);
        setActiveInnerKey(null);
        return;
      }
      const topIdx = Array.from(doc.body.children).indexOf(target);
      if (topIdx < 0) return;
      setActiveIdx(topIdx);
      // If row-group, identify inner section
      if (target.classList.contains("pb-row-group")) {
        const original = e.target as HTMLElement | null;
        let inner = original;
        while (inner && inner.parentElement && inner.parentElement !== target) {
          inner = inner.parentElement;
        }
        if (inner && inner.parentElement === target) {
          const innerIdx = Array.from(target.children).indexOf(inner);
          setActiveInnerKey(`${topIdx}.${innerIdx}`);
          return;
        }
      }
      setActiveInnerKey(null);
    };

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      doc.body.setAttribute("contenteditable", "true");
      doc.body.style.outline = "";
      doc.body.style.outlineOffset = "";
      doc.body.removeEventListener("click", handleClick);
      doc.body.addEventListener("click", handleClick);
      refreshCounts();
    };
    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete") onLoad();
    return () => {
      iframe.removeEventListener("load", onLoad);
      const doc = iframe.contentDocument;
      doc?.body?.removeEventListener("click", handleClick);
    };
  }, [previewRef, refreshCounts]);

  useEffect(() => {
    return () => {
      const serialized = serializeDom();
      if (serialized) setHtmlOutput(serialized);
    };
  }, [serializeDom, setHtmlOutput]);

  const getSectionEl = (index: number): HTMLElement | null => {
    const doc = getDoc();
    return (doc?.body.children[index] as HTMLElement | undefined) ?? null;
  };

  const changeSectionBg = (index: number, color: string) => {
    const el = getSectionEl(index);
    if (!el) return;
    el.style.backgroundColor = color;
    setTick((t) => t + 1);
  };

  const changeSectionDirection = (index: number, direction: "row" | "column") => {
    const el = getSectionEl(index);
    if (!el) return;
    const candidates = [
      el,
      ...Array.from(el.querySelectorAll<HTMLElement>("*")),
    ].filter((n) => {
      const cs = n.ownerDocument?.defaultView?.getComputedStyle(n);
      if (!cs) return false;
      return (
        (cs.display === "flex" || cs.display === "inline-flex") &&
        n.children.length > 1
      );
    });
    const targets = candidates.length > 0 ? candidates : [el];
    for (const c of targets) {
      if (direction === "column") {
        c.style.display = "flex";
        c.style.flexDirection = "column";
        c.style.alignItems = "center";
        c.style.textAlign = "center";
      } else {
        c.style.display = "flex";
        c.style.flexDirection = "row";
        c.style.alignItems = "center";
        c.style.justifyContent = "center";
      }
    }
    el.setAttribute("data-pb-direction", direction);
    setTick((t) => t + 1);
  };

  const toggleSectionReverse = (index: number) => {
    const el = getSectionEl(index);
    if (!el) return;
    const isReversed = el.getAttribute("data-pb-reverse") === "true";
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    if (isReversed) {
      el.removeAttribute("data-pb-reverse");
      if (el.style.flexDirection === "row-reverse") {
        el.style.removeProperty("flex-direction");
      }
      Array.from(el.children).forEach((k) =>
        (k as HTMLElement).style.removeProperty("order"),
      );
    } else {
      el.setAttribute("data-pb-reverse", "true");
      if (cs?.display === "grid" || cs?.display === "inline-grid") {
        const kids = Array.from(el.children) as HTMLElement[];
        kids.forEach((k, i) =>
          k.style.setProperty("order", String(kids.length - i), "important"),
        );
      } else {
        if (cs?.display !== "flex" && cs?.display !== "inline-flex") {
          el.style.setProperty("display", "flex", "important");
        }
        el.style.setProperty("flex-direction", "row-reverse", "important");
      }
    }
    setTick((t) => t + 1);
  };

  const groupWithNext = (index: number) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const kids = Array.from(doc.body.children);
    const a = kids[index] as HTMLElement | undefined;
    const b = kids[index + 1] as HTMLElement | undefined;
    if (!a || !b) return;
    if (a.classList.contains("pb-row-group")) {
      a.appendChild(b);
      b.style.setProperty("flex", "1 1 0", "important");
      b.style.setProperty("min-width", "0", "important");
      refreshCounts();
      return;
    }
    const wrap = doc.createElement("div");
    wrap.className = "pb-row-group";
    wrap.style.setProperty("display", "flex", "important");
    wrap.style.setProperty("flex-direction", "row", "important");
    wrap.style.setProperty("flex-wrap", "wrap", "important");
    wrap.style.setProperty("gap", "20px", "important");
    wrap.style.setProperty("align-items", "stretch", "important");
    doc.body.insertBefore(wrap, a);
    wrap.appendChild(a);
    wrap.appendChild(b);
    [a, b].forEach((c) => {
      c.style.setProperty("flex", "1 1 0", "important");
      c.style.setProperty("min-width", "0", "important");
    });
    refreshCounts();
  };

  const moveInnerInGroup = (parentIdx: number, innerIdx: number, dir: -1 | 1) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const wrap = doc.body.children[parentIdx] as HTMLElement | undefined;
    if (!wrap) return;
    const inner = wrap.children[innerIdx] as HTMLElement | undefined;
    const target = wrap.children[innerIdx + dir] as HTMLElement | undefined;
    if (!inner || !target) return;
    if (dir === -1) wrap.insertBefore(inner, target);
    else wrap.insertBefore(target, inner);
    refreshCounts();
  };

  const extractInner = (parentIdx: number, innerIdx: number) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const wrap = doc.body.children[parentIdx] as HTMLElement | undefined;
    if (!wrap) return;
    const inner = wrap.children[innerIdx] as HTMLElement | undefined;
    if (!inner) return;
    inner.style.removeProperty("flex");
    inner.style.removeProperty("min-width");
    wrap.parentElement?.insertBefore(inner, wrap.nextSibling);
    if (wrap.children.length <= 1) {
      if (wrap.children.length === 1) {
        const last = wrap.children[0] as HTMLElement;
        last.style.removeProperty("flex");
        last.style.removeProperty("min-width");
        wrap.parentElement?.insertBefore(last, wrap);
      }
      wrap.remove();
    }
    refreshCounts();
  };

  const removeInner = (parentIdx: number, innerIdx: number) => {
    if (!confirm("이 섹션을 삭제할까요?")) return;
    const doc = getDoc();
    if (!doc?.body) return;
    const wrap = doc.body.children[parentIdx] as HTMLElement | undefined;
    if (!wrap) return;
    const inner = wrap.children[innerIdx];
    inner?.remove();
    if (wrap.children.length <= 1) {
      if (wrap.children.length === 1) {
        const last = wrap.children[0] as HTMLElement;
        last.style.removeProperty("flex");
        last.style.removeProperty("min-width");
        wrap.parentElement?.insertBefore(last, wrap);
      }
      wrap.remove();
    }
    refreshCounts();
  };

  const setInnerBg = (parentIdx: number, innerIdx: number, color: string) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const wrap = doc.body.children[parentIdx] as HTMLElement | undefined;
    const inner = wrap?.children[innerIdx] as HTMLElement | undefined;
    if (!inner) return;
    inner.style.backgroundColor = color;
    setTick((t) => t + 1);
  };

  const ungroupRow = (index: number) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const kids = Array.from(doc.body.children);
    const wrap = kids[index] as HTMLElement | undefined;
    if (!wrap?.classList.contains("pb-row-group")) return;
    const inner = Array.from(wrap.children) as HTMLElement[];
    inner.reverse().forEach((c) => {
      c.style.removeProperty("flex");
      c.style.removeProperty("min-width");
      doc.body.insertBefore(c, wrap.nextSibling);
    });
    wrap.remove();
    refreshCounts();
  };

  const setOverlayStrength = (index: number, strength: number) => {
    const el = getSectionEl(index);
    if (!el) return;
    el.style.setProperty(
      "--pb-overlay-strength",
      String(strength),
      "important",
    );
    setTick((t) => t + 1);
  };

  const dragFromRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const onDragStart = (idx: number) => (e: React.DragEvent) => {
    dragFromRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };
  const onDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOver !== idx) setDragOver(idx);
  };
  const onDragLeave = () => setDragOver(null);
  const onDrop = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const from = dragFromRef.current;
    dragFromRef.current = null;
    if (from === null || from === idx) return;
    const doc = getDoc();
    if (!doc?.body) return;
    const kids = Array.from(doc.body.children);
    const moving = kids[from];
    const target = kids[idx];
    if (!moving || !target) return;
    if (from < idx) target.after(moving);
    else target.before(moving);
    refreshCounts();
  };

  const setSectionColumns = (index: number, cols: 1 | 2 | 3) => {
    const el = getSectionEl(index);
    if (!el) return;
    if (cols <= 1) {
      el.style.removeProperty("display");
      el.style.removeProperty("grid-template-columns");
      el.style.removeProperty("gap");
      el.style.removeProperty("align-items");
      el.removeAttribute("data-pb-cols");
    } else {
      el.style.setProperty("display", "grid", "important");
      el.style.setProperty(
        "grid-template-columns",
        `repeat(${cols}, minmax(0, 1fr))`,
        "important",
      );
      el.style.setProperty("gap", "20px", "important");
      el.style.setProperty("align-items", "center", "important");
      el.setAttribute("data-pb-cols", String(cols));
      el.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        img.style.setProperty("width", "100%", "important");
        img.style.setProperty("height", "auto", "important");
      });
    }
    setTick((t) => t + 1);
  };

  const deleteSection = (index: number) => {
    if (!confirm("이 섹션을 삭제할까요?")) return;
    const el = getSectionEl(index);
    if (!el) return;
    el.remove();
    refreshCounts();
  };

  const moveSection = (index: number, delta: -1 | 1) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const el = doc.body.children[index];
    const target = doc.body.children[index + delta];
    if (!el || !target) return;
    if (delta === -1) {
      doc.body.insertBefore(el, target);
    } else {
      doc.body.insertBefore(target, el);
    }
    refreshCounts();
  };

  const applyBulkTextColor = (
    scope: "all" | "heading" | "body",
    color: string,
  ) => {
    const doc = getDoc();
    if (!doc?.body) return;
    const matchesScope = (el: HTMLElement): boolean => {
      const tag = el.tagName.toLowerCase();
      if (scope === "heading") return /^h[1-6]$/.test(tag);
      if (scope === "body") return ["p", "li", "span", "a", "blockquote"].includes(tag);
      return true;
    };
    const all = Array.from(doc.body.querySelectorAll<HTMLElement>("*")).filter(
      (el) => {
        if (el.tagName === "IMG" || el.tagName === "SCRIPT" || el.tagName === "STYLE") {
          return false;
        }
        const hasDirectText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0,
        );
        return hasDirectText && matchesScope(el);
      },
    );
    for (const el of all) {
      el.style.setProperty("color", color, "important");
    }
    setTick((t) => t + 1);
  };

  const resetAllTextColors = () => {
    if (!confirm("모든 텍스트 색을 초기화할까요? (개별 설정 모두 제거)")) return;
    const doc = getDoc();
    if (!doc?.body) return;
    const all = Array.from(doc.body.querySelectorAll<HTMLElement>("*"));
    for (const el of all) {
      if (el.style.color) el.style.removeProperty("color");
    }
    setTick((t) => t + 1);
  };

  const getTextElByTid = (tid: string): HTMLElement | null => {
    const doc = getDoc();
    return (
      (doc?.querySelector(`[data-pb-tid="${tid}"]`) as HTMLElement | null) ??
      null
    );
  };

  const changeTextAlign = (tid: string, align: "left" | "center" | "right") => {
    const el = getTextElByTid(tid);
    if (!el) return;
    el.style.textAlign = align;
    setTick((t) => t + 1);
  };

  const changeTextColor = (tid: string, color: string) => {
    const el = getTextElByTid(tid);
    if (!el) return;
    el.style.setProperty("color", color, "important");
    el.querySelectorAll<HTMLElement>("*").forEach((child) => {
      if (child.tagName !== "IMG" && child.tagName !== "SCRIPT" && child.tagName !== "STYLE") {
        child.style.setProperty("color", "inherit", "important");
      }
    });
    setTick((t) => t + 1);
  };

  const changeTextFontSize = (tid: string, delta: number) => {
    const el = getTextElByTid(tid);
    if (!el) return;
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    const current = parseFloat(cs?.fontSize || "16");
    const next = Math.max(8, Math.min(160, Math.round(current + delta)));
    el.style.fontSize = `${next}px`;
    setTick((t) => t + 1);
  };

  const changeTextLineHeight = (tid: string, delta: number) => {
    const el = getTextElByTid(tid);
    if (!el) return;
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    const fontSize = parseFloat(cs?.fontSize || "16");
    const computedLh = parseFloat(cs?.lineHeight || "0");
    const currentRatio =
      computedLh > 0 && fontSize > 0 ? computedLh / fontSize : 1.6;
    const nextRatio =
      Math.max(1.0, Math.min(3.0, Math.round((currentRatio + delta) * 100) / 100));
    el.style.setProperty("line-height", String(nextRatio), "important");
    setTick((t) => t + 1);
  };

  const getTextLineHeightRatio = (el: HTMLElement): number => {
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    const fs = parseFloat(cs?.fontSize || "16");
    const lh = parseFloat(cs?.lineHeight || "0");
    if (lh > 0 && fs > 0) return Math.round((lh / fs) * 100) / 100;
    return 1.6;
  };

  const getTextFontSizePx = (el: HTMLElement): number => {
    const cs = el.ownerDocument.defaultView?.getComputedStyle(el);
    return Math.round(parseFloat(cs?.fontSize || "16"));
  };

  const getImgEl = (index: number): HTMLImageElement | null => {
    const doc = getDoc();
    const imgs = doc?.querySelectorAll("img");
    return (imgs?.[index] as HTMLImageElement | undefined) ?? null;
  };

  const changeImageWidth = (index: number, pct: number) => {
    const img = getImgEl(index);
    if (!img) return;
    img.style.setProperty("max-width", `${pct}%`, "important");
    img.style.setProperty("display", "block", "important");
    img.style.setProperty("margin-left", "auto", "important");
    img.style.setProperty("margin-right", "auto", "important");
    setTick((t) => t + 1);
  };

  const triggerImageReplace = (index: number) => {
    pendingIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = pendingIndexRef.current;
    const file = e.target.files?.[0];
    e.target.value = "";
    pendingIndexRef.current = null;
    if (idx === null || !file) return;
    try {
      const { image } = await processImageFile(file);
      const img = getImgEl(idx);
      if (!img) return;
      img.src = image;
      setTick((t) => t + 1);
    } catch (err) {
      alert(
        `이미지 교체 실패: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  if (!htmlOutput) {
    return (
      <div className="flex flex-col gap-3 p-4 text-center text-sm text-fg-muted">
        <p>
          먼저 <strong className="text-fg">AI 자동 생성</strong> 탭에서 HTML을 생성하세요.
        </p>
      </div>
    );
  }

  const renderAlignButtons = (
    current: string,
    onChange: (a: "left" | "center" | "right") => void,
  ) => (
    <div className="flex gap-1">
      {(["left", "center", "right"] as const).map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(a)}
          className={`rounded px-2 py-0.5 text-[11px] ${
            current === a
              ? "bg-theme text-white"
              : "border border-divider bg-white text-fg-muted hover:border-theme"
          }`}
        >
          {a === "left" ? "좌" : a === "center" ? "중" : "우"}
        </button>
      ))}
    </div>
  );

  const sectionCards: React.ReactNode[] = [];
  for (let i = 0; i < sectionCount; i++) {
    const el = getSectionEl(i);
    if (!el) continue;

    if (el.classList.contains("pb-row-group")) {
      const innerCount = el.children.length;
      sectionCards.push(
        <div
          key={i}
          draggable
          onDragStart={onDragStart(i)}
          onDragOver={onDragOver(i)}
          onDragLeave={onDragLeave}
          onDrop={onDrop(i)}
          className={`flex flex-col gap-2 rounded border bg-amber-50/40 p-2 cursor-move ${
            dragOver === i
              ? "border-theme ring-2 ring-theme/30"
              : activeIdx === i
                ? "border-theme ring-2 ring-theme/40"
                : "border-amber-300"
          }`}
          data-pb-card-idx={i}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 text-center text-xs text-fg-muted">#{i + 1}</span>
            <span className="flex-1 truncate text-xs">
              📦 같은 행 묶음 ({innerCount}개)
            </span>
            <button
              type="button"
              onClick={() => moveSection(i, -1)}
              disabled={i === 0}
              className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
              title="위로"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveSection(i, 1)}
              disabled={i === sectionCount - 1}
              className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
              title="아래로"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => groupWithNext(i)}
              disabled={i === sectionCount - 1}
              className="rounded border border-divider bg-white px-1.5 py-0.5 text-[11px] text-fg-muted disabled:opacity-30 hover:border-theme hover:text-theme"
              title="다음 섹션도 같은 행에 추가"
            >
              + 옆 추가
            </button>
            <button
              type="button"
              onClick={() => ungroupRow(i)}
              className="rounded border border-divider bg-white px-1.5 py-0.5 text-[11px] text-fg-muted hover:border-theme hover:text-theme"
              title="묶음 풀기"
            >
              풀기
            </button>
            <button
              type="button"
              onClick={() => deleteSection(i)}
              className="text-xs text-fg-muted hover:text-red-600"
              title="삭제"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-1 border-t border-amber-300/50 pt-2">
            {Array.from(el.children).map((inner, j) => {
              const innerEl = inner as HTMLElement;
              const innerLabel =
                (innerEl.textContent || innerEl.tagName).trim().slice(0, 28) ||
                `섹션 ${j + 1}`;
              const innerBgRaw =
                innerEl.style.backgroundColor ||
                getDoc()?.defaultView?.getComputedStyle(innerEl).backgroundColor ||
                "transparent";
              const innerBgHex = rgbToHex(innerBgRaw);
              const innerKey = `${i}.${j}`;
              const isInnerActive = activeInnerKey === innerKey;
              return (
                <div
                  key={j}
                  className={`flex items-center gap-1.5 rounded bg-white px-2 py-1.5 ${
                    isInnerActive ? "ring-2 ring-theme/40 border border-theme" : "border border-transparent"
                  }`}
                >
                  <span className="w-4 text-center text-[10px] text-fg-muted">
                    {j + 1}.
                  </span>
                  <span
                    className="flex-1 truncate text-[11px]"
                    title={innerLabel}
                  >
                    {innerLabel}
                  </span>
                  <input
                    type="color"
                    value={innerBgHex}
                    onChange={(e) => setInnerBg(i, j, e.target.value)}
                    className="h-5 w-7 cursor-pointer rounded border border-divider"
                    title="배경색"
                  />
                  <button
                    type="button"
                    onClick={() => moveInnerInGroup(i, j, -1)}
                    disabled={j === 0}
                    className="text-[11px] text-fg-muted disabled:opacity-30 hover:text-fg"
                    title="앞으로"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveInnerInGroup(i, j, 1)}
                    disabled={j === innerCount - 1}
                    className="text-[11px] text-fg-muted disabled:opacity-30 hover:text-fg"
                    title="뒤로"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => extractInner(i, j)}
                    className="rounded border border-divider bg-white px-1.5 py-0.5 text-[10px] text-fg-muted hover:border-theme hover:text-theme"
                    title="묶음에서 분리"
                  >
                    분리
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInner(i, j)}
                    className="text-[11px] text-fg-muted hover:text-red-600"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>,
      );
      continue;
    }

    const bgRaw =
      el.style.backgroundColor ||
      getDoc()?.defaultView?.getComputedStyle(el).backgroundColor ||
      "transparent";
    const bgHex = rgbToHex(bgRaw);
    const label =
      (el.textContent || el.tagName).trim().slice(0, 30) || `섹션 ${i + 1}`;
    const direction = el.getAttribute("data-pb-direction") || "";
    const cols = parseInt(el.getAttribute("data-pb-cols") || "1", 10);
    const reversed = el.getAttribute("data-pb-reverse") === "true";
    const isOverlay = el.classList.contains("pb-overlay-section");
    const overlayStrength = parseFloat(
      el.style.getPropertyValue("--pb-overlay-strength") || "0.45",
    );

    const textEls = collectTextElements(el).slice(0, 8);

    sectionCards.push(
      <div
        key={i}
        draggable
        onDragStart={onDragStart(i)}
        onDragOver={onDragOver(i)}
        onDragLeave={onDragLeave}
        onDrop={onDrop(i)}
        className={`flex flex-col gap-2 rounded border bg-white p-2 cursor-move ${
          dragOver === i
            ? "border-theme ring-2 ring-theme/30"
            : activeIdx === i
              ? "border-theme ring-2 ring-theme/40"
              : "border-divider"
        }`}
        data-pb-card-idx={i}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 text-center text-xs text-fg-muted">#{i + 1}</span>
          <span className="flex-1 truncate text-xs" title={label}>
            {label}
          </span>
          <button
            type="button"
            onClick={() => moveSection(i, -1)}
            disabled={i === 0}
            className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
            title="위로"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => moveSection(i, 1)}
            disabled={i === sectionCount - 1}
            className="text-xs text-fg-muted disabled:opacity-30 hover:text-fg"
            title="아래로"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => groupWithNext(i)}
            disabled={i === sectionCount - 1}
            className="rounded border border-divider bg-white px-1.5 py-0.5 text-[11px] text-fg-muted disabled:opacity-30 hover:border-theme hover:text-theme"
            title="다음 섹션과 같은 행에 묶기"
          >
            ▶ 묶기
          </button>
          <button
            type="button"
            onClick={() => deleteSection(i)}
            className="text-xs text-fg-muted hover:text-red-600"
            title="삭제"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="w-10 text-[11px] text-fg-muted">배경</label>
          <input
            type="color"
            value={bgHex}
            onChange={(e) => changeSectionBg(i, e.target.value)}
            className="h-6 w-10 cursor-pointer rounded border border-divider"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-10 text-[11px] text-fg-muted">배치</label>
          <button
            type="button"
            onClick={() => changeSectionDirection(i, "row")}
            className={`rounded px-2 py-0.5 text-[11px] ${
              direction === "row"
                ? "bg-theme text-white"
                : "border border-divider bg-white text-fg-muted hover:border-theme"
            }`}
          >
            ↔ 가로
          </button>
          <button
            type="button"
            onClick={() => changeSectionDirection(i, "column")}
            className={`rounded px-2 py-0.5 text-[11px] ${
              direction === "column"
                ? "bg-theme text-white"
                : "border border-divider bg-white text-fg-muted hover:border-theme"
            }`}
          >
            ↕ 세로(중앙)
          </button>
          <button
            type="button"
            onClick={() => toggleSectionReverse(i)}
            className={`rounded px-2 py-0.5 text-[11px] ${
              reversed
                ? "bg-theme text-white"
                : "border border-divider bg-white text-fg-muted hover:border-theme"
            }`}
            title="좌/우 또는 행 순서 반전"
          >
            ⇄ 반전
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="w-10 text-[11px] text-fg-muted">열</label>
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSectionColumns(i, n)}
              className={`rounded px-2 py-0.5 text-[11px] ${
                cols === n
                  ? "bg-theme text-white"
                  : "border border-divider bg-white text-fg-muted hover:border-theme"
              }`}
            >
              {n}열
            </button>
          ))}
        </div>

        {isOverlay && (
          <div className="flex items-center gap-2">
            <label className="w-10 text-[11px] text-fg-muted">어둡게</label>
            <input
              type="range"
              min={0}
              max={85}
              step={5}
              value={Math.round(overlayStrength * 100)}
              onChange={(e) =>
                setOverlayStrength(i, Number(e.target.value) / 100)
              }
              className="flex-1"
            />
            <span className="w-10 text-right text-[11px] tabular-nums text-fg-muted">
              {Math.round(overlayStrength * 100)}%
            </span>
          </div>
        )}

        {textEls.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 border-t border-divider pt-2">
            <span className="text-[11px] font-bold text-fg-muted">
              텍스트 ({textEls.length})
            </span>
            {textEls.map((te) => {
              const tid = ensureTextId(te);
              const text = (te.textContent || "").trim().slice(0, 30);
              const alignCurrent = te.style.textAlign || "";
              const colorCurrent = getRenderedColorHex(te);
              const sizePx = getTextFontSizePx(te);
              const lhRatio = getTextLineHeightRatio(te);
              return (
                <div
                  key={tid}
                  className="flex flex-col gap-1 rounded bg-gray-50 px-2 py-1.5"
                >
                  <span className="truncate text-[11px]" title={text}>
                    <span className="font-bold text-fg-muted">
                      {te.tagName.toLowerCase()}
                    </span>
                    : {text || "(빈 텍스트)"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={colorCurrent}
                      onChange={(e) => changeTextColor(tid, e.target.value)}
                      className="h-5 w-7 cursor-pointer rounded border border-divider"
                      title="글자 색"
                    />
                    {renderAlignButtons(alignCurrent, (a) =>
                      changeTextAlign(tid, a),
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => changeTextFontSize(tid, -2)}
                        className="rounded border border-divider bg-white px-1.5 text-[11px] text-fg-muted hover:border-theme"
                        title="글자 작게"
                      >
                        A−
                      </button>
                      <span className="w-9 text-center text-[11px] tabular-nums text-fg-muted">
                        {sizePx}px
                      </span>
                      <button
                        type="button"
                        onClick={() => changeTextFontSize(tid, 2)}
                        className="rounded border border-divider bg-white px-1.5 text-[11px] text-fg-muted hover:border-theme"
                        title="글자 크게"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-fg-muted">행간</span>
                    <button
                      type="button"
                      onClick={() => changeTextLineHeight(tid, -0.1)}
                      className="rounded border border-divider bg-white px-1.5 text-[11px] text-fg-muted hover:border-theme"
                      title="행간 좁게"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-[11px] tabular-nums text-fg-muted">
                      {lhRatio.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeTextLineHeight(tid, 0.1)}
                      className="rounded border border-divider bg-white px-1.5 text-[11px] text-fg-muted hover:border-theme"
                      title="행간 넓게"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>,
    );
  }

  const imageCards: React.ReactNode[] = [];
  for (let i = 0; i < imageCount; i++) {
    const img = getImgEl(i);
    if (!img) continue;
    const currentMaxW = img.style.maxWidth;
    const widthPct = currentMaxW.endsWith("%") ? parseInt(currentMaxW, 10) : 100;
    imageCards.push(
      <div
        key={i}
        className="flex flex-col gap-2 rounded border border-divider bg-white p-2"
      >
        <div className="flex items-center gap-2">
          <img
            src={img.src}
            alt=""
            className="h-10 w-10 shrink-0 rounded object-cover"
          />
          <span className="flex-1 text-xs text-fg-muted">이미지 #{i + 1}</span>
          <button
            type="button"
            onClick={() => triggerImageReplace(i)}
            className="rounded border border-divider bg-white px-2 py-0.5 text-xs hover:border-theme hover:text-theme"
          >
            교체
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-10 text-[11px] text-fg-muted">크기</label>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={widthPct}
            onChange={(e) => changeImageWidth(i, Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-8 text-right text-[11px] tabular-nums">
            {widthPct}%
          </span>
        </div>
      </div>,
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-fg-muted">
        <strong className="text-fg">세부 조정 모드</strong>
        <br />
        프리뷰에서 글자를 바로 클릭해 수정하세요. 0.6초마다 자동 저장됩니다. 변경 사항은 우측 프리뷰에 즉시 반영됩니다.
      </div>

      <div className="flex flex-col gap-2 border border-divider bg-white p-3">
        <span className="text-sm font-bold">🎨 전체 텍스트 색상</span>
        <p className="text-[11px] text-fg-muted">
          일괄 변경 — 아래 섹션 안의 개별 텍스트 설정보다 먼저 적용됩니다.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col items-center gap-1 rounded border border-divider p-2 text-[11px]">
            <span className="text-fg-muted">모든 텍스트</span>
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => applyBulkTextColor("all", e.target.value)}
              className="h-7 w-full cursor-pointer rounded border border-divider"
            />
          </label>
          <label className="flex flex-col items-center gap-1 rounded border border-divider p-2 text-[11px]">
            <span className="text-fg-muted">제목 (h1~h6)</span>
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => applyBulkTextColor("heading", e.target.value)}
              className="h-7 w-full cursor-pointer rounded border border-divider"
            />
          </label>
          <label className="flex flex-col items-center gap-1 rounded border border-divider p-2 text-[11px]">
            <span className="text-fg-muted">본문 (p·li)</span>
            <input
              type="color"
              defaultValue="#000000"
              onChange={(e) => applyBulkTextColor("body", e.target.value)}
              className="h-7 w-full cursor-pointer rounded border border-divider"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={resetAllTextColors}
          className="self-start rounded border border-divider bg-white px-3 py-1 text-xs text-fg-muted hover:border-red-400 hover:text-red-600"
        >
          전체 초기화
        </button>
      </div>

      {sectionCards.length > 0 && (
        <div className="flex flex-col gap-2 border border-divider bg-white p-3">
          <span className="text-sm font-bold">🧩 섹션 ({sectionCards.length})</span>
          <div className="flex flex-col gap-2">{sectionCards}</div>
        </div>
      )}

      {imageCards.length > 0 && (
        <div className="flex flex-col gap-2 border border-divider bg-white p-3">
          <span className="text-sm font-bold">🖼️ 이미지 ({imageCards.length})</span>
          <div className="flex flex-col gap-2">{imageCards}</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}
    </div>
  );
};
