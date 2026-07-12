const memoryUsers = new Map();
const memoryTokens = new Map();
const memoryProfiles = new Map();

async function getBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'chaminext-coach', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function readJson(store, key, fallback) {
  if (store) {
    const data = await store.get(key, { type: 'json' });
    if (data) return data;
  }
  return fallback;
}

async function writeJson(store, key, value, memMap) {
  if (memMap) memMap.set(key, value);
  if (store) await store.setJSON(key, value);
}

async function getProfile(userId) {
  const store = await getBlobStore();
  const key = `profile:${userId}`;
  return readJson(store, key, memoryProfiles.get(key) || null);
}

async function saveProfile(userId, profile) {
  const store = await getBlobStore();
  const key = `profile:${userId}`;
  await writeJson(store, key, profile, memoryProfiles);
}

async function saveMagicToken(token, email, expiresAt) {
  const store = await getBlobStore();
  const payload = { email, expiresAt };
  memoryTokens.set(token, payload);
  if (store) await store.setJSON(`magic:${token}`, payload);
}

async function consumeMagicToken(token) {
  const store = await getBlobStore();
  const key = `magic:${token}`;
  let payload = memoryTokens.get(token);
  if (!payload && store) {
    payload = await store.get(key, { type: 'json' });
  }
  if (!payload) return null;
  if (new Date(payload.expiresAt).getTime() < Date.now()) return null;
  memoryTokens.delete(token);
  if (store) await store.delete(key);
  return payload.email;
}

module.exports = {
  getProfile,
  saveProfile,
  saveMagicToken,
  consumeMagicToken,
  memoryUsers,
};
