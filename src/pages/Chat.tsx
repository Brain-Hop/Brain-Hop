// src/pages/Chat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare,
  Plus,
  Send,
  CheckSquare,
  Tag,
  X,
  Scissors,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
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
  image?: string | null; // data URL for rendering (user/preview only)
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

type PendingImage = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 (for preview only)
};

const LS_KEY = "chat_state_v4_single_image";

// ====== CONSTANT USER ID (for now) ======
const USER_ID = "1000";

// ---- helpers ----
function safeParse<T>(v: string | null, fallback: T): T {
  try {
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function newId() {
  return (typeof crypto !== "undefined" && "randomUUID" in crypto && crypto.randomUUID()) || Date.now().toString();
}

export default function Chat() {
  const { isAuthenticated, loading, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // ===== model selection =====
  const initialModelId = useMemo(() => loadSelectedModelId() ?? DEFAULT_MODEL_ID, []);
  const [selectedModel, setSelectedModel] = useState<string>(initialModelId);

  // ===== app state =====
  const initialChatId = useMemo(() => newId(), []);
  const [chats, setChats] = useState<Chat[]>([{ id: initialChatId, title: "New Conversation", messages: [] }]);
  const [activeChatId, setActiveChatId] = useState<string>(initialChatId);
  const [input, setInput] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selectedSnippets, setSelectedSnippets] = useState<TextSnippet[]>([]);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null); // SINGLE image

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hydratedRef = useRef(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // ===== auth guard =====
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // ===== hydrate from localStorage =====
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const cached = safeParse<{
      chats: Chat[];
      activeChatId: string;
      selectedModel: string;
      pendingImage: PendingImage | null;
    }>(
      typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null,
      {
        chats: [{ id: initialChatId, title: "New Conversation", messages: [] }],
        activeChatId: initialChatId,
        selectedModel: initialModelId,
        pendingImage: null,
      }
    );

    setChats(cached.chats?.length ? cached.chats : [{ id: initialChatId, title: "New Conversation", messages: [] }]);
    setActiveChatId(cached.activeChatId || initialChatId);
    setSelectedModel(cached.selectedModel || initialModelId);
    setPendingImage(cached.pendingImage ?? null);
  }, [initialChatId, initialModelId]);

  // ===== persist to localStorage =====
  useEffect(() => {
    const snapshot = JSON.stringify({
      chats,
      activeChatId,
      selectedModel,
      pendingImage,
    });
    window.localStorage.setItem(LS_KEY, snapshot);
  }, [chats, activeChatId, selectedModel, pendingImage]);

  // keep model synced if changed on models page
  useEffect(() => {
    const id = loadSelectedModelId();
    if (id && id !== selectedModel) setSelectedModel(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== api helpers =====
  const apiFetch = (path: string, init: RequestInit = {}) =>
    fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        // do not force JSON content-type here; caller sets it if needed
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // ===== image handling (single) =====
  const onPickImage = () => fileInputRef.current?.click();

  const fileToDataUrl = (file: File): Promise<PendingImage> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const pending = await fileToDataUrl(f);
      setPendingImage(pending); // replace any existing image
    } catch (err) {
      console.error("Image load error:", err);
      toast({ title: "Image error", description: "Unable to load the selected image.", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearPendingImage = () => setPendingImage(null);

  // upload pending image to /api/rag/image -> returns image_name
  const uploadPendingImage = async (userId: string, chatId: string): Promise<string | null> => {
    if (!pendingImage) return null;

    // convert dataUrl back to Blob
    const toBlob = async (dataUrl: string) => {
      const res = await fetch(dataUrl);
      return await res.blob();
    };

    const blob = await toBlob(pendingImage.dataUrl);
    const file = new File([blob], pendingImage.name || "image.png", { type: blob.type || "image/png" });

    const form = new FormData();
    form.append("user_id", userId);
    form.append("chat_id", chatId);
    form.append("image", file);

    const resp = await apiFetch(`/api/rag/image`, {
      method: "POST",
      body: form, // browser sets multipart boundary
    });

    const data = await resp.json().catch(() => ({} as any));
    if (!resp.ok) {
      throw new Error(data?.error || "Image upload failed");
    }
    return data.image_name as string;
  };

  // ===== send message =====
  const handleSend = async () => {
    if (!activeChat) return;
    if (!input.trim() && !pendingImage) return;

    // build question with context
    const contextPrefix =
      selectedSnippets.length > 0
        ? `Context snippets:\n${selectedSnippets.map((s) => `- ${s.content}`).join("\n")}\n\n`
        : "";
    const finalQuestion = `${contextPrefix}${input.trim()}`;

    // optimistic user message (includes preview image)
    const userMsg: Message = {
      id: newId(),
      role: "user",
      content: input,
      model: selectedModel,
      image: pendingImage?.dataUrl ?? null,
    };

    // set title from FIRST user message
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              title:
                c.title === "New Conversation" && c.messages.length === 0
                  ? (userMsg.content || "[Image]").trim().slice(0, 48) || "New Conversation"
                  : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    setInput("");

    try {
      // 1) upload image (if any) to Supabase via Node -> receive image_name
      let image_name: string | null = null;
      if (pendingImage) {
        image_name = await uploadPendingImage(USER_ID, activeChatId);
        // only clear the local preview after a successful upload
        setPendingImage(null);
      }

      // 2) send chat to Node -> Flask (auto has_image if image_name present)
      const res = await apiFetch(`/api/rag/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          chat_id: activeChatId,
          model_name: selectedModel,
          question: finalQuestion,
          // only send when present; server converts to has_image=true
          ...(image_name ? { image_name } : {}),
        }),
      });

      const data = await res.json().catch(async () => ({ error: await res.text() }));
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
      // keep pendingImage as-is so user can retry
    }
  };

  // ===== new chat =====
  const createNewChat = () => {
    const id = newId();
    const newChat: Chat = { id, title: "New Conversation", messages: [] };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  // ===== merge chats =====
  const mergeSelectedChats = async () => {
    if (selectedChats.length < 2) return;

    const newChatId = newId();

    try {
      const res = await apiFetch(`/api/rag/merge_chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          new_chat_id: newChatId,
          merge_chat_ids: selectedChats,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Merge failed");

      // locally merge for UX continuity
      const mergedMessages: Message[] = [];
      selectedChats.forEach((cid) => {
        const chat = chats.find((c) => c.id === cid);
        if (chat) mergedMessages.push(...chat.messages);
      });
      const mergedChat: Chat = { id: newChatId, title: "Merged Conversation", messages: mergedMessages };

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

  // ===== snippets =====
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

  // ===== persist vector store on unload =====
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
                        prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* render single image if present */}
                    {message.image && (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img
                        src={message.image}
                        className="mt-2 rounded border border-border max-h-48 object-contain bg-background"
                      />
                    )}

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

          {/* Input + Single Attachment */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* pending image preview */}
              {pendingImage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">Attachment</p>
                    <Button size="sm" variant="ghost" onClick={clearPendingImage} className="h-6 text-xs">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="relative border border-border rounded overflow-hidden w-52">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src={pendingImage.dataUrl} className="w-52 h-36 object-cover bg-background" />
                    <div className="absolute bottom-0 left-0 right-0 text-[10px] bg-black/40 text-white px-1 truncate">
                      {pendingImage.name}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {/* hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileSelected}
                />

                {/* attach button */}
                <Button type="button" variant="outline" onClick={onPickImage} title="Attach image">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button>

                {/* message input */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    selectedSnippets.length > 0
                      ? "Ask about the selected text..."
                      : "Type your message..."
                  }
                  className="flex-1"
                />

                {/* send */}
                <Button onClick={handleSend} size="icon" title="Send">
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
