"use client";

import { useEffect, useRef, useState } from "react";
import {
  ABILITY_LABELS,
  AbilityKey,
  CLASSES,
  Character,
  ChatMessage,
  GameSession,
  RACES,
} from "@/lib/types";
import {
  abilityModifier,
  rollCharacterAbilities,
  startingHp,
} from "@/lib/dice";
import {
  clearSession,
  loadSession,
  makeRoomCode,
  saveSession,
} from "@/lib/storage";

type Screen = "lobby" | "create" | "play";
const ABILITY_ORDER: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export default function Page() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [roomCode, setRoomCode] = useState("");
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 새로고침 시 저장된 세션 복구
  useEffect(() => {
    const s = loadSession();
    if (s?.character && s.messages?.length) {
      setRoomCode(s.roomCode);
      setCharacter(s.character);
      setMessages(s.messages);
      setScreen("play");
    }
  }, []);

  function persist(next: Partial<GameSession>) {
    const session: GameSession = {
      roomCode: next.roomCode ?? roomCode,
      character: (next.character ?? character)!,
      messages: next.messages ?? messages,
    };
    if (session.character) saveSession(session);
  }

  function handleEnterCreate(code: string) {
    setRoomCode(code);
    setScreen("create");
  }

  function handleStartGame(c: Character) {
    setCharacter(c);
    setMessages([]);
    setScreen("play");
    persist({ character: c, messages: [] });
  }

  function handleLeave() {
    clearSession();
    setCharacter(null);
    setMessages([]);
    setRoomCode("");
    setScreen("lobby");
  }

  return (
    <div className="app">
      <BrandHeader onHome={() => setScreen("lobby")} />
      {screen === "lobby" && <Lobby onEnter={handleEnterCreate} />}
      {screen === "create" && (
        <CreateCharacter roomCode={roomCode} onStart={handleStartGame} />
      )}
      {screen === "play" && character && (
        <Play
          roomCode={roomCode}
          character={character}
          messages={messages}
          setMessages={(m) => {
            setMessages(m);
            persist({ messages: m });
          }}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}

/* --------------------- Brand header --------------------- */
function BrandHeader({ onHome }: { onHome: () => void }) {
  return (
    <button className="brandbar" onClick={onHome} aria-label="홈으로 이동" title="홈으로">
      <span className="brandbar-crown" aria-hidden="true">
        ♛
      </span>
      <span className="brandbar-word">잿빛 왕관</span>
    </button>
  );
}

/* ------------------------- Lobby ------------------------- */
function Lobby({ onEnter }: { onEnter: (code: string) => void }) {
  const [joinCode, setJoinCode] = useState("");

  return (
    <>
      <div className="title">
        <h1>잿빛 왕관</h1>
        <div className="sub">— Ashen Crown · AI Game Master —</div>
      </div>

      <div className="panel">
        <p className="muted center">
          AI가 게임마스터를 맡는 어두운 판타지 TRPG. <br />
          방을 만들어 모험을 시작하거나, 친구의 입장 코드로 합류하세요.
        </p>
        <div className="divider" />

        <button className="btn block" onClick={() => onEnter(makeRoomCode())}>
          ⚔︎ 새 방 만들기
        </button>

        <div className="divider" />

        <div className="field">
          <label>입장 코드로 합류</label>
          <div className="row">
            <input
              placeholder="예: K7P2QX"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <button
              className="btn ghost"
              style={{ flex: "0 0 auto" }}
              disabled={joinCode.trim().length < 4}
              onClick={() => onEnter(joinCode.trim())}
            >
              합류하기
            </button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            * MVP는 싱글플레이입니다. 실시간 멀티플레이는 다음 단계(Supabase
            Realtime)에서 추가됩니다.
          </p>
        </div>
      </div>
    </>
  );
}

/* ------------------- Character creation ------------------- */
function CreateCharacter({
  roomCode,
  onStart,
}: {
  roomCode: string;
  onStart: (c: Character) => void;
}) {
  const [name, setName] = useState("");
  const [race, setRace] = useState<string>(RACES[0]);
  const [klass, setKlass] = useState<string>(CLASSES[0]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [rolling, setRolling] = useState(false);

  function roll() {
    setRolling(true);
    // 굴리는 연출용 짧은 지연
    setTimeout(() => {
      const abilities = rollCharacterAbilities(race, klass);
      const hp = startingHp(klass, abilities);
      setCharacter({
        name: name.trim() || "이름 없는 방랑자",
        race,
        klass,
        abilities,
        hp,
        rolledAt: Date.now(),
      });
      setRolling(false);
    }, 450);
  }

  return (
    <>
      <div className="title">
        <h1 style={{ fontSize: "2.1rem" }}>캐릭터 생성</h1>
        <div className="sub">
          방 코드 <span className="code-badge">{roomCode}</span>
        </div>
      </div>

      <div className="panel">
        <div className="field">
          <label>이름</label>
          <input
            placeholder="당신의 영웅 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="field">
            <label>종족</label>
            <select value={race} onChange={(e) => setRace(e.target.value)}>
              {RACES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>직업</label>
            <select value={klass} onChange={(e) => setKlass(e.target.value)}>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn block" onClick={roll} disabled={rolling}>
          {rolling ? "🎲 주사위를 굴리는 중..." : "🎲 GM이 능력치 주사위 굴리기"}
        </button>

        {character && (
          <>
            <div className="divider" />
            <div className="abilities">
              {ABILITY_ORDER.map((k) => {
                const score = character.abilities[k];
                const mod = abilityModifier(score);
                const sign = mod >= 0 ? `+${mod}` : `${mod}`;
                return (
                  <div className="ability" key={k}>
                    <div className="name">
                      {ABILITY_LABELS[k]} · {k}
                    </div>
                    <div className="score">{score}</div>
                    <div className="mod">{sign}</div>
                  </div>
                );
              })}
            </div>
            <p className="muted center" style={{ marginTop: 12 }}>
              HP <strong style={{ color: "var(--gold-soft)" }}>{character.hp}</strong>{" "}
              · {character.race} {character.klass}
            </p>
            <button
              className="btn block"
              onClick={() => onStart(character)}
              style={{ marginTop: 10 }}
            >
              ✦ 이 캐릭터로 모험 시작 ✦
            </button>
          </>
        )}
      </div>
    </>
  );
}

/* --------------------------- Play --------------------------- */
function Play({
  roomCode,
  character,
  messages,
  setMessages,
  onLeave,
}: {
  roomCode: string;
  character: Character;
  messages: ChatMessage[];
  setMessages: (m: ChatMessage[]) => void;
  onLeave: () => void;
}) {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [draft, setDraft] = useState("");
  const [demo, setDemo] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const kickedOff = useRef(false);

  // 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, draft]);

  // 첫 진입 시 GM이 도입부 장면을 묘사하도록 킥오프
  useEffect(() => {
    if (messages.length === 0 && !kickedOff.current) {
      kickedOff.current = true;
      void sendToGm([
        {
          role: "user",
          content:
            "모험을 시작합니다. 제 캐릭터에 어울리는 강렬한 도입부 장면을 묘사해 주세요.",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToGm(history: ChatMessage[]) {
    setStreaming(true);
    setDraft("");
    try {
      const res = await fetch("/api/gm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character, messages: history }),
      });

      setDemo(res.headers.get("X-GM-Mode") === "mock");

      if (!res.body) {
        const text = await res.text();
        finalize(history, text || "[응답을 받지 못했습니다.]");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setDraft(acc);
      }
      finalize(history, acc || "[응답이 비어 있습니다.]");
    } catch {
      finalize(history, "[GM과의 연결에 실패했습니다. 다시 시도해 주세요.]");
    }
  }

  function finalize(history: ChatMessage[], gmText: string) {
    const next: ChatMessage[] = [
      ...history,
      { role: "assistant", content: gmText },
    ];
    setMessages(next);
    setDraft("");
    setStreaming(false);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    void sendToGm(history);
  }

  return (
    <>
      <div className="play-header">
        <div className="who">
          {character.name}
          {demo && <span className="demo-badge">데모 모드 · 키 없음</span>}
          <small>
            {character.race} {character.klass} · HP {character.hp} · 방 {roomCode}
          </small>
        </div>
        <button className="btn ghost" onClick={onLeave}>
          나가기
        </button>
      </div>

      <div className="log">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "assistant" ? "gm" : "me"}`}>
            <div className="tag">{m.role === "assistant" ? "게임마스터" : character.name}</div>
            {m.content}
          </div>
        ))}

        {streaming && (
          <div className="msg gm">
            <div className="tag">게임마스터</div>
            <span className={draft ? "" : "cursor"}>{draft}</span>
            {draft && <span className="cursor" />}
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      <div className="composer">
        <input
          placeholder={streaming ? "GM이 이야기를 풀어내는 중..." : "무엇을 하시겠습니까?"}
          value={input}
          disabled={streaming}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="btn" onClick={handleSend} disabled={streaming || !input.trim()}>
          행동
        </button>
      </div>
    </>
  );
}
