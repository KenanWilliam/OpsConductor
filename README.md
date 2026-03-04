<p align="center">
  <img src="logos/primary/opsconductor-primary.svg" alt="OpsConductor" width="320" />
</p>

<h3 align="center">The command center for AI agent orchestration</h3>

<p align="center">
  Your agents run. You stay in control.<br />
  Monitor, approve, and orchestrate AI agents across Gmail, HubSpot, Stripe, Slack, and more — from a single cockpit.
</p>

<p align="center">
  <a href="https://opsconductor.kenanwilliam.dev">Live Site</a> ·
  <a href="https://opsconductor.kenanwilliam.dev/demo">Demo</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#architecture">Architecture</a>
</p>

---

## Overview

OpsConductor is a full-stack SaaS platform that provides a **control layer** for AI-powered business operations. It acts as a central cockpit where operators can deploy AI agents, set approval guardrails, monitor real-time activity, and track cost across every action — without losing visibility or control.

### Key Features

- **AI Command Center** — Real-time dashboard showing every agent, action, cost, and status
- **Smart Approvals** — Risk-based approval policies per agent (auto-execute low-risk, flag high-risk for review)
- **Full Audit Trail** — Every action with reasoning logs, timestamps, and per-action cost tracking
- **Live Activity Feed** — Real-time stream of agent actions across all connected integrations
- **16+ Integrations** — Gmail, HubSpot, Stripe, Slack, Notion, Clearbit, and more via OAuth
- **Cost Intelligence** — Per-agent and per-action spend tracking with budget alerts
- **Command Palette** — Keyboard-first navigation (`⌘K`) for power users
- **Dark & Light Mode** — Full theme support with design-token-driven styling
- **Interactive Demo** — Fully explorable product demo with simulated data (no sign-up required)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | TypeScript 5.7 |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + CSS custom properties design tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (New York style) + [Radix Primitives](https://www.radix-ui.com/) |
| **Auth & Database** | [Supabase](https://supabase.com/) (Auth, Postgres, Row-Level Security) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |
| **Typography** | Bricolage Grotesque (display) + IBM Plex Mono (data) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Supabase** project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/OpsConductor.git
cd OpsConductor
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project dashboard under **Settings → API**.

### 4. Set up the database

Run the migration script in the Supabase SQL Editor:

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of [`supabase/migration.sql`](supabase/migration.sql)
3. Click **Run**

This will create all tables, enable Row-Level Security, set up the auto-provisioning trigger (workspace + profile on sign-up), and seed demo data.

### 5. Start the development server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 6. Build for production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
OpsConductor/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, theme, analytics)
│   ├── page.tsx                # Marketing landing page
│   ├── globals.css             # Design tokens, animations, utilities
│   ├── (app)/                  # Authenticated app shell (sidebar + command palette)
│   │   ├── layout.tsx          # App layout with sidebar and top bar
│   │   ├── cockpit/            # Main dashboard
│   │   ├── agents/             # Agent management + detail views
│   │   │   └── [id]/           # Individual agent page
│   │   ├── approvals/          # Approval queue
│   │   ├── activity/           # Activity log
│   │   ├── integrations/       # Connected apps
│   │   ├── workflows/          # Workflow builder
│   │   └── settings/           # Workspace settings
│   ├── api/                    # API routes
│   │   ├── cron/keepalive/     # Vercel cron to keep Supabase active
│   │   └── workspace/provision/# Workspace provisioning endpoint
│   ├── auth/callback/          # Supabase OAuth callback handler
│   ├── demo/                   # Interactive product demo
│   ├── login/                  # Login page
│   └── signup/                 # Sign-up page
├── components/                 # Shared components
│   ├── ui/                     # shadcn/ui primitives (40+ components)
│   ├── app-sidebar.tsx         # Main navigation sidebar
│   ├── command-palette.tsx     # ⌘K command palette
│   ├── cockpit-stats.tsx       # Dashboard stat cards
│   ├── activity-feed.tsx       # Real-time activity stream
│   ├── agent-status-panel.tsx  # Agent status overview
│   ├── approval-preview.tsx    # Pending approval cards
│   ├── notification-bell.tsx   # Notification drawer
│   └── theme-provider.tsx      # Dark/light mode provider
├── lib/                        # Utilities
│   ├── utils.ts                # cn() helper, misc utilities
│   ├── mock-data.ts            # Type-safe mock data for demo/dev
│   └── supabase/               # Supabase client helpers
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client (RSC/Route Handlers)
│       └── hooks.ts            # React hooks for Supabase
├── hooks/                      # Custom React hooks
├── middleware.ts                # Auth middleware (route protection)
├── supabase/
│   └── migration.sql           # Full database schema + RLS + seed data
├── logos/                      # Brand assets (SVG)
├── public/                     # Static assets
└── vercel.json                 # Vercel cron configuration
```

---

## Architecture

### Authentication Flow

```
Sign Up → Supabase Auth → handle_new_user() trigger
  ├── Creates profile (public.profiles)
  ├── Creates workspace (public.workspaces)
  └── Links user as owner (public.workspace_members)
```

Auth is handled entirely via Supabase with server-side cookie management. The Next.js [middleware](middleware.ts) protects all `/cockpit`, `/agents`, `/approvals`, and other app routes, redirecting unauthenticated users to `/login`.

### Database Schema

| Table | Purpose |
|---|---|
| `workspaces` | Multi-tenant workspace container |
| `profiles` | User profile (1:1 with `auth.users`) |
| `workspace_members` | User ↔ workspace membership with roles |
| `agents` | AI agent configuration and runtime stats |
| `activity_events` | Historical log of all agent actions |
| `approvals` | Pending and resolved approval requests |
| `notifications` | Per-user notification inbox |

All tables are protected by **Row-Level Security (RLS)** policies scoped to the user's workspace via the `my_workspace_id()` helper function.

### Design System

OpsConductor uses a custom design token system defined in [`app/globals.css`](app/globals.css):

- **Palette**: Deep Navy backgrounds + Signal Amber accent
- **Surfaces**: 4-tier elevation (`bg-base` → `surface-1` → `surface-2` → `surface-3`)
- **Typography**: Bricolage Grotesque for headings, IBM Plex Mono for data/labels
- **Light mode**: Full alternate token set under `:root.light`
- **Animations**: Scroll-reveal, parallax (lerp-smoothed), word-by-word hero animation, stacking card transitions

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Create optimized production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public API key |

---

## Deployment

The project is configured for **Vercel** out of the box:

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

The [`vercel.json`](vercel.json) configures a daily cron job (`/api/cron/keepalive`) to keep the Supabase database active on the free tier.

---

## License

This project is private and proprietary. All rights reserved.
