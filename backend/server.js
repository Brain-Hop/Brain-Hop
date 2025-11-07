
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

// Auth: login endpoint - forwards request to auth_login module
//curl.exe -i -X POST "http://localhost:3001/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"rajputsomesh78@gmail.com\",\"password\":\"asdqwe123\"}"

const loginHandler = require('./auth_login');
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await loginHandler(req);
    const status = result && result.status ? result.status : 200;
    // remove status from payload before sending
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// Auth: signup endpoint - forwards request to auth_signup module
// curl.exe -i -X POST "http://localhost:3001/api/auth/signup" -H "Content-Type: application/json" -d "{\"email\":\"rajputsomesh69@gmail.com\",\"password\":\"example-password-123\"}"

const signupHandler = require('./auth_signup');
app.post('/api/auth/signup', async (req, res) => {
  try {
    const result = await signupHandler(req);
    const status = result && result.status ? result.status : 201;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// Auth: session completion helper for OAuth tokens
const sessionHandler = require('./auth_session');
app.post('/api/auth/session', async (req, res) => {
  try {
    const result = await sessionHandler(req);
    const status = result && result.status ? result.status : 200;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// Auth: logout endpoint - forwards request to auth_logout module
// curl.exe -i -X POST "http://localhost:3001/api/auth/logout" -H "Content-Type: application/json" -d "{}"

const logoutHandler = require('./auth_logout');
app.post('/api/auth/logout', async (req, res) => {
  try {
    const result = await logoutHandler(req);
    const status = result && result.status ? result.status : 200;
    const { status: _s, ...payload } = result || {};
    return res.status(status).json(payload);
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// Starts the Express server and logs the port it's running on.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// get a message and send response from ai 
app.post('/api/ai-message', (req, res) => {
  const userMessage = req.body.message;

  // Simulate AI response (replace with actual AI integration)
  const aiResponse = `Message received: ${userMessage}`;

  res.json({ response: aiResponse });
}); 