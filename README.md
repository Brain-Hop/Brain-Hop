# 🧠 Brain Hop - AI Chat Interface

> **A Next-Gen Chat Interface for seamless interaction with multiple AI models.**
> *Merge conversations, switch models dynamically, and manage your AI workflows with contextual RAG memory.*

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Rapid_Builds-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## 📚 Frontend Architecture & System Design

For deep architectural patterns, component hierarchies, state flows, and sync engines, check out:
* 📄 **[Frontend Architecture & Design Document](docs/FRONTEND_ARCHITECTURE.md)** — In-depth breakdown of multi-account session isolation, visibility-based keepalive sync, and deletion lifecycles.
* 📄 **[Backend Architecture & Design Document](../Brain-Hop-API/docs/SYSTEM_ARCHITECTURE.md)** — High-level RAG pipeline, pgvector schema, and API reference.

---

## ✨ Key Features

### 🔄 Multi-Model Switching & Resilience
Instantly switch between verified free-tier models (MiniMax M2.7, LiquidAI LFM 2.5, Ling 3.0 Flash, Nemotron 3.5 Lightning, Gemma 4, GLM 5.2) and premium models. The backend automatically handles fallback if any provider model is temporarily unavailable.

### 🧬 Semantic Chat Merging
Select two or more conversations and **merge them**. The backend combines their context and re-indexes their memory in pgvector, allowing you to ask questions across multiple discussions.

### 🔒 Multi-Account Session Isolation
All local storage items, pending sync queues, and profile configurations are strictly scoped per authenticated user (`brain_hop_chat_state_<uid>` and `supabase_chats_pending_sync_<uid>`). Logging out or switching accounts cleanly clears active memory without leaking chats across users.

### 🗑️ Complete Chat & Memory Deletion
- **Individual Chat Deletion**: Dedicated trash button on each conversation row in the sidebar to delete both local and Supabase records.
- **Clear All Chats**: One-click bulk deletion button to purge all chat logs, memory embeddings, and attachments.

### 🏷️ Smart Snippets & Image Context
Highlight text from any response to save it as a quick snippet, or attach images to enrich your chat's semantic retrieval.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
* Node.js (v20 or higher)
* npm (v9+)

### 2. Installation

```bash
# Navigate to the project directory
cd Brain-Hop

# Install dependencies
npm install
```

### 3. Environment Setup

Create `.env` in the root of `Brain-Hop`:

```properties
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```
> Open `http://localhost:5173` (or `http://localhost:8080`) in your browser.

---

## 🛠️ Project Structure

```bash
src/
├── components/       # UI atoms, landing sections, navbar, and floating menus
│   ├── ui/           # Shadcn UI primitives (Button, Select, Dialog, etc.)
│   ├── landing/      # Landing page components
│   ├── Navbar.tsx    # App navigation and auth actions
│   └── ThemeToggle.tsx # Light/dark mode switcher
├── context/
│   └── AuthContext.tsx # Supabase OAuth and session state management
├── data/
│   └── models.ts     # Curated model list, active free models, and metadata
├── hooks/            # Custom React hooks (useToast, etc.)
├── lib/              # Styling and helper utilities (cn)
├── pages/            # Views (Chat, Profile, Models, Login, Landing)
└── utils/
    ├── chatSync.ts   # User-scoped sync and Supabase remote fetchers
    └── supabase.ts   # Supabase client initialization
```

---

## 🧪 Quality & Type Checking

```bash
# Type check with TypeScript compiler
npx tsc --noEmit

# Production build
npm run build
```
