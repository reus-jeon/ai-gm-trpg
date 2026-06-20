# SemiClass Brand Website Progress

- Course: semiclass-brand-website-vibecoding
- Updated: 2026-06-20T08:38:28.161Z
- Overall: 63%

## Current

현재 위치: 4 / 8 - 내용/디자인
메모: 카피와 반응형 확인 필요

## Roadmap

| # | Stage | Status | Progress | Done means | Next action |
|---:|---|---|---|---|---|
| 1 | 준비 | 완료 | ██████████ | 계정, 브리프, 프로젝트 폴더가 준비됨 | 다음 단계로 이동 |
| 2 | 로컬 구현 | 완료 | ██████████ | 웹사이트 파일이 로컬 프로젝트에 존재함 | 다음 단계로 이동 |
| 3 | 미리보기 | 완료 | ██████████ | 로컬 URL이나 브라우저에서 화면을 확인함 | 다음 단계로 이동 |
| 4 | 내용/디자인 | 진행 | █████░░░░░ | 카피, 섹션, 스타일, 모바일을 1차 수정함 | 섹션 순서, 문구, 모바일 줄바꿈을 확인한다. |
| 5 | Git 저장 | 완료 | ██████████ | Git 저장소와 최소 1개 commit이 있음 | 다음 단계로 이동 |
| 6 | GitHub 연결 | 완료 | ██████████ | GitHub remote가 연결되고 push 준비가 됨 | 다음 단계로 이동 |
| 7 | Vercel 배포 | 진행 | █████░░░░░ | Vercel 프로젝트 또는 공개 URL이 있음 | Vercel에서 GitHub repo를 import하고 빌드 로그를 확인한다. |
| 8 | URL 확인 | 대기 | ░░░░░░░░░░ | 공개 URL을 데스크톱과 모바일에서 확인함 | 휴대폰에서 URL을 열고 링크와 CTA를 확인한다. |
| 9 | Supabase 다음 확장 | 잠금 | 잠금 | DB, Auth, Storage는 다음 수업 범위로 분리함 | 저장해야 할 데이터와 로그인 필요성을 메모만 한다. |

## Signals

- packageJson: true
- devScript: true
- buildScript: true
- sourceFiles: true
- gitDir: true
- gitCommit: true
- gitRemote: https://github.com/reus-jeon/ai-gm-trpg.git
- githubRemote: true
- vercelProject: false

## Agent Commands

```bash
node <skill-folder>/scripts/progress.mjs scan .
node <skill-folder>/scripts/progress.mjs set . preview done "로컬 화면 확인 완료"
node <skill-folder>/scripts/progress.mjs url . https://your-site.vercel.app
```
