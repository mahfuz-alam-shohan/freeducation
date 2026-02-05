export function mediaUrl(key) {
  return `/api/v1/admin/media?key=${encodeURIComponent(key)}`;
}

export function sortNodes(nodes) {
  return [...nodes].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    const aName = a.displayName || a.serverName || '';
    const bName = b.displayName || b.serverName || '';
    return aName.localeCompare(bName);
  });
}

export function getNodeById(nodes, id) {
  return nodes.find((node) => node.id === id) || null;
}

export function getChildNodes(nodes, parentId) {
  return nodes.filter((node) => node.parentId === parentId);
}

export function isChaptersNode(node) {
  if (!node) return false;
  return node.nodeKey.endsWith('_CHAPTERS') || node.serverName === 'Chapters';
}

export function isTopicsNode(node) {
  if (!node) return false;
  return node.nodeKey.endsWith('_TOPICS') || node.serverName === 'Topics';
}

export function getTopicsNode(nodes, chaptersNode) {
  if (!chaptersNode) return null;
  const children = getChildNodes(nodes, chaptersNode.id);
  return children.find((node) => isTopicsNode(node)) || null;
}

export function getSoloChaptersChild(nodes, parentId) {
  const children = getChildNodes(nodes, parentId);
  if (children.length !== 1) return null;
  return isChaptersNode(children[0]) ? children[0] : null;
}

export function getChaptersBackNode(nodes, chaptersNode) {
  if (!chaptersNode || !chaptersNode.parentId) return null;
  const parent = getNodeById(nodes, chaptersNode.parentId);
  if (!parent) return null;
  const soloChild = getSoloChaptersChild(nodes, parent.id);
  if (soloChild && soloChild.id === chaptersNode.id) {
    return parent.parentId ? getNodeById(nodes, parent.parentId) : null;
  }
  return parent;
}
