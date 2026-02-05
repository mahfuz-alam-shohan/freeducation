export function getRoute() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'dashboard';
}

export function parseRoute() {
  const route = getRoute();
  const parts = route.split('/').filter(Boolean);
  const section = parts[0] || 'dashboard';
  return { route, parts, section };
}
