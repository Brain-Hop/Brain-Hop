// src/data/models.ts

export type IconKey = "brain" | "zap" | "bot" | "sparkles";

export type ModelInfo = {
  id: string;          // use the slug your API expects
  name: string;        // display name
  description: string; // short description
  badge: string;       // small tag (e.g., "General", "Reasoning", "Fast")
  features: string[];  // bullet points
  icon: IconKey;       // which icon to show in UI
};

export const MODELS: ModelInfo[] = [
  // 1–10
  {
    id: "openrouter-polaris-alpha",
    name: "Polaris Alpha  ",
    description:
      "Cloaked community model; strong generalist with standout coding, tool use, and instruction following. Prompts/completions logged by provider.",
    badge: "General",
    icon: "bot",
    features: ["Context: 256K", "Price:  ", "Provider: OpenRouter"],
  },
  {
    id: "nvidia-nemotron-nano-12b-2-vl",
    name: "NVIDIA: Nemotron Nano 12B 2 VL  ",
    description:
      "12B multimodal (video/doc) model; hybrid Transformer-Mamba; OCR, chart reasoning, multi-image docs.",
    badge: "Multimodal",
    icon: "sparkles",
    features: ["Context: 128K", "Price:  ", "Provider: NVIDIA"],
  },
  {
    id: "minimax-m2",
    name: "MiniMax: MiniMax M2  ",
    description:
      "Compact, high-efficiency LLM for end-to-end coding & agentic workflows; 10B active (230B total).",
    badge: "Agentic",
    icon: "zap",
    features: ["Context: 197K", "Price:  ", "Provider: MiniMax"],
  },
  {
    id: "tongyi-deepresearch-30b-a3b",
    name: "Tongyi DeepResearch 30B A3B  ",
    description:
      "Agentic LLM optimized for deep information seeking and long-horizon problem solving.",
    badge: "Research",
    icon: "brain",
    features: ["Context: 131K", "Price:  ", "Provider: Alibaba"],
  },
  {
    id: "meituan-longcat-flash-chat",
    name: "Meituan: LongCat Flash Chat  ",
    description:
      "MoE (560B total / 27B active) for conversational & agentic tasks; deterministic compute; strong tool use.",
    badge: "MoE",
    icon: "zap",
    features: ["Context: 131K", "Price:  ", "Provider: Meituan"],
  },
  {
    id: "nvidia-nemotron-nano-9b-v2",
    name: "NVIDIA: Nemotron Nano 9B V2  ",
    description:
      "Unified reasoning/non-reasoning; emits trace + final response.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 128K", "Price:  ", "Provider: NVIDIA"],
  },
  {
    id: "deepseek-v3-1",
    name: "DeepSeek: DeepSeek V3.1  ",
    description:
      "Hybrid reasoning model (671B total / 37B active); supports 'thinking' and 'non-thinking' modes.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 164K", "Price:  ", "Provider: DeepSeek"],
  },
  {
    id: "openai-gpt-oss-20b",
    name: "OpenAI: gpt-oss-20b  ",
    description:
      "21B open-weight MoE (3.6B active); low-latency; function calling; agentic code tasks.",
    badge: "Open-weight",
    icon: "bot",
    features: ["Context: 131K", "Price:  ", "Provider: OpenAI"],
  },
  {
    id: "zai-glm-4-5-air",
    name: "Z.AI: GLM 4.5 Air  ",
    description:
      "Lightweight MoE; agent-centric; configurable ‘thinking’ vs real-time modes.",
    badge: "MoE",
    icon: "zap",
    features: ["Context: 131K", "Price:  ", "Provider: Z.AI"],
  },
  {
    id: "qwen3-coder-480b-a35b",
    name: "Qwen: Qwen3 Coder 480B A35B  ",
    description:
      "MoE coder for agentic code gen; 480B total / 35B active; long-context reasoning & tools.",
    badge: "Coding",
    icon: "zap",
    features: ["Context: 262K", "Price:  ", "Provider: Qwen"],
  },

  // 11–20
  {
    id: "qwen2-72b-instruct",
    name: "Qwen2-72B-Instruct  ",
    description:
      "Large 72B instruction model; reasoning, code, agentic tasks.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 128K", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "mixtral-8x22b-instruct",
    name: "Mixtral-8x22B-Instruct  ",
    description:
      "176B MoE (22B active); high throughput; excels at code and tools.",
    badge: "MoE",
    icon: "zap",
    features: ["Context: 64K", "Price:  ", "Provider: Mistral"],
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku  ",
    description:
      "Efficient Claude for fast inference and multi-step logic.",
    badge: "Fast",
    icon: "brain",
    features: ["Context: 100K", "Price:  ", "Provider: Anthropic"],
  },
  {
    id: "gemini-flash-1-5",
    name: "Gemini Flash 1.5  ",
    description:
      "Low-latency hybrid architecture; strong programming & long-context workflows.",
    badge: "Multimodal",
    icon: "sparkles",
    features: ["Context: 1M", "Price:  ", "Provider: Google"],
  },
  {
    id: "llama-3-70b-instruct",
    name: "Llama-3-70B-Instruct  ",
    description:
      "Meta’s 70B instruction model; reasoning, code & search.",
    badge: "General",
    icon: "bot",
    features: ["Context: 128K", "Price:  ", "Provider: Meta"],
  },
  {
    id: "gpt-3-5-turbo",
    name: "GPT-3.5 Turbo  ",
    description:
      "Popular OpenAI chat/coding model; quick responses; tools & reasoning.",
    badge: "Fast",
    icon: "zap",
    features: ["Context: 16K", "Price:  ", "Provider: OpenAI"],
  },
  {
    id: "qwen2-7b-instruct",
    name: "Qwen2-7B-Instruct  ",
    description:
      "Smaller, efficient variant for low-latency tasks.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 128K", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "mistral-7b-instruct",
    name: "Mistral-7B-Instruct  ",
    description:
      "Small, fast instruction model for agents, code, tools.",
    badge: "Fast",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Mistral"],
  },
  {
    id: "command-r",
    name: "Command-R  ",
    description:
      "Cohere’s agentic reasoning model; multi-step tasks & tool use.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 128K", "Price:  ", "Provider: Cohere"],
  },
  {
    id: "zephyr-7b-beta",
    name: "Zephyr-7B-Beta  ",
    description:
      "Experimental agent-focused model tuned for chat & code.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Hugging Face"],
  },

  // 21–30
  {
    id: "gemini-1-5-pro",
    name: "Google Gemini 1.5 Pro  ",
    description:
      "Advanced multimodal model for research, code, tools, multi-image input.",
    badge: "Multimodal",
    icon: "sparkles",
    features: ["Context: 1M", "Price:  ", "Provider: Google"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet  ",
    description:
      "Claude’s premium agent model; code, multi-image, multi-step reasoning.",
    badge: "General",
    icon: "brain",
    features: ["Context: 200K", "Price:  ", "Provider: Anthropic"],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o  ",
    description:
      "OpenAI’s fast multimodal model; leading code/text/reasoning.",
    badge: "Multimodal",
    icon: "sparkles",
    features: ["Context: 128K", "Price:  ", "Provider: OpenAI"],
  },
  {
    id: "gemini-1-0-pro",
    name: "Gemini 1.0 Pro  ",
    description:
      "First-gen Gemini Pro; efficient agent-enabled; code & tools.",
    badge: "General",
    icon: "sparkles",
    features: ["Context: 128K", "Price:  ", "Provider: Google"],
  },
  {
    id: "mixtral-8x7b-instruct",
    name: "Mixtral-8x7B-Instruct  ",
    description:
      "Early open MoE; reasoning & coding with tool mixtures.",
    badge: "MoE",
    icon: "zap",
    features: ["Context: 64K", "Price:  ", "Provider: Mistral"],
  },
  {
    id: "qwen1-5-32b-chat",
    name: "Qwen1.5-32B-Chat  ",
    description:
      "Agentic chatbot with deep reasoning, code & search.",
    badge: "General",
    icon: "brain",
    features: ["Context: 128K", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "command-light",
    name: "Command-Light  ",
    description:
      "Lightweight Cohere model for quick agent tasks, research, coding.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 128K", "Price:  ", "Provider: Cohere"],
  },
  {
    id: "llama-3-8b-instruct",
    name: "Llama-3-8B-Instruct  ",
    description:
      "Lightweight Llama; fast context & coding.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 128K", "Price:  ", "Provider: Meta"],
  },
  {
    id: "gpt-3-5",
    name: "GPT-3.5  ",
    description:
      "Standard OpenAI model for agents, chat, research, coding.",
    badge: "General",
    icon: "bot",
    features: ["Context: 16K", "Price:  ", "Provider: OpenAI"],
  },
  {
    id: "qwen1-5-7b-chat",
    name: "Qwen1.5-7B-Chat  ",
    description:
      "Small agentic chatbot for multi-step reasoning & light tools.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 128K", "Price:  ", "Provider: Qwen"],
  },

  // 31–40
  {
    id: "dbrx-instruct",
    name: "dbrx-instruct  ",
    description:
      "Databricks MoE (132B total / 36B active); frontier language benchmarks.",
    badge: "MoE",
    icon: "brain",
    features: ["Context: 32K", "Price:  ", "Provider: Databricks"],
  },
  {
    id: "stablelm-zephyr-3b",
    name: "stablelm-zephyr-3b  ",
    description:
      "Efficient small agent model for low-latency chat, code & reasoning.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Stability AI"],
  },
  {
    id: "phi-3-mini-4k-instruct",
    name: "phi-3-mini-4k-instruct  ",
    description:
      "Small LLM for speed; multilingual; tools; code; research chat.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 4K", "Price:  ", "Provider: Microsoft"],
  },
  {
    id: "neural-chat-7b",
    name: "neural-chat-7b  ",
    description:
      "Versatile 7B tuned for conversational agents; multilingual.",
    badge: "General",
    icon: "bot",
    features: ["Context: 32K", "Price:  ", "Provider: Intel"],
  },
  {
    id: "codeqwen1-5-7b",
    name: "codeqwen1.5-7b  ",
    description:
      "Specialized 7B for code generation, tools & agentic workflows.",
    badge: "Coding",
    icon: "zap",
    features: ["Context: 128K", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "llama-2-70b-chat",
    name: "llama-2-70b-chat  ",
    description:
      "Large open chat model; instruction & roleplay; code/support.",
    badge: "General",
    icon: "bot",
    features: ["Context: 32K", "Price:  ", "Provider: Meta"],
  },
  {
    id: "gpt-3-5-turbo-16k",
    name: "gpt-3.5-turbo-16k  ",
    description:
      "OpenAI 16K context chat/coder with function calling.",
    badge: "Fast",
    icon: "zap",
    features: ["Context: 16K", "Price:  ", "Provider: OpenAI"],
  },
  {
    id: "starling-lm-7b-beta",
    name: "starling-lm-7b-beta  ",
    description:
      "7B beta model for agentic chat/coding; efficient tools.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Hugging Face"],
  },
  {
    id: "wizardlm-2-7b",
    name: "wizardlm-2-7b  ",
    description:
      "Compact wizard-style instruction; agentic code; multi-turn.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: WizardLM"],
  },
  {
    id: "gemma-7b-it",
    name: "gemma-7b-it  ",
    description:
      "Google intention-tuned 7B; robust code & chat iteration.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Google"],
  },

  // 41–46 + the 6 you listed separately (kept at the end)
  {
    id: "solar-10-7b-instruct",
    name: "solar-10.7b-instruct  ",
    description:
      "10.7B tuned for agentic reasoning, tool use, and code.",
    badge: "General",
    icon: "brain",
    features: ["Context: 32K", "Price:  ", "Provider: Upstage"],
  },
  {
    id: "openchat-8b",
    name: "openchat-8b  ",
    description:
      "Open 8B for code, chat, research, instruction workflows.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: OpenChat"],
  },
  {
    id: "stable-code-3b",
    name: "stable-code-3b  ",
    description:
      "Open-weight 3B for multi-turn code, research, instruction.",
    badge: "Coding",
    icon: "zap",
    features: ["Context: 32K", "Price:  ", "Provider: Stability AI"],
  },
  {
    id: "tinyllama-1-1b",
    name: "tinyllama-1.1b  ",
    description:
      "Tiny 1.1B for rapid prototyping, code samples, simple dialogues.",
    badge: "Tiny",
    icon: "zap",
    features: ["Context: 8K", "Price:  ", "Provider: TinyLlama"],
  },
  {
    id: "mpt-7b-instruct",
    name: "mpt-7b-instruct  ",
    description:
      "Open tuning of MPT-7B for chat, coding, agentic tasks.",
    badge: "General",
    icon: "bot",
    features: ["Context: 8K", "Price:  ", "Provider: MosaicML"],
  },
  {
    id: "platypus2-70b-instruct",
    name: "platypus2-70b-instruct  ",
    description:
      "70B instruction-following model with robust code/reasoning.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 32K", "Price:  ", "Provider: Platypus"],
  },

  // The 6 you listed “for ease” (kept too, if you want them visible separately)
  {
    id: "gemini-2-0-flash-experimental",
    name: "Google: Gemini 2.0 Flash Experimental  ",
    description:
      "Faster TTFT than Flash 1.5; stronger multimodal understanding, coding, complex instructions, function calling.",
    badge: "Multimodal",
    icon: "sparkles",
    features: ["Context: 1.05M", "Tokens: 3.11B", "Price:  ", "Provider: Google"],
  },
  {
    id: "llama-3-3-70b-instruct",
    name: "Meta: Llama 3.3 70B Instruct  ",
    description:
      "Multilingual text-only instruction model optimized for dialogue.",
    badge: "General",
    icon: "bot",
    features: ["Context: 131K", "Tokens: 2.64B", "Price:  ", "Provider: Meta"],
  },
  {
    id: "qwen-2-5-coder-32b-instruct",
    name: "Qwen2.5 Coder 32B Instruct  ",
    description:
      "Code-specific Qwen with improved code gen/reasoning/fixing.",
    badge: "Coding",
    icon: "zap",
    features: ["Context: 33K", "Tokens: 212M", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "llama-3-2-3b-instruct",
    name: "Meta: Llama 3.2 3B Instruct  ",
    description:
      "Compact multilingual model for dialogue, reasoning, summarization, tools.",
    badge: "Light",
    icon: "zap",
    features: ["Context: 131K", "Tokens: 73M", "Price:  ", "Provider: Meta"],
  },
  {
    id: "qwen-2-5-72b-instruct",
    name: "Qwen2.5 72B Instruct  ",
    description:
      "Better instruction following, long text, JSON outputs; multilingual.",
    badge: "Reasoning",
    icon: "brain",
    features: ["Context: 33K", "Tokens: 218M", "Price:  ", "Provider: Qwen"],
  },
  {
    id: "nous-hermes-3-405b-instruct",
    name: "Nous: Hermes 3 405B Instruct  ",
    description:
      "Frontier-level finetune of Llama-3.1 405B; stronger agentic, roleplay, reasoning, code.",
    badge: "General",
    icon: "bot",
    features: ["Context: 131K", "Tokens: 541M", "Price:  ", "Provider: NousResearch"],
  },
];

// ---- helpers ----
export const DEFAULT_MODEL_ID = MODELS[0]?.id ?? "openrouter-polaris-alpha";

export function findModel(id: string | null | undefined): ModelInfo | undefined {
  if (!id) return undefined;
  return MODELS.find(m => m.id === id);
}

const STORAGE_KEY = "selectedModelId";

export function saveSelectedModel(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}

export function loadSelectedModelId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
