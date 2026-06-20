import type { GameSession } from "./types";

const KEY = "ai-gm-trpg-session";

export function saveSession(session: GameSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* localStorage 사용 불가 시 무시 (세션 메모리로만 동작) */
  }
}

export function loadSession(): GameSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameSession) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}

export function makeRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
