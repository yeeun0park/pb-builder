import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit } from "./_lib/rate-limit.js";

const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

const endpointFor = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const ATTEMPTS = 3;
const DELAYS_MS = [0, 2000, 5000];

const callOne = async (
  model: string,
  body: string,
  apiKey: string,
): Promise<string> => {
  let lastError = "";
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    if (DELAYS_MS[attempt] > 0) {
      await new Promise((r) => setTimeout(r, DELAYS_MS[attempt]));
    }
    const resp = await fetch(
      `${endpointFor(model)}?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      },
    );
    if (resp.ok) {
      const data = (await resp.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("응답이 비어있습니다");
      return text;
    }
    const errText = (await resp.text()).slice(0, 200);
    lastError = `${resp.status}: ${errText}`;
    if (!RETRYABLE.has(resp.status)) {
      if (resp.status === 401 || resp.status === 403) {
        throw new Error(`SERVER_KEY_INVALID: ${lastError}`);
      }
      if (resp.status === 400 || resp.status === 404) {
        throw new Error(`MODEL_UNAVAILABLE: ${lastError}`);
      }
      throw new Error(`Gemini API ${lastError}`);
    }
  }
  throw new Error(`RETRY_EXHAUSTED: ${model} ${lastError}`);
};

const callWithFallback = async (
  body: string,
  apiKey: string,
): Promise<string> => {
  let lastMsg = "";
  for (const model of MODEL_CHAIN) {
    try {
      return await callOne(model, body, apiKey);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      lastMsg = msg;
      if (msg.includes("SERVER_KEY_INVALID")) throw e;
      if (
        msg.startsWith("RETRY_EXHAUSTED") ||
        msg.startsWith("MODEL_UNAVAILABLE")
      ) {
        console.warn(`[Gemini] ${model} 실패, 다음 모델 시도:`, msg);
        continue;
      }
      throw e;
    }
  }
  throw new Error(
    `Gemini 서버가 계속 혼잡합니다 (${MODEL_CHAIN.length}개 모델 모두 실패). 몇 분 후 다시 시도해주세요. [${lastMsg}]`,
  );
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "서버에 GEMINI_API_KEY 환경변수가 설정되지 않았습니다" });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)
      ?.split(",")[0]
      ?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    return res.status(429).json({
      error:
        rl.message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    });
  }

  const reqBody = req.body;
  if (
    !reqBody ||
    typeof reqBody !== "object" ||
    !Array.isArray((reqBody as { contents?: unknown }).contents)
  ) {
    return res.status(400).json({ error: "잘못된 요청 본문" });
  }

  try {
    const text = await callWithFallback(JSON.stringify(reqBody), apiKey);
    return res.status(200).json({ text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("SERVER_KEY_INVALID")) {
      return res.status(500).json({
        error: "서버 API 키가 유효하지 않습니다 (관리자에게 문의)",
      });
    }
    return res.status(503).json({ error: msg });
  }
}
