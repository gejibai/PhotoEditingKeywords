const http = require("node:http");

const port = Number(process.env.PORT || 8787);
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
const allowOrigin = process.env.ALLOW_ORIGIN || "*";

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function buildPrompt(payload) {
  return [
    "你是一个日常修图提示词字段拆解助手。",
    "请只返回 JSON，不要 Markdown，不要额外解释。",
    "JSON 结构必须是：{\"category\":\"...\",\"patch\":{...}}。",
    "category 只能使用请求里的 categories.id。",
    "patch 只能包含请求里的 fields 字段，所有值都必须是中文字符串。",
    "根据 rawIdea 和 currentForm 补全照片类型、保留内容、修改方向、主体、场景、风格、光线、色彩、构图、画质、禁止项等字段。",
    "不要生成真实图片，不要要求用户上传图片。",
    "",
    JSON.stringify(payload),
  ].join("\n");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!deepseekApiKey) {
    sendJson(res, 500, { error: "DEEPSEEK_API_KEY is not configured" });
    return;
  }

  try {
    const payload = await readJson(req);
    const rawIdea = typeof payload.rawIdea === "string" ? payload.rawIdea.trim() : "";
    if (!rawIdea) {
      sendJson(res, 400, { error: "rawIdea is required" });
      return;
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
        messages: [
          {
            role: "system",
            content: "你严格输出可被 JSON.parse 解析的 JSON。",
          },
          {
            role: "user",
            content: buildPrompt(payload),
          },
        ],
        response_format: { type: "json_object" },
        thinking: { type: "enabled" },
        reasoning_effort: process.env.DEEPSEEK_REASONING_EFFORT || "high",
        stream: false,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      sendJson(res, response.status, { error: "DeepSeek request failed", detail });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    sendJson(res, 200, JSON.parse(content));
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Unknown error" });
  }
});

server.listen(port, () => {
  console.log(`DeepSeek proxy listening on http://localhost:${port}`);
});
