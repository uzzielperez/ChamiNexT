const memoryEntitlements = new Map();
const memoryCompanies = new Map();
const memoryFounding = { redemptions: 0 };

async function getBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'chaminext-billing', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function readJson(store, key, fallback) {
  if (store) {
    const data = await store.get(key, { type: 'json' });
    if (data != null) return data;
  }
  return fallback;
}

async function writeJson(store, key, value, memMap) {
  if (memMap) memMap.set(key, value);
  if (store) await store.setJSON(key, value);
}

function emailKey(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

async function getEntitlement(email) {
  const key = `entitlement:${emailKey(email)}`;
  const store = await getBlobStore();
  return readJson(store, key, memoryEntitlements.get(key) || null);
}

async function saveEntitlement(email, entitlement) {
  const key = `entitlement:${emailKey(email)}`;
  const store = await getBlobStore();
  const payload = {
    ...entitlement,
    email: emailKey(email),
    updatedAt: new Date().toISOString(),
  };
  await writeJson(store, key, payload, memoryEntitlements);
  return payload;
}

async function getCompanyWorkspace(workspaceId) {
  const key = `company:${workspaceId}`;
  const store = await getBlobStore();
  return readJson(store, key, memoryCompanies.get(key) || null);
}

async function saveCompanyWorkspace(workspaceId, workspace) {
  const key = `company:${workspaceId}`;
  const store = await getBlobStore();
  const payload = { ...workspace, id: workspaceId, updatedAt: new Date().toISOString() };
  await writeJson(store, key, payload, memoryCompanies);
  return payload;
}

async function getFoundingStats() {
  const store = await getBlobStore();
  return readJson(store, 'founding:stats', { ...memoryFounding });
}

async function incrementFoundingRedemption() {
  const store = await getBlobStore();
  const stats = await getFoundingStats();
  const next = { redemptions: (stats.redemptions || 0) + 1, updatedAt: new Date().toISOString() };
  memoryFounding.redemptions = next.redemptions;
  if (store) await store.setJSON('founding:stats', next);
  return next;
}

module.exports = {
  getEntitlement,
  saveEntitlement,
  getCompanyWorkspace,
  saveCompanyWorkspace,
  getFoundingStats,
  incrementFoundingRedemption,
  emailKey,
};
