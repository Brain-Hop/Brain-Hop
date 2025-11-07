const axios = require('axios');

// URL of your Flask RAG service
const RAG_BASE_URL = 'https://wholistic-felicidad-crankily.ngrok-free.dev'; // or process.env.RAG_SERVICE_URL
// const RAG_BASE_URL_first = 'https://wholistic-felicidad-crankily.ngrok-free.dev'; // or process.env.RAG_SERVICE_URL
const express = require('express');
const cors = require('cors');

// Shared Supabase client (single source of truth)
const { supabase } = require('./supabase');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware to log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Defines a GET endpoint to send a test message to the frontend.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// -------------------- AUTH ENDPOINTS --------------------

const loginHandler = require('./auth_login');
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await loginHandler(req);
    const status = result?.status || 200;
    const { status: _s, ...payload } = result || {};

    // Log token if available
    if (payload?.token) console.log(`[AUTH] Access token (truncated): ${payload.token.slice(0, 12)}...`);

    return res.status(status).json(payload);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || String(err) });
  }
});

const signupHandler = require('./auth_signup');
app.post('/api/auth/signup', async (req, res) => {
  try {
    const result = await signupHandler(req);
    const status = result?.status || 201;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || String(err) });
  }
});

const sessionHandler = require('./auth_session');
app.post('/api/auth/session', async (req, res) => {
  try {
    const result = await sessionHandler(req);
    const status = result?.status || 200;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || String(err) });
  }
});

const logoutHandler = require('./auth_logout');
app.post('/api/auth/logout', async (req, res) => {
  try {
    const result = await logoutHandler(req);
    const status = result?.status || 200;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || String(err) });
  }
});

// -------------------- SIMPLE AI MESSAGE --------------------


// -------------------- RAG ENDPOINTS (Flask Integration) --------------------

// Forward chat request to Flask RAG service
// /api/rag/chat
app.post('/api/rag/chat', async (req, res) => {
  try {
    const { user_id, chat_id, model_name, question } = req.body || {};
    if (!user_id || !chat_id || !model_name || !question) {
      return res.status(400).json({ error: 'user_id, chat_id, model_name, and question are required' });
    }

    const response = await axios.post(
      `${RAG_BASE_URL}/chat`,
      { user_id, chat_id, model_name, question },
      { timeout: 25000, validateStatus: () => true }
    );

    if (response.status >= 200 && response.status < 300) {
      // Assume Flask responded with JSON
      return res.status(response.status).json(response.data);
    }

    // Non-2xx from Flask: try to stringify safely
    const raw = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    console.error('[RAG] /chat upstream error:', response.status, raw.slice(0, 300));
    return res.status(response.status).json({ error: 'RAG upstream error', detail: raw.slice(0, 300) });
  } catch (err) {
    console.error('[RAG] /chat error:', err?.message || err);
    return res.status(500).json({ error: 'RAG chat request failed' });
  }
});


// Forward close_chat request to Flask RAG service
app.post('/api/rag/close_chat', async (req, res) => {
  try {
    const { user_id, chat_id } = req.body || {};
    if (!user_id || !chat_id) {
      return res.status(400).json({ error: 'user_id and chat_id are required' });
    }

    console.log(`[RAG] Persisting and closing chat for user ${user_id}, chat ${chat_id}...`);

    const response = await axios.post(
      `${RAG_BASE_URL}/close_chat`,
      { user_id, chat_id },
      { timeout: 25000 }
    );

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error('[RAG] /close_chat error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({
      error: err.response?.data?.error || 'RAG close_chat request failed',
    });
  }
});

// // -------------------- START SERVER --------------------

// app.listen(port, () => {
//   console.log(`✅ Server is running on http://localhost:${port}`);
// });
// -------------------- RAG ENDPOINTS (Flask Integration) --------------------

// // Constant model for now
// const FIXED_MODEL_NAME = "google/gemma-3n-e2b-it:free";

// // Forward chat request to Flask RAG service
// app.post('/api/rag/chat', async (req, res) => {
//   try {
//     // Extract body
//     const { user_id, chat_id, question } = req.body || {};

//     // Validate required fields
//     if (!user_id || !chat_id || !question) {
//       return res.status(400).json({
//         error: 'user_id, chat_id, and question are required',
//       });
//     }

//     console.log(
//       `[RAG] → Sending chat to Flask | user:${user_id} chat:${chat_id} model:${FIXED_MODEL_NAME} question:"${question.slice(
//         0,
//         100
//       )}..."`
//     );

//     // Send to Flask service
//     const response = await axios.post(
//       `${RAG_BASE_URL}/chat`,
//       { user_id, chat_id, model_name: FIXED_MODEL_NAME, question },
//       { timeout: 25000, validateStatus: () => true }
//     );

//     // Always log Flask response (status + trimmed data)
//     const shortData =
//       typeof response.data === "string"
//         ? response.data.slice(0, 300)
//         : JSON.stringify(response.data).slice(0, 300);

//     console.log(`[RAG] ← Flask responded [${response.status}]: ${shortData}`);

//     // If success (2xx), forward JSON directly
//     if (response.status >= 200 && response.status < 300) {
//       return res.status(response.status).json(response.data);
//     }

//     // If non-2xx, wrap the error
//     return res.status(response.status).json({
//       error: "RAG upstream error",
//       detail: shortData,
//     });
//   } catch (err) {
//     console.error("[RAG] /chat error:", err?.message || err);
//     return res
//       .status(500)
//       .json({ error: "RAG chat request failed", detail: err?.message || err });
//   }
// });

// // Forward close_chat request to Flask RAG service
// app.post('/api/rag/close_chat', async (req, res) => {
//   try {
//     const { user_id, chat_id } = req.body || {};
//     if (!user_id || !chat_id) {
//       return res
//         .status(400)
//         .json({ error: "user_id and chat_id are required" });
//     }

//     console.log(`[RAG] → Closing chat for user:${user_id} chat:${chat_id}`);

//     const response = await axios.post(
//       `${RAG_BASE_URL}/close_chat`,
//       { user_id, chat_id },
//       { timeout: 25000, validateStatus: () => true }
//     );

//     // Always log Flask response (status + partial data)
//     const shortData =
//       typeof response.data === "string"
//         ? response.data.slice(0, 300)
//         : JSON.stringify(response.data).slice(0, 300);

//     console.log(`[RAG] ← Flask close_chat [${response.status}]: ${shortData}`);

//     if (response.status >= 200 && response.status < 300) {
//       return res.status(response.status).json(response.data);
//     }

//     return res.status(response.status).json({
//       error: "RAG close_chat upstream error",
//       detail: shortData,
//     });
//   } catch (err) {
//     console.error("[RAG] /close_chat error:", err?.message || err);
//     const status = err.response?.status || 500;
//     return res.status(status).json({
//       error: "RAG close_chat request failed",
//       detail: err.response?.data || err?.message,
//     });
//   }
// });

// // -------------------- START SERVER --------------------


// -------------------- RAG: Merge Chats (Flask Integration) --------------------
app.post('/api/rag/merge_chats', async (req, res) => {
  try {
    const { user_id, new_chat_id, merge_chat_ids } = req.body || {};

    if (!user_id || !new_chat_id || !Array.isArray(merge_chat_ids) || merge_chat_ids.length < 2) {
      return res.status(400).json({
        error: 'user_id, new_chat_id and merge_chat_ids (>=2) are required'
      });
    }

    console.log(
      `[RAG] → Merging chats for user:${user_id} new_chat:${new_chat_id} from: [${merge_chat_ids.join(', ')}]`
    );

    const response = await axios.post(
      `${RAG_BASE_URL}/merge_chats`,
      { user_id, new_chat_id, merge_chat_ids },
      { timeout: 30000, validateStatus: () => true }
    );

    const shortData =
      typeof response.data === "string"
        ? response.data.slice(0, 300)
        : JSON.stringify(response.data).slice(0, 300);

    console.log(`[RAG] ← Flask merge_chats [${response.status}]: ${shortData}`);

    if (response.status >= 200 && response.status < 300) {
      return res.status(response.status).json(response.data);
    }

    return res.status(response.status).json({
      error: "RAG merge_chats upstream error",
      detail: shortData,
    });
  } catch (err) {
    console.error("[RAG] /merge_chats error:", err?.message || err);
    return res.status(500).json({ error: "RAG merge_chats request failed", detail: err?.message || err });
  }
});
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});