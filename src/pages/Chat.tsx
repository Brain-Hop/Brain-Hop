// src/pages/Chat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus, Send, CheckSquare, Tag, X, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { MODELS, DEFAULT_MODEL_ID, loadSelectedModelId, findModel } from "@/data/models";
import { useToast } from "@/hooks/use-toast";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  model?: string;
}

interface TextSnippet {
  id: string;
  content: string;
  messageId: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const LS_KEY = "chat_state_v3";

// ====== CONSTANT USER ID (for now) ======
const USER_ID = "100";

// Safe JSON parse
function safeParse<T>(v: string | null, fallback: T): T {
  try {
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Tiny ID helper
function newId() {
  return (typeof crypto !== "undefined" && "randomUUID" in crypto && crypto.randomUUID()) || Date.now().toString();
}

export default function Chat() {
  const { isAuthenticated, loading, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // ===== Model selection (seed from models page or default) =====
  const initialModelId = useMemo(() => loadSelectedModelId() ?? DEFAULT_MODEL_ID, []);
  const [selectedModel, setSelectedModel] = useState<string>(initialModelId);

  // ===== App state (persisted) =====
  const initialChatId = useMemo(() => newId(), []);
  const [chats, setChats] = useState<Chat[]>([
    { id: initialChatId, title: "New Conversation", messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>(initialChatId);
  const [input, setInput] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selectedSnippets, setSelectedSnippets] = useState<TextSnippet[]>([]);

  const hydratedRef = useRef(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // ===== Redirect if not logged in =====
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // ===== Hydrate from localStorage =====
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const cached = safeParse<{
      chats: Chat[];
      activeChatId: string;
      selectedModel: string;
    }>(window.localStorage.getItem(LS_KEY), {
      chats: [{ id: initialChatId, title: "New Conversation", messages: [] }],
      activeChatId: initialChatId,
      selectedModel: initialModelId,
    });

    setChats(cached.chats?.length ? cached.chats : [{ id: initialChatId, title: "New Conversation", messages: [] }]);
    setActiveChatId(cached.activeChatId || initialChatId);
    setSelectedModel(cached.selectedModel || initialModelId);
  }, [initialChatId, initialModelId]);

  // ===== Persist to localStorage (fast render future) =====
  useEffect(() => {
    const snapshot = JSON.stringify({
      chats,
      activeChatId,
      selectedModel,
    });
    window.localStorage.setItem(LS_KEY, snapshot);
  }, [chats, activeChatId, selectedModel]);

  // ===== Keep local selected model synced if user changes it elsewhere =====
  useEffect(() => {
    const id = loadSelectedModelId();
    if (id && id !== selectedModel) setSelectedModel(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== API helper that attaches bearer (if present) =====
  const apiFetch = (path: string, init: RequestInit = {}) =>
    fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // ===== Send message -> Node -> Flask RAG -> append assistant =====
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    // Build question with selected snippets
    const contextPrefix =
      selectedSnippets.length > 0
        ? `Context snippets:\n${selectedSnippets.map((s) => `- ${s.content}`).join("\n")}\n\n`
        : "";
    const finalQuestion = `${contextPrefix}${input.trim()}`;

    // Optimistic user bubble
    const userMsg: Message = {
      id: newId(),
      role: "user",
      content: input,
      model: selectedModel,
    };

    // === Set title immediately from FIRST user message ===
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              title:
                c.title === "New Conversation" && c.messages.length === 0
                  ? userMsg.content.trim().slice(0, 48) || "New Conversation"
                  : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );
    setInput("");

    try {
      const res = await apiFetch(`/api/rag/chat`, {
        method: "POST",
        body: JSON.stringify({
          user_id: USER_ID,           // real app: use auth user id
          chat_id: activeChatId,      // <-- use the active chat's ID
          model_name: selectedModel,
          question: finalQuestion,
        }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(text?.slice(0, 200) || "Invalid response from server");
      }
      if (!res.ok) throw new Error(data?.error || "Chat request failed");

      const assistantText: string = data.response ?? "(no response)";
      const aiMsg: Message = {
        id: newId(),
        role: "assistant",
        content: assistantText,
        model: selectedModel,
      };

      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );
    } catch (err: any) {
      console.error("RAG chat error:", err);
      toast({
        title: "Chat failed",
        description: err?.message || "Unable to get a response.",
        variant: "destructive",
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: newId(), role: "assistant", content: "Sorry, something went wrong.", model: selectedModel },
                ],
              }
            : c
        )
      );
    }
  };

  // ===== Create new chat =====
  const createNewChat = () => {
    const id = newId();
    const newChat: Chat = { id, title: "New Conversation", messages: [] };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  // ===== Merge chats (calls Flask via Node) =====
  const mergeSelectedChats = async () => {
    if (selectedChats.length < 2) return;

    // Create a new chat to hold merged result
    const newChatId = newId();

    try {
      const res = await apiFetch(`/api/rag/merge_chats`, {
        method: "POST",
        body: JSON.stringify({
          user_id: USER_ID,
          new_chat_id: newChatId,
          merge_chat_ids: selectedChats,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Merge failed");

      // Locally merge message arrays for UX continuity
      const mergedMessages: Message[] = [];
      selectedChats.forEach((cid) => {
        const chat = chats.find((c) => c.id === cid);
        if (chat) mergedMessages.push(...chat.messages);
      });
      const mergedChat: Chat = {
        id: newChatId,
        title: "Merged Conversation",
        messages: mergedMessages,
      };

      setChats((prev) => [...prev, mergedChat]);
      setActiveChatId(newChatId);
      setSelectMode(false);
      setSelectedChats([]);

      toast({ title: "Merged", description: `Created chat ${newChatId} from ${selectedChats.length} chats.` });
    } catch (err: any) {
      console.error("Merge error:", err);
      toast({ title: "Merge failed", description: err?.message || "Unable to merge chats.", variant: "destructive" });
    }
  };

  // ===== Text selection -> snippets =====
  const handleTextSelection = (messageId: string) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText) {
      const newSnippet: TextSnippet = { id: newId(), content: selectedText, messageId };
      setSelectedSnippets((prev) => [...prev, newSnippet]);
      selection?.removeAllRanges();
    }
  };

  const removeSnippet = (snippetId: string) =>
    setSelectedSnippets((prev) => prev.filter((s) => s.id !== snippetId));

  const clearAllSnippets = () => setSelectedSnippets([]);

  const selectedModelName = useMemo(
    () => findModel(selectedModel)?.name ?? selectedModel,
    [selectedModel]
  );

  // ===== Persist active chat vector store on unload (optional) =====
  useEffect(() => {
    const onUnload = () => {
      try {
        const url = `${apiBaseUrl}/api/rag/close_chat`;
        const payload = JSON.stringify({ user_id: USER_ID, chat_id: activeChatId });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } catch {
        // ignore
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [apiBaseUrl, activeChatId]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <Button onClick={createNewChat} className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              onClick={() => setSelectMode(!selectMode)}
              variant={selectMode ? "default" : "outline"}
              className="w-full justify-start"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {selectMode ? "Done Selecting" : "Select Chats"}
            </Button>
            {selectMode && selectedChats.length >= 2 && (
              <Button onClick={mergeSelectedChats} className="w-full" size="sm">
                Merge Selected ({selectedChats.length})
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    if (selectMode) {
                      setSelectedChats((prev) =>
                        prev.includes(chat.id)
                          ? prev.filter((id) => id !== chat.id)
                          : [...prev, chat.id]
                      );
                    } else {
                      setActiveChatId(chat.id);
                    }
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                    activeChatId === chat.id && !selectMode
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    selectMode && selectedChats.includes(chat.id) && "bg-primary/20"
                  )}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Model Selector */}
          <div className="p-4 border-b border-border flex items-center gap-4">
            <label className="text-sm font-medium">Model:</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">Using: {selectedModelName}</span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {activeChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 group", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] relative select-text",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                    onMouseUp={() => handleTextSelection(message.id)}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.model && message.role === "assistant" && (
                      <p className="text-xs opacity-70 mt-1">via {message.model}</p>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleTextSelection(message.id)}
                      title="Select text and click to tag"
                    >
                      <Scissors className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto space-y-2">
              {selectedSnippets.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      Selected text ({selectedSnippets.length})
                    </p>
                    <Button size="sm" variant="ghost" onClick={clearAllSnippets} className="h-6 text-xs">
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="flex items-start gap-2 p-2 bg-muted rounded border border-border text-sm"
                      >
                        <p className="flex-1 min-w-0 break-words">{snippet.content}</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 flex-shrink-0"
                          onClick={() => removeSnippet(snippet.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={selectedSnippets.length > 0 ? "Ask about the selected text..." : "Type your message..."}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
