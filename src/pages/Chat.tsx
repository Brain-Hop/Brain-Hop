import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus, Send, CheckSquare, Tag, X, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
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

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>([
    { id: "1", title: "New Conversation", messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selectedSnippets, setSelectedSnippets] = useState<TextSnippet[]>([]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      model: selectedModel,
    };

    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    );

    setChats(updatedChats);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a response from ${selectedModel}. Your message: "${input}"`,
        model: selectedModel,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    }, 1000);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  const mergeSelectedChats = () => {
    if (selectedChats.length < 2) return;

    const mergedMessages: Message[] = [];
    selectedChats.forEach((chatId) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        mergedMessages.push(...chat.messages);
      }
    });

    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Merged Conversation",
      messages: mergedMessages,
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
    setSelectMode(false);
    setSelectedChats([]);
  };

  const handleTextSelection = (messageId: string) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const newSnippet: TextSnippet = {
        id: Date.now().toString(),
        content: selectedText,
        messageId,
      };
      setSelectedSnippets((prev) => [...prev, newSnippet]);
      selection?.removeAllRanges();
    }
  };

  const removeSnippet = (snippetId: string) => {
    setSelectedSnippets((prev) => prev.filter((s) => s.id !== snippetId));
  };

  const clearAllSnippets = () => {
    setSelectedSnippets([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar isAuthenticated />

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

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Model Selector */}
          <div className="p-4 border-b border-border flex items-center gap-4">
            <label className="text-sm font-medium">Model:</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {activeChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 group",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] relative select-text",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearAllSnippets}
                      className="h-6 text-xs"
                    >
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
                  placeholder={
                    selectedSnippets.length > 0
                      ? "Ask about the selected text..."
                      : "Type your message..."
                  }
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
