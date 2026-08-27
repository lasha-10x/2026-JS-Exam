/* ==========================================================================
   10X CRM — Supabase client + shared user data access
   Replaces the old localStorage-based getUsers/saveUsers (guard.js) so a
   signup is stored centrally and visible from any device/browser that
   opens the app, not just the one that created it.

   Setup (one time):
   1. Create a free project at https://supabase.com
   2. In the SQL editor, run the schema in supabase-schema.sql (included
      alongside this file).
   3. Project Settings -> API -> paste your Project URL and anon public
      key into SUPABASE_URL / SUPABASE_ANON_KEY below.
   The anon key is meant to be public in client-side code like this — it
   only works within the permissions granted by the Row Level Security
   policies in supabase-schema.sql.
   ========================================================================== */

const SUPABASE_URL = 'https://rblututyichvlpjzodaf.supabase.co'; // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibHV0dXR5aWNodmxwanpvZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5OTEzNzQsImV4cCI6MjEwMDU2NzM3NH0.qPIyEzsBvUwgPS7YnuY1O7A_2gW9NVOtx6F7sEI0x3k';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---- password hashing (SHA-256 via the browser's built-in Web Crypto API)
   This keeps plaintext passwords out of the database. It's still not as
   strong as a real backend doing bcrypt/argon2 with a per-user salt, but
   it's a solid improvement for a static-site project with no server. ---- */
// [HASHING DISABLED] Uncomment the block below to re-enable password hashing:
// async function hashPassword(password) {
//   const enc = new TextEncoder().encode(password);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
//   return Array.from(new Uint8Array(hashBuffer))
//     .map((b) => b.toString(16).padStart(2, '0'))
//     .join('');
// }

/* ---- users table access ---- */

function mapUserRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    // [HASHING DISABLED] Uncomment line below and remove the plain-text line to re-enable:
    // password: row.password_hash, // holds the SHA-256 hash, not the raw password
    password: row.password, // plain-text password (hashing disabled)
    company: row.company,
    createdAt: row.created_at,
  };
}

async function dbGetUsers() {
  const { data, error } = await supabaseClient.from('users').select('*');
  if (error) {
    console.error('dbGetUsers failed:', error);
    return [];
  }
  return data.map(mapUserRow);
}

async function dbFindUserByEmail(email) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('dbFindUserByEmail failed:', error);
    return null;
  }
  return data ? mapUserRow(data) : null;
}

async function dbFindUserById(id) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('dbFindUserById failed:', error);
    return null;
  }
  return data ? mapUserRow(data) : null;
}

/** Creates a user. Throws on failure (e.g. duplicate email) so callers can react. */
async function dbInsertUser({ fullName, email, password, company }) {
  // [HASHING DISABLED] Uncomment the two lines below and remove the plain-text insert to re-enable:
  // const passwordHash = await hashPassword(password);
  // .insert({ full_name: fullName, email, password_hash: passwordHash, company })
  const { data, error } = await supabaseClient
    .from('users')
    .insert({ full_name: fullName, email, password: password, company })
    .select()
    .single();
  if (error) throw error;
  return mapUserRow(data);
}

/** Partial update. Pass any of fullName / company / password. */
async function dbUpdateUser(id, patch) {
  const payload = {};
  if (patch.fullName !== undefined) payload.full_name = patch.fullName;
  if (patch.company !== undefined) payload.company = patch.company;
  // [HASHING DISABLED] Uncomment line below and remove the plain-text line to re-enable:
  // if (patch.password !== undefined) payload.password_hash = await hashPassword(patch.password);
  if (patch.password !== undefined) payload.password = patch.password;

  const { error } = await supabaseClient.from('users').update(payload).eq('id', id);
  if (error) throw error;
}
