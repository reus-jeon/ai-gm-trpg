import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/gm-prompt";
import { generateMockGm } from "@/lib/mock-gm";
import type { Character, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GmRequest {
  character: Character;
  messages: ChatMessage[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  let body: GmRequest;
  try {
    body = (await req.json()) as GmRequest;
  } catch {
    return new Response("잘못된 요청입니다.", { status: 400 });
  }

  const { character, messages } = body;
  if (!character || !Array.isArray(messages) || messages.length === 0) {
    return new Response("캐릭터와 메시지가 필요합니다.", { status: 400 });
  }

  const encoder = new TextEncoder();
  const hasKey = !!process.env.ANTHROPIC_API_KEY;

  // ── 데모 모드: API 키가 없으면 가짜 GM으로 스트리밍 ──
  if (!hasKey) {
    const text = generateMockGm(character, messages);
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        // 토큰을 조금씩 흘려보내 실제 스트리밍처럼 보이게 한다
        const parts = text.split(/(\s+)/);
        for (const part of parts) {
          controller.enqueue(encoder.encode(part));
          if (part.trim()) await sleep(22);
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-GM-Mode": "mock",
      },
    });
  }

  // ── 라이브 모드: 실제 Claude 호출 ──
  const client = new Anthropic();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const gm = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: buildSystemPrompt(character),
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of gm) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("GM stream error:", err);
        controller.enqueue(
          encoder.encode("\n\n[GM과의 연결이 끊어졌습니다. 다시 시도해 주세요.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-GM-Mode": "live",
    },
  });
}
