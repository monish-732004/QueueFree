import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ebgxwhmwlwmjdziorgck.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ3h3aG13bHdtamR6aW9yZ2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyMzIsImV4cCI6MjA2ODkwNzIzMn0.MBE0Ib2Hti_YeSUddVCWkDiE2CqC_5aQJNzJymXFk8A";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});