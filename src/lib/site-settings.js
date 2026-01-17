const themeOptions = [
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Warm cream with orange highlights.",
    palette: {
      bg: "#fff7ed",
      panel: "#ffffff",
      border: "#f1d5b8",
      text: "#1f2933",
      muted: "#6b7280",
      primary: "#f97316",
      accent: "#2563eb",
    },
  },
  {
    id: "midnight",
    name: "Midnight Ink",
    description: "Deep slate with gold accents.",
    palette: {
      bg: "#f3f4f6",
      panel: "#ffffff",
      border: "#d1d5db",
      text: "#111827",
      muted: "#4b5563",
      primary: "#111827",
      accent: "#f59e0b",
    },
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Cool blues with airy neutrals.",
    palette: {
      bg: "#eff6ff",
      panel: "#ffffff",
      border: "#bfdbfe",
      text: "#1e293b",
      muted: "#64748b",
      primary: "#2563eb",
      accent: "#0ea5e9",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens with soft light.",
    palette: {
      bg: "#f0fdf4",
      panel: "#ffffff",
      border: "#bbf7d0",
      text: "#064e3b",
      muted: "#6b7280",
      primary: "#15803d",
      accent: "#16a34a",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft violet with clean contrast.",
    palette: {
      bg: "#f5f3ff",
      panel: "#ffffff",
      border: "#ddd6fe",
      text: "#312e81",
      muted: "#6b7280",
      primary: "#7c3aed",
      accent: "#db2777",
    },
  },
  {
    id: "sunlit",
    name: "Sunlit Paper",
    description: "Bright paper with coral highlights.",
    palette: {
      bg: "#fffbeb",
      panel: "#ffffff",
      border: "#fde68a",
      text: "#7c2d12",
      muted: "#92400e",
      primary: "#ea580c",
      accent: "#f59e0b",
    },
  },
];

const defaultThemeId = "sunrise";

function getThemeById(themeId) {
  return themeOptions.find((theme) => theme.id === themeId) || themeOptions[0];
}

function getThemePalette(themeId) {
  return getThemeById(themeId || defaultThemeId).palette;
}

export { defaultThemeId, getThemeById, getThemePalette, themeOptions };
