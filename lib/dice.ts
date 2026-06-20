import type { AbilityScores, AbilityKey } from "./types";

export function d(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** 4d6 중 가장 낮은 주사위 1개를 버리고 합산 (3~18) */
export function rollAbilityScore(): number {
  const rolls = [d(6), d(6), d(6), d(6)].sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

const RACE_BONUS: Record<string, Partial<AbilityScores>> = {
  인간: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  엘프: { DEX: 2, INT: 1 },
  드워프: { CON: 2, STR: 1 },
  하플링: { DEX: 2, CHA: 1 },
  오크: { STR: 2, CON: 1 },
};

const CLASS_BONUS: Record<string, Partial<AbilityScores>> = {
  전사: { STR: 1 },
  도적: { DEX: 1 },
  마법사: { INT: 1 },
  성직자: { WIS: 1 },
  음유시인: { CHA: 1 },
};

const KEYS: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export function rollCharacterAbilities(
  race: string,
  klass: string
): AbilityScores {
  const base = {} as AbilityScores;
  for (const k of KEYS) base[k] = rollAbilityScore();

  const apply = (bonus?: Partial<AbilityScores>) => {
    if (!bonus) return;
    for (const k of KEYS) base[k] += bonus[k] ?? 0;
  };
  apply(RACE_BONUS[race]);
  apply(CLASS_BONUS[klass]);

  return base;
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

const CLASS_HIT_DIE: Record<string, number> = {
  전사: 10,
  도적: 8,
  마법사: 6,
  성직자: 8,
  음유시인: 8,
};

export function startingHp(klass: string, abilities: AbilityScores): number {
  const die = CLASS_HIT_DIE[klass] ?? 8;
  return die + abilityModifier(abilities.CON);
}
