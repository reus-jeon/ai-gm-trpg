export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type AbilityScores = Record<AbilityKey, number>;

export interface Character {
  name: string;
  race: string;
  klass: string;
  abilities: AbilityScores;
  hp: number;
  rolledAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GameSession {
  roomCode: string;
  character: Character;
  messages: ChatMessage[];
}

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  STR: "힘",
  DEX: "민첩",
  CON: "체력",
  INT: "지능",
  WIS: "지혜",
  CHA: "매력",
};

export const RACES = ["인간", "엘프", "드워프", "하플링", "오크"] as const;
export const CLASSES = ["전사", "도적", "마법사", "성직자", "음유시인"] as const;
