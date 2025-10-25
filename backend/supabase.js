/**
 * Shared Supabase client for the backend.
 * Exports: { supabase }
 *
 * Requires environment variables:
 *   - SUPABASE_URL
 *   - SUPABASE_KEY
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jglveatavrfvdczmjaqs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbHZlYXRhdnJmdmRjem1qYXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTE3NzUsImV4cCI6MjA3Njk4Nzc3NX0.btpQXyyP4qZfLNkuHKrYS9-qwXspvnc5LGYaS98EVGQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = { supabase };
