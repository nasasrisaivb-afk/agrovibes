// Session token persistence. Consumer and admin sessions are fully separate
// (distinct auth paths, distinct tokens, distinct storage keys).
const CONSUMER_KEY = "cropvibe-session";
const ADMIN_KEY = "cropvibe-admin-session";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private-mode storage failures degrade to in-memory sessions.
  }
}

export const sessionStore = {
  getConsumerToken: () => read(CONSUMER_KEY),
  setConsumerToken: (token: string | null) => write(CONSUMER_KEY, token),
  getAdminToken: () => read(ADMIN_KEY),
  setAdminToken: (token: string | null) => write(ADMIN_KEY, token),
};
