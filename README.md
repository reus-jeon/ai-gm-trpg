# 잿빛 왕관 (Ashen Crown) — AI GM TRPG

판타지 세계관에서 **AI가 게임마스터(GM)** 를 맡아 진행하는 싱글플레이 TRPG 웹사이트입니다.
세미클래스 바이브코딩 수업 프로젝트 · Claude API 기반.

## MVP 기능

- **방 생성 / 입장 코드** — 방을 만들고 코드를 공유 (멀티 확장 대비, MVP는 싱글)
- **캐릭터 생성** — 직업·종족 선택 → 주사위(4d6)로 능력치 결정
- **채팅 기반 플레이** — 자유 텍스트로 행동을 입력
- **AI GM** — Claude API가 상황 묘사·주사위 판정·이야기 진행
- **세션 유지** — localStorage (로그인·DB 없음)

## 로컬에서 실행하기

```bash
# 1. 의존성 설치
npm install

# 2. API 키 설정 — .env.local 파일을 만들고 키를 넣으세요
cp .env.local.example .env.local
#   ANTHROPIC_API_KEY=sk-ant-...

# 3. 개발 서버 실행
npm run dev
#   http://localhost:3000
```

> Claude API 키는 https://console.anthropic.com/ 에서 발급합니다.

## 기술 스택

- **Frontend:** Next.js 14 (App Router) → Vercel 배포
- **AI:** Claude API (`claude-sonnet-4-6`), 스트리밍 응답
- **저장:** 세션 메모리 / localStorage (DB 없음)

## Vercel 배포

1. 이 프로젝트를 GitHub repo로 push
2. Vercel에서 repo를 import
3. **Environment Variables** 에 `ANTHROPIC_API_KEY` 추가
4. 배포 → 공개 URL 확인

## 다음 단계 (로드맵)

- 2단계: 멀티플레이 — 방 코드 참여 · Supabase Realtime 채팅 동기화
- 3단계: 세션 기록 DB 저장 · 인벤토리 · 전투 시스템 고도화

---

_세미클래스 · SemiClass — AI GM TRPG Project_
