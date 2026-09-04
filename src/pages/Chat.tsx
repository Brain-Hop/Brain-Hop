import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FloatingTextMenu } from "@/components/FloatingTextMenu";
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
  Image as ImageIcon,
  Trash2,
  Network,
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

import { getSupabasePendingSyncKey } from "@/utils/chatSync";

const getChatStorageKey = (uid: string | null) =>
  uid ? `brain_hop_chat_state_${uid}` : "brain_hop_chat_state_guest";

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
  const { isAuthenticated, loading, token, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Get user ID from auth context
  const userId = user?.id || null;

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
  const [isResponding, setIsResponding] = useState(false);
  const [chatMenuId, setChatMenuId] = useState<string | null>(null);
  // Floating menu state
  const [selectionMenu, setSelectionMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    messageId: string;
  }>({ visible: false, x: 0, y: 0, text: "", messageId: "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastLoadedUserIdRef = useRef<string | null | undefined>(undefined);
  const syncQueueRef = useRef<Promise<boolean>>(Promise.resolve(true));
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChatId, activeChat?.messages.length]);

  // ===== auth guard =====
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Clean up legacy unscoped keys on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("chat_state_v4_single_image");
        window.localStorage.removeItem("supabase_chats_pending_sync");
      } catch {
        // ignore
      }
    }
  }, []);

  // ===== hydrate and load user-specific chats =====
  useEffect(() => {
    if (loading || !isAuthenticated || !userId) return;

    // Detect if userId changed (login with new account or first mount)
    if (lastLoadedUserIdRef.current === userId) return;
    lastLoadedUserIdRef.current = userId;

    const storageKey = getChatStorageKey(userId);
    const cached = safeParse<{
      chats: Chat[];
      activeChatId: string;
      selectedModel: string;
      pendingImage: PendingImage | null;
    }>(
      typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null,
      {
        chats: [{ id: initialChatId, title: "New Conversation", messages: [] }],
        activeChatId: initialChatId,
        selectedModel: initialModelId,
        pendingImage: null,
      }
    );

    const initialChats = cached.chats?.length
      ? cached.chats
      : [{ id: initialChatId, title: "New Conversation", messages: [] }];
    setChats(initialChats);
    setActiveChatId(cached.activeChatId || initialChats[0].id);
    setSelectedModel(cached.selectedModel || initialModelId);
    setPendingImage(cached.pendingImage ?? null);

    // Fetch remote chats from Supabase for this user
    if (token) {
      const loadRemoteChats = async () => {
        try {
          const { fetchChatsFromSupabase } = await import("@/utils/chatSync");
          const remoteChats = await fetchChatsFromSupabase(userId, token, apiBaseUrl);

          if (remoteChats && remoteChats.length > 0) {
            const formattedRemote: Chat[] = remoteChats.map((rc: { chat_id?: string; title?: string; chat?: unknown }) => ({
              id: rc.chat_id || newId(),
              title: rc.title || "Untitled Chat",
              messages: (typeof rc.chat === "string" ? JSON.parse(rc.chat) : rc.chat || []) as Message[],
            }));

            const pendingKey = getSupabasePendingSyncKey(userId);
            const pendingMap = safeParse<Record<string, { chat?: unknown; title?: string }>>(
              typeof window !== "undefined" ? window.localStorage.getItem(pendingKey) : null,
              {}
            );

            const combinedMap = new Map<string, Chat>();
            formattedRemote.forEach((chat) => {
              if (pendingMap[chat.id]) {
                const pendingMessages = (Array.isArray(pendingMap[chat.id].chat)
                  ? pendingMap[chat.id].chat
                  : chat.messages) as Message[];
                combinedMap.set(chat.id, {
                  ...chat,
                  title: pendingMap[chat.id].title || chat.title,
                  messages: pendingMessages,
                });
              } else {
                combinedMap.set(chat.id, chat);
              }
            });

            Object.entries(pendingMap).forEach(([pendingId, pendingRecord]) => {
              if (!combinedMap.has(pendingId)) {
                combinedMap.set(pendingId, {
                  id: pendingId,
                  title: pendingRecord.title || "New Conversation",
                  messages: (Array.isArray(pendingRecord.chat) ? pendingRecord.chat : []) as Message[],
                });
              }
            });

            const mergedList = Array.from(combinedMap.values());
            if (mergedList.length > 0) {
              setChats(mergedList);
              setActiveChatId((current) =>
                combinedMap.has(current) ? current : mergedList[0].id
              );
            }
          }
        } catch (err) {
          console.error("[CHAT] Failed to load remote chats:", err);
        }
      };

      loadRemoteChats();
    }
  }, [userId, token, isAuthenticated, loading, apiBaseUrl, initialChatId, initialModelId]);

  // ===== persist to user-scoped localStorage =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading || !isAuthenticated || !userId) return;
    const storageKey = getChatStorageKey(userId);
    const snapshot = JSON.stringify({
      chats,
      activeChatId,
      selectedModel,
      pendingImage,
    });
    window.localStorage.setItem(storageKey, snapshot);
  }, [chats, activeChatId, selectedModel, pendingImage, userId, loading, isAuthenticated]);

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

  // ===== save chat to localStorage in Supabase format =====
  const saveChatToLocalStorage = (chatId: string, title: string, messages: Message[]) => {
    if (!userId) {
      console.warn('[CHAT] Cannot save chat: user not authenticated');
      return;
    }

    try {
      const pendingKey = getSupabasePendingSyncKey(userId);
      const existingPending = safeParse<Record<string, Record<string, unknown>>>(
        window.localStorage.getItem(pendingKey),
        {}
      );

      // Create chat record in Supabase format
      const now = new Date().toISOString();
      const chatRecord = {
        chat_id: chatId,
        user_id: userId,
        title: title,
        zip_file_url: '', // Empty string for NOT NULL constraint
        vector_count: 0,
        chat: messages, // Store messages as JSON
        created_at: existingPending[chatId]?.created_at || now,
        updated_at: now,
      };

      // Save to pending sync
      existingPending[chatId] = chatRecord;
      window.localStorage.setItem(pendingKey, JSON.stringify(existingPending));
      
      console.log(`[CHAT] Saved chat ${chatId} to localStorage (pending sync) for user ${userId}`);
    } catch (err) {
      console.error('[CHAT] Failed to save chat to localStorage:', err);
    }
  };

  // ===== sync all chats from localStorage to Supabase =====
  const syncChatsToSupabase = async (): Promise<boolean> => {
    if (!userId || !token) {
      console.warn('[CHAT] Cannot sync: user not authenticated');
      return false;
    }

    const { syncChatsToSupabase: syncFn } = await import('@/utils/chatSync');
    return await syncFn(userId, token, apiBaseUrl);
  };

  const queueBackgroundSync = (notifyOnFailure = false) => {
    syncQueueRef.current = syncQueueRef.current
      .catch(() => false)
      .then(() => syncChatsToSupabase())
      .then((synced) => {
        if (!synced && notifyOnFailure) {
          toast({
            title: "Chat saved locally",
            description: "We could not save it to your workspace. Please try again in a moment.",
            variant: "destructive",
          });
        }
        return synced;
      });
    return syncQueueRef.current;
  };

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
  const uploadPendingImage = async (chatId: string): Promise<string | null> => {
    if (!pendingImage || !userId) return null;

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

    const data = (await resp.json().catch(() => ({}))) as Record<string, unknown>;
    if (!resp.ok) {
      throw new Error((data?.error as string) || "Image upload failed");
    }
    return data.image_name as string;
  };

  // ===== send message =====
  const handleSend = async () => {
    if (isResponding) return;
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
    setChats((prev) => {
      const updated = prev.map((c) =>
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
      );
      const updatedChat = updated.find((c) => c.id === activeChatId);
      // Save chat to localStorage (will sync to Supabase on logout/close)
      if (updatedChat) {
        saveChatToLocalStorage(activeChatId, updatedChat.title, updatedChat.messages);
      }
      return updated;
    });

    setIsResponding(true);
    setInput("");
    setSelectedSnippets([]);

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages.",
        variant: "destructive",
      });
      setIsResponding(false);
      return;
    }

    window.setTimeout(() => { void queueBackgroundSync(false); }, 0);

    try {
      // 1) upload image (if any) to Supabase via Node -> receive image_name
      let image_name: string | null = null;
      if (pendingImage) {
        image_name = await uploadPendingImage(activeChatId);
        // only clear the local preview after a successful upload
        setPendingImage(null);
      }

      // 2) send chat to Node -> Flask (auto has_image if image_name present)
      const res = await apiFetch(`/api/rag/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
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

      setChats((prev) => {
        const updated = prev.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c));
        const updatedChat = updated.find((c) => c.id === activeChatId);
        // Save chat to localStorage (will sync to Supabase on logout/close)
        if (updatedChat) {
          saveChatToLocalStorage(activeChatId, updatedChat.title, updatedChat.messages);
        }
        return updated;
      });
      window.setTimeout(() => { void queueBackgroundSync(true); }, 0);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      console.error("RAG chat error:", err);
      toast({
        title: "Chat failed",
        description: errObj?.message || "Unable to get a response.",
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
      window.setTimeout(() => { void queueBackgroundSync(true); }, 0);
      // keep pendingImage as-is so user can retry
    } finally {
      setIsResponding(false);
    }
  };

  // ===== new chat =====
  const createNewChat = () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a new chat.",
        variant: "destructive",
      });
      return;
    }

    const id = newId();
    const newChat: Chat = { id, title: "New Conversation", messages: [] };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(id);
    // Save new chat to localStorage (will sync to Supabase on logout/close)
    saveChatToLocalStorage(id, newChat.title, newChat.messages);
  };

  const deleteChat = async (chatId: string) => {
    if (!window.confirm("Delete this chat and its saved memory? This cannot be undone.")) return;

    try {
      if (userId && token) {
        const response = await apiFetch(`/api/chats/${chatId}`, { method: "DELETE" });
        if (!response.ok && response.status !== 404) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Unable to delete this chat");
        }
      }

      setChats((previous) => {
        const remaining = previous.filter((chat) => chat.id !== chatId);
        if (remaining.length > 0) {
          if (activeChatId === chatId) setActiveChatId(remaining[0].id);
          return remaining;
        }
        const replacement = { id: newId(), title: "New Conversation", messages: [] };
        setActiveChatId(replacement.id);
        return [replacement];
      });

      const pendingKey = getSupabasePendingSyncKey(userId);
      const pending = safeParse<Record<string, unknown>>(window.localStorage.getItem(pendingKey), {});
      delete pending[chatId];
      window.localStorage.setItem(pendingKey, JSON.stringify(pending));
      toast({ title: "Chat deleted", description: "Its conversation and saved memory were removed." });
    } catch (error) {
      console.error("Chat deletion failed:", error);
      toast({ title: "Could not delete chat", description: "Please try again in a moment.", variant: "destructive" });
    }
  };

  const deleteAllChats = async () => {
    if (!window.confirm("Are you sure you want to delete ALL chats in your account? This will clear your chat history and memory.")) return;

    try {
      if (userId && token) {
        await apiFetch(`/api/chats`, { method: "DELETE" });
      }

      const replacement = { id: newId(), title: "New Conversation", messages: [] };
      setChats([replacement]);
      setActiveChatId(replacement.id);

      const pendingKey = getSupabasePendingSyncKey(userId);
      const storageKey = getChatStorageKey(userId);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(pendingKey);
        window.localStorage.removeItem(storageKey);
      }
      toast({ title: "All chats deleted", description: "Your chat list and memory were cleared." });
    } catch (error) {
      console.error("Failed to delete all chats:", error);
      toast({ title: "Could not delete all chats", description: "Please try again.", variant: "destructive" });
    }
  };

  // ===== merge chats =====
  const mergeSelectedChats = async () => {
    if (selectedChats.length < 2) return;

    const newChatId = newId();

    try {
      if (!userId) {
        toast({
          title: "Authentication required",
          description: "Please log in to merge chats.",
          variant: "destructive",
        });
        return;
      }

      const res = await apiFetch(`/api/rag/merge_chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          new_chat_id: newChatId,
          merge_chat_ids: selectedChats,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Merge failed");

      // locally merge for UX continuity
      const mergedMessages: Message[] = [];
      const seenMsgIds = new Set<string>();

      selectedChats.forEach((cid) => {
        const chat = chats.find((c) => c.id === cid);
        if (chat) {
          for (const msg of chat.messages) {
            if (!seenMsgIds.has(msg.id)) {
              mergedMessages.push(msg);
              seenMsgIds.add(msg.id);
            }
          }
        }
      });
      const mergedChat: Chat = { id: newChatId, title: "Merged Conversation", messages: mergedMessages };

      setChats((prev) => [...prev, mergedChat]);
      setActiveChatId(newChatId);
      setSelectMode(false);
      setSelectedChats([]);
      // Save merged chat to localStorage (will sync to Supabase on logout/close)
      saveChatToLocalStorage(newChatId, mergedChat.title, mergedChat.messages);
      toast({ title: "Merged", description: `Created chat ${newChatId} from ${selectedChats.length} chats.` });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      console.error("Merge error:", err);
      toast({ title: "Merge failed", description: errObj?.message || "Unable to merge chats.", variant: "destructive" });
    }
  };

  // ===== snippets =====
  const handleSelectionChange = (messageId: string, event: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      // Calculate position for the floating menu
      // We use the event client coordinates as a fallback, but try to use range rect
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectionMenu({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top,
          text: selectedText,
          messageId: messageId
        });
      }
    } else {
       // logic to hide if needed, but usually clicking elsewhere handles it via the menu's outside click
       // actually, simply selecting nothing should probably stay as is until they click away
    }
  };

  const handleAsk = () => {
    if (selectionMenu.text) {
      const newSnippet: TextSnippet = { 
        id: newId(), 
        content: selectionMenu.text, 
        messageId: selectionMenu.messageId 
      };
      setSelectedSnippets((prev) => [...prev, newSnippet]);
      
      // Clear selection and menu
      window.getSelection()?.removeAllRanges();
      setSelectionMenu(prev => ({ ...prev, visible: false }));
    }
  };

  const removeSnippet = (snippetId: string) =>
    setSelectedSnippets((prev) => prev.filter((s) => s.id !== snippetId));
  const clearAllSnippets = () => setSelectedSnippets([]);

  const selectedModelName = useMemo(
    () => findModel(selectedModel)?.name ?? selectedModel,
    [selectedModel]
  );

  // ===== sync chats to Supabase on page unload/visibility change =====
  useEffect(() => {
    if (!userId || !token) return;
    
    // Sync on visibility change (more reliable than beforeunload)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, sync chats
        syncChatsToSupabase().catch(err => {
          console.error('[CHAT] Sync on visibility change failed:', err);
        });
      }
    };

    // Also sync on beforeunload as backup
    const onUnload = () => {
      // Use fetch with keepalive for reliable delivery with auth headers
      const pendingKey = getSupabasePendingSyncKey(userId);
      const pendingChats = safeParse<Record<string, Record<string, unknown>>>(
        window.localStorage.getItem(pendingKey),
        {}
      );
      const chatArray = Object.values(pendingChats);
      
      if (chatArray.length > 0) {
        // Use fetch with keepalive flag (more reliable than sendBeacon for auth)
        fetch(`${apiBaseUrl}/api/chats/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ chats: chatArray }),
          keepalive: true, // Ensures request completes even if page closes
        }).catch(() => {
          // Ignore errors on unload
        });
      }
      
      // Also close the active chat in RAG service
      fetch(`${apiBaseUrl}/api/rag/close_chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: userId, chat_id: activeChatId }),
        keepalive: true,
      }).catch(() => {
        // Ignore errors on unload
      });
    };
    
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onUnload);
    
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [apiBaseUrl, activeChatId, userId, token]);

  return (
    <div className="h-screen flex flex-col bg-gradient-subtle">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-card/80 backdrop-blur flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Thought paths</p>
            <Button onClick={createNewChat} className="w-full justify-start rounded-xl" variant="outline" disabled={isResponding}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              onClick={() => setSelectMode(!selectMode)}
              variant={selectMode ? "default" : "outline"}
              className="w-full justify-start rounded-xl"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {selectMode ? "Done Selecting" : "Select Chats"}
            </Button>
            {selectMode && selectedChats.length >= 2 && (
              <Button onClick={mergeSelectedChats} className="w-full rounded-xl" size="sm">
                Connect selected ({selectedChats.length})
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chats.map((chat) => (
                <div key={chat.id} className={cn(
                  "group relative flex items-center gap-1 rounded-xl border border-transparent transition-colors px-1",
                  activeChatId === chat.id && !selectMode ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted hover:border-border text-foreground",
                  selectMode && selectedChats.includes(chat.id) && "bg-accent/30 border-accent"
                )}>
                  <button
                    onClick={() => {
                      if (selectMode) setSelectedChats((prev) => prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]);
                      else setActiveChatId(chat.id);
                    }}
                    className="min-w-0 flex-1 text-left px-2 py-2.5 text-sm flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-80" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void deleteChat(chat.id);
                    }}
                    className={cn(
                      "p-1.5 mr-1 rounded-lg transition-opacity hover:bg-destructive/20 hover:text-destructive shrink-0",
                      activeChatId === chat.id ? "opacity-90 hover:opacity-100" : "opacity-0 group-hover:opacity-80 hover:!opacity-100"
                    )}
                    title="Delete chat"
                    aria-label={`Delete ${chat.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer with Clear All */}
          {chats.length > 0 && (
            <div className="p-3 border-t border-border mt-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteAllChats}
                className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Clear all chats
              </Button>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Model Selector */}
          <div className="p-4 border-b border-border flex items-center gap-4 bg-card/45">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Network className="h-4 w-4" /></div>
            <div className="min-w-0"><p className="text-[11px] uppercase tracking-[.14em] text-muted-foreground">Active perspective</p><p className="text-sm font-medium truncate">{activeChat?.title || 'New conversation'}</p></div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="ml-auto w-64 rounded-xl bg-background/80">
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
            <span className="hidden xl:inline text-xs text-muted-foreground">{selectedModelName}</span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {activeChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 group", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] relative select-text shadow-soft border",
                      message.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                    )}
                    onMouseUp={(e) => handleSelectionChange(message.id, e)}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words text-sm">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* render single image if present */}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Chat attachment"
                        className="mt-2 rounded border border-border max-h-48 object-contain bg-background"
                      />
                    )}

                    {message.model && message.role === "assistant" && (
                      <p className="text-xs opacity-70 mt-1">via {message.model}</p>
                    )}

                  </div>
                </div>
              ))}
              <div ref={latestMessageRef} />
              
              <FloatingTextMenu 
                visible={selectionMenu.visible}
                position={selectionMenu.visible ? { x: selectionMenu.x, y: selectionMenu.y } : null}
                onAsk={handleAsk}
                onClose={() => setSelectionMenu(prev => ({ ...prev, visible: false }))}
              />
            </div>
          </ScrollArea>

          {/* Input + Single Attachment */}
          <div className="p-4 border-t border-border bg-card/65 backdrop-blur">
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
                    <img
                      src={pendingImage.dataUrl}
                      alt="Attachment preview"
                      className="w-52 h-36 object-cover bg-background"
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-[10px] bg-black/40 text-white px-1 truncate">
                      {pendingImage.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Snippets */}
              {selectedSnippets.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {selectedSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="flex items-center gap-2 bg-muted/50 border border-border rounded-md px-2 py-1 text-xs"
                    >
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="max-w-[200px] truncate">{snippet.content}</span>
                      <button
                        onClick={() => removeSnippet(snippet.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {selectedSnippets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSnippets}
                      className="h-6 text-xs text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              )}

              <div className="flex gap-2 rounded-2xl border border-border bg-background/80 p-2 shadow-soft">
                {/* hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileSelected}
                />

                {/* attach button */}
                <Button type="button" variant="ghost" onClick={onPickImage} title="Attach image" className="rounded-xl" disabled={isResponding}>
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
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                  disabled={isResponding}
                />

                {/* send */}
                <Button onClick={handleSend} size="icon" title="Send" className="rounded-xl" disabled={isResponding}>
                  {isResponding ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
