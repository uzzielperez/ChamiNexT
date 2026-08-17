const memoryWorkspaces = new Map();

async function getBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'chaminext-studio', consistency: 'strong' });
  } catch {
    return null;
  }
}

function workspaceKey(ownerId, templateId) {
  return `workspace:${ownerId}:${templateId}`;
}

async function getWorkspace(ownerId, templateId) {
  const store = await getBlobStore();
  const key = workspaceKey(ownerId, templateId);
  if (store) {
    const data = await store.get(key, { type: 'json' });
    if (data) return data;
  }
  return memoryWorkspaces.get(key) || null;
}

async function saveWorkspace(ownerId, templateId, workspace) {
  const store = await getBlobStore();
  const key = workspaceKey(ownerId, templateId);
  memoryWorkspaces.set(key, workspace);
  if (store) await store.setJSON(key, workspace);
}

module.exports = { getWorkspace, saveWorkspace };
