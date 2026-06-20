import type { Character, ChatMessage } from "./types";
import { d } from "./dice";

/**
 * ANTHROPIC_API_KEY 가 없을 때 사용하는 데모용 가짜 GM.
 * 실제 Claude 호출 없이 어두운 판타지 분위기의 응답을 만들어 낸다.
 */

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const OPENINGS = [
  (c: Character) =>
    `차가운 빗줄기가 무너진 성문을 두드린다. ${c.race} ${c.klass}인 당신, ${c.name}은(는) 젖은 망토를 여미며 검게 그을린 돌계단 앞에 선다. 멀리서 까마귀 떼가 흩어지고, 성벽 틈으로 희미한 촛불 하나가 깜빡인다. 누군가 — 혹은 무언가 — 당신을 기다리고 있다.`,
  (c: Character) =>
    `안개 낀 검은 숲의 한가운데, 당신 ${c.name}은(는) 꺼져가는 모닥불 곁에서 눈을 뜬다. 품 안의 낡은 지도에는 핏빛 잉크로 표시된 한 지점이 있다. 나뭇가지 밟는 소리가 가까워진다. ${c.klass}의 직감이 속삭인다 — 혼자가 아니다.`,
  (c: Character) =>
    `황금빛 등불이 늘어선 지하 주점. ${c.race}답게 시선을 끄는 당신, ${c.name} 앞에 후드를 깊게 눌러쓴 자가 금화 한 닢을 탁자에 굴린다. "잿빛 왕관을 찾는다지." 그가 낮게 읊조린다. "살아 돌아온 자는 없네만."`,
];

const ROLL_FLAVORS_SUCCESS = [
  "당신의 손끝이 정확히 움직인다.",
  "운명이 잠시 당신 편에 선다.",
  "노련함이 위기를 비껴간다.",
  "심장이 한 박자 늦게 뛴다 — 해냈다.",
];

const ROLL_FLAVORS_FAIL = [
  "한순간의 망설임이 대가를 부른다.",
  "어둠은 당신의 실수를 놓치지 않는다.",
  "발밑의 돌이 배신하듯 흔들린다.",
  "차가운 직감이 너무 늦게 찾아온다.",
];

const CONTINUATIONS = [
  "복도 끝에서 쇠사슬 끌리는 소리가 메아리친다. 벽에 새겨진 오래된 룬이 희미하게 붉은빛을 머금는다.",
  "발치에 떨어진 낡은 은화 하나가 눈에 들어온다. 그 너머, 반쯤 열린 철문이 신음하듯 삐걱인다.",
  "공기 속에 비릿한 쇠 냄새가 짙어진다. 그림자 하나가 기둥 뒤로 스르륵 사라진다.",
  "천장에서 먼지가 쏟아진다. 무언가 거대한 것이 위층을 가로질러 움직이고 있다.",
  "촛불이 일제히 한 방향으로 휘청인다. 보이지 않는 바람이 당신의 이름을 부르는 것 같다.",
];

const PROMPTS = [
  "무엇을 하시겠습니까?",
  "어떻게 움직이시겠습니까?",
  "당신의 선택은?",
  "이제 어떻게 하시겠습니까?",
];

function buildOpening(c: Character): string {
  return `${pick(OPENINGS)(c)}\n\n${pick(PROMPTS)}`;
}

function buildActionResponse(c: Character, action: string): string {
  const roll = d(20);
  const success = roll >= 11;
  const flavor = success ? pick(ROLL_FLAVORS_SUCCESS) : pick(ROLL_FLAVORS_FAIL);
  const trimmed = action.length > 40 ? action.slice(0, 40) + "…" : action;

  return [
    `🎲 판정 (d20) — ${roll}, ${success ? "성공" : "실패"}.`,
    `당신은 "${trimmed}"(으)로 움직인다. ${flavor}`,
    pick(CONTINUATIONS),
    pick(PROMPTS),
  ].join("\n\n");
}

export function generateMockGm(
  character: Character,
  messages: ChatMessage[]
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const isOpening =
    messages.filter((m) => m.role === "assistant").length === 0 ||
    (lastUser?.content.includes("도입부") ?? false);

  if (isOpening) return buildOpening(character);
  return buildActionResponse(character, lastUser?.content ?? "주위를 살핀다");
}
