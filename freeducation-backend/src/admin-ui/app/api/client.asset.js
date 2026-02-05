export async function requestJson(url, options, fallbackError) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || fallbackError || 'Request failed');
  }
  return data;
}

export async function requestVoid(url, options) {
  await fetch(url, options);
}
