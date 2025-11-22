/**
 * Utility function to sync chats from localStorage to Supabase
 * Can be called from anywhere (logout, beforeunload, etc.)
 */

const LS_SUPABASE_CHATS_KEY = "supabase_chats_pending_sync";

function safeParse<T>(v: string | null, fallback: T): T {
  try {
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function syncChatsToSupabase(
  userId: string | null,
  token: string | null,
  apiBaseUrl: string
): Promise<boolean> {
  if (!userId || !token) {
    console.warn('[CHAT SYNC] Cannot sync: user not authenticated');
    return false;
  }

  try {
    const pendingChats = safeParse<Record<string, any>>(
      typeof window !== "undefined" ? window.localStorage.getItem(LS_SUPABASE_CHATS_KEY) : null,
      {}
    );

    const chatArray = Object.values(pendingChats);
    if (chatArray.length === 0) {
      console.log('[CHAT SYNC] No pending chats to sync');
      return true;
    }

    console.log(`[CHAT SYNC] Syncing ${chatArray.length} chats to Supabase...`);

    const response = await fetch(`${apiBaseUrl}/api/chats/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chats: chatArray,
      }),
    });

    if (response.ok) {
      // Clear pending chats after successful sync
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LS_SUPABASE_CHATS_KEY);
      }
      console.log('[CHAT SYNC] Successfully synced all chats to Supabase');
      return true;
    } else {
      const data = await response.json().catch(() => ({}));
      console.error('[CHAT SYNC] Sync failed:', data.error || 'Unknown error');
      return false;
    }
  } catch (err) {
    console.error('[CHAT SYNC] Failed to sync chats to Supabase:', err);
    return false;
  }
}

