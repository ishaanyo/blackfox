# BlackfoxAI

Real-time AI interview assistant — Next.js 16, Prisma, Neon Postgres, NextAuth.

## Setup

```bash
cp .env.example .env
# Fill DATABASE_URL, NEXTAUTH_SECRET, Google OAuth keys

npm install
npx prisma db push
npm run dev
```

## Models (Prisma)

- **User** — email/password + Google OAuth
- **Account / AuthSession / VerificationToken** — NextAuth tables
- **CallSession** — interview/call sessions owned by a user
- **Transcript** — maps to existing Neon `transcripts` table (`session_id`, `role`, `content`)
- **Resume / Document** — user knowledge base

## Auth

| Route | Purpose |
|-------|---------|
| `/login` | Email + Google sign-in |
| `/signup` | Email signup (bcrypt) then auto sign-in |
| `signOut()` | Logout (sidebar Log Out) |
| `/api/auth/[...nextauth]` | NextAuth handlers |

## Session API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sessions` | List current user’s sessions |
| POST | `/api/sessions` | Create session → shows on dashboard |
| GET/PATCH/DELETE | `/api/sessions/[id]` | Read / update status / delete |
| GET/POST | `/api/sessions/[id]/transcripts` | List / append transcript lines |

## Neon note

Your existing `transcripts` table is mapped via `@@map("transcripts")`.  
`prisma db push` will add User, Account, CallSession, etc. without dropping transcript rows if names align. Review the Prisma schema before pushing to production.

## Desktop chat proxy (security)

Desktop never holds `AICREDITS_API_KEY`. Logged-in desktop clients call:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/chat` | Bearer desktop-token (or session cookie) | Proxies to AICredits; optionally saves transcripts |

Set on the **website** host (Vercel env):

- `AICREDITS_API_KEY` — required for chat
- `AICREDITS_BASE` — optional, default `https://api.aicredits.in/v1`
- `DEFAULT_CHAT_MODEL` — optional
- `NEXTAUTH_SECRET` — already required (also signs desktop tokens)
