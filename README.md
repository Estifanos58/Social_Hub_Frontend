# SocialHub Frontend

## Overview

SocialHub Frontend is the Next.js application that powers the client experience of the SocialHub social networking platform. It delivers a responsive, real-time interface built with the App Router, Apollo Client, GraphQL subscriptions, and a modern TailwindCSS design system. The frontend integrates tightly with the NestJS backend to support authentication, social feeds, messaging, and notifications.

---

## Key Features

- **Authentication & Routing**
	- Protected routes powered by a server-side `ProtectedRoute` component.
	- OAuth and email/password flows (login, register, reset, verify).
	- Zustand store (`useUserStore`) keeps the current user session.

- **Social Feed & Interactions**
	- Infinite, cursor-based post feed (`GET_POSTS`) with skeleton loading states.
	- Rich post composer with drag & drop uploads, Cloudinary integration, and progress tracking.
	- Dynamic reaction bar, nested comments, and emoji picker overlays.
	- Optimistic updates for in-memory comments (`useGeneralStore`).

- **Messaging**
	- Real-time chat experience using GraphQL subscriptions over WebSockets.
	- Group chatrooms, typing indicators, and conversation lists (see `src/hooks/message/*`).

- **Notifications & Suggestions**
	- Aggregated notification center with unread counts.
	- Suggested users to follow, powered by GraphQL queries.

- **Design System**
	- TailwindCSS v4 with custom components under `src/components/ui` and `src/components/custom`.
	- Radix UI primitives for accessible dialogs, popovers, avatars, and more.
	- Dark theme with `next-themes` and custom theming helpers.

- **Developer Experience**
	- GraphQL Code Generator to produce typed documents in `src/gql`.
	- Modular folder structure with domain-specific hooks, stores, and components.
	- Turbopack for faster local dev and builds.

---

## Architecture

- **Next.js 15 App Router** for server/client component composition.
- **Apollo Client** configured in `apolloClient.ts`, with split links for HTTP queries/mutations and WebSocket subscriptions.
- **GraphQL Operations** stored in `src/graphql` and compiled to typed hooks in `src/gql` via `graphql-codegen`.
- **State Management** using Zustand stores (`src/store/*`) and custom hooks for domain logic.
- **UI Layer** built from reusable components in `src/components/*`.
- **Utilities** for formatting, uploads, validation, and shared types in `src/lib` and `src/validator`.

---

## Project Structure

```
socialhub_frontend/
├─ apolloClient.ts          # Apollo client configuration
├─ codegen.ts               # GraphQL codegen configuration
├─ src/
│  ├─ app/                  # App Router layouts & pages (auth, dashboard, messaging)
│  ├─ components/           # UI primitives & feature components
│  ├─ gql/                  # Generated GraphQL artifacts
│  ├─ graphql/              # Queries, mutations, subscriptions
│  ├─ hooks/                # Domain hooks (auth, post, comment, message, user)
│  ├─ lib/                  # Shared utilities (upload, formatting, types)
│  ├─ store/                # Zustand stores
│  └─ validator/            # Zod schemas for forms
├─ public/                  # Static assets
└─ .codacy/                 # Codacy CLI configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running (see `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` environment variables)
- Cloudinary account (for post image uploads)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` (or `.env`) at the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:5000/graphql
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<preset>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
NEXT_PUBLIC_CLOUDINARY_API_KEY=<api-key>
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
```

### GraphQL Codegen

```bash
npm run codegen
```

---

## Testing & Linting

```bash
npm run lint
```

You can also rely on Codacy CLI (configured in `.codacy/`) for additional static analysis.

---

## Deployment

- Deploy on Vercel or any Next-compatible host.
- Ensure environment variables are configured in the deployment platform.
- For SSR caching and performance, consider enabling Vercel Edge or self-host with Node.js 18+.

---

## Contributing

1. Fork and clone the repository.
2. Create a feature branch.
3. Commit changes and open a pull request.

Please ensure your PR includes updated snapshots (if applicable) and documentation.

---

## License

SocialHub Frontend is released under the MIT License.
