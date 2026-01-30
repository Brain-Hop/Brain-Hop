# 🧠 Brain Hop - AI Chat Interface

![Banner](https://via.placeholder.com/1200x350/09090b/FFFFFF?text=Brain+Hop+Frontend)

> **A Next-Gen Chat Interface for seamless interaction with multiple AI models.**
> *Merge conversations, switch models instantly, and manage your AI workflows with style.*

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Rapid_Builds-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## 📖 Table of Contents
- [🧐 What is Brain Hop?](#-what-is-brain-hop)
- [✨ Key Features](#-key-features)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Development](#-development)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
- [🤝 Contributing](#-contributing)

---

## 🧐 What is Brain Hop?

**Brain Hop** is more than just a chat UI. It's a **workspace** designed for power users who interact with large language models (LLMs). 

Unlike standard chat interfaces, Brain Hop allows you to:
1.  **Aggregate** different AI providers (OpenAI, Anthropic, OpenRouter) into one UI.
2.  **Contextualize** your work by allowing you to **merge separate chat sessions** into a single history—perfect for combining research from different threads.
3.  **Persist** your knowledge base with vector-backed storage integration.

---

## ✨ Key Features

### 🔄 Multi-Model Switching
Instantly toggle between models like `GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro`, and open-source models via OpenRouter. No page reloads required.

### 🧬 Chat Merging
The standout feature. Select two or more conversations and **merge them**. The backend vector store combines their context, allowing you to ask questions across multiple previous discussions.

### 🎨 Modern & Responsive
Built with **Shadcn UI** and **Tailwind CSS**, offering:
- Dark/Light Mode toggle.
- Mobile-responsive sidebar and chat window.
- Smooth animations (Framer Motion).

### 🏷️ Smart Snippets
Highlight any text in a response and save it as a "Snippet" for quick reference later.

---

## 🚀 Getting Started

Follow these steps to get the frontend running locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9+) or bun

### 1️⃣ Installation

```bash
# Clone the repository
git clone https://github.com/Brain-Hop/Brain-Hop

# Navigate to the project folder
cd Brain-Hop

# Install dependencies
npm install
```

### 2️⃣ Environment Setup

Create a `.env` file in the root directory. You can use `.env.example` as a template.

```properties
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001 # Points to your local backend
```

### 3️⃣ Run Development Server

```bash
npm run dev
```
> The app will start at `http://localhost:8080` (by default).

---

## 🛠️ Development

### Project Structure

```bash
src/
├── components/       # react components (atomic design)
│   ├── ui/           # shadcn reusable atoms
│   ├── chat/         # chat-specific components
│   └── layout/       # navbar, sidebar, etc.
├── data/             # static data (models.ts)
├── hooks/            # custom hooks (useChat, useTheme)
├── lib/              # utilities (api client, formatting)
├── pages/            # route views
└── types/            # typescript definitions
```

### Testing

We use **Vitest** for fast unit and component testing.

| Command | Description |
| :--- | :--- |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open graphical test runner |

**Key Test Files:**
- `src/data/models.test.ts`: Validates model configuration.
- `src/App.test.tsx`: Smoke test for the main app.

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
