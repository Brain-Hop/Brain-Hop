/**
 * Signup using the shared Supabase client
 * Expects POST body: { email, password }
 * 
 * curl.exe -i -X POST "http://localhost:3001/api/auth/signup" -H "Content-Type: application/json" -d "{\"email\":\"rajputsomesh69@gmail.com\",\"password\":\"example-password-123\"}"
 * 
 */
module.exports = async function signup(req) {
  const body = req && req.body ? req.body : {};
  const { email, password } = body;

  if (!email || !password) {
    return { status: 400, error: 'email and password are required' };
  }

  // basic email format check
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRe.test(String(email).toLowerCase())) {
    return { status: 400, error: 'invalid email address' };
  }

  try {
    const { supabase } = require('./supabase');

    // Call signUp without user metadata (we don't accept name)
    const result = await supabase.auth.signUp({ email, password });

    const { data, error } = result || {};
    if (error) {
      return { status: 400, error: error.message || String(error) };
    }

    const user = data?.user || data || null;
    const safeUser = user
      ? {
          id: user.id || user.user_id || null,
          email: user.email || null,
          created_at: user.created_at || null,
        }
      : null;

    return { status: 201, user: safeUser, meta: { confirmation_sent_at: data?.confirmation_sent_at } };
  } catch (err) {
    return { status: 500, error: (err && err.message) || String(err) };
  }
};
