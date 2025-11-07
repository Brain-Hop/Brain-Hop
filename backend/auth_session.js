module.exports = async function session(req) {
  const body = req && req.body ? req.body : {};
  const accessToken = body.access_token;

  if (!accessToken) {
    return { status: 400, error: 'access_token is required' };
  }

  try {
    const { supabase } = require('./supabase');

    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      return { status: 401, error: error.message || String(error) };
    }

    const user = data && data.user ? data.user : null;
    const safeUser = user
      ? {
          id: user.id || null,
          email: user.email || null,
          name: (user.user_metadata && user.user_metadata.name) || null,
        }
      : null;

    if (safeUser) {
      console.log(
        `[AUTH] OAuth login completed for ${safeUser.email || safeUser.id || 'unknown user'} via Google`,
      );
    } else {
      console.log('[AUTH] OAuth login completed with missing user details');
    }

    const expiresIn = typeof body.expires_in === 'number' ? body.expires_in : null;
    const expiresAtSeconds = expiresIn ? Math.round(Date.now() / 1000 + expiresIn) : null;

    return {
      status: 200,
      user: safeUser,
      token: accessToken,
      refresh_token: body.refresh_token || null,
      expires_at: expiresAtSeconds,
    };
  } catch (err) {
    return { status: 500, error: (err && err.message) || String(err) };
  }
};

