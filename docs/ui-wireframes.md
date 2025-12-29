# Mobile-first UI Wireframes (Low-bandwidth)

These wireframes focus on fast reading, offline-friendly behavior, and minimal taps for core actions.

## 1) Chapter Reading (mobile-first)

```
┌──────────────────────────────────────┐
│ Status bar                            │
├──────────────────────────────────────┤
│ ← Back        Chapter 3: Fractions   │
│ [A↓] Text size    [⋯]                │
├──────────────────────────────────────┤
│ Progress: 35% ▓▓▓▓▓░░░░               │
│ [Download for offline] (small text)  │
├──────────────────────────────────────┤
│ Section title                         │
│                                      │
│ Paragraph text…                       │
│                                      │
│ Diagram thumbnail (tap to open)       │
│ [lightweight image placeholder]       │
│                                      │
│ Paragraph text…                       │
│                                      │
│ Key terms (chips):                    │
│ • numerator • denominator             │
│                                      │
│ [Next section →]                      │
├──────────────────────────────────────┤
│ Bottom bar:                            │
│ [Highlight] [Notes] [Practice]        │
└──────────────────────────────────────┘
```

**Low-bandwidth notes**
- Inline images load only when tapped; show small placeholders first.
- Cache plain text and progress locally; update server when online.
- Single-column layout, large tap targets, no infinite scroll.

---

## 2) Highlighting + Notes (mobile-first)

```
┌──────────────────────────────────────┐
│ ← Back        Chapter 3: Fractions   │
│ [Done]                               │
├──────────────────────────────────────┤
│ Reading view (selection mode)        │
│                                      │
│ “The numerator tells how many parts” │
│  └─ highlighted segment              │
│                                      │
│ Context menu (compact):              │
│ [Highlight] [Note] [Copy]             │
├──────────────────────────────────────┤
│ Note drawer (slides up)              │
│ Title (optional)                     │
│ [_______________________]            │
│ Note text (autosave)                 │
│ [_______________________]            │
│ [Save] [Cancel]                      │
├──────────────────────────────────────┤
│ Highlights list (collapsed)          │
│ • “numerator tells…”                 │
│ • “denominator is…”                  │
└──────────────────────────────────────┘
```

**Low-bandwidth notes**
- Autosave notes locally; sync later.
- Use compact context menu to avoid overlays.
- Store highlights as text offsets to minimize payload.

---

## 3) Practice CTA (mobile-first)

```
┌──────────────────────────────────────┐
│ ← Back        Chapter 3: Fractions   │
├──────────────────────────────────────┤
│ Progress: 80% ▓▓▓▓▓▓▓▓░               │
│ “You’re ready to practice.”          │
│                                      │
│ [Start 5-question practice]          │
│  (approx. 3 minutes)                 │
│                                      │
│ Secondary actions:                   │
│ [Review highlights]                  │
│ [Save for later]                     │
├──────────────────────────────────────┤
│ Tips (lightweight text):             │
│ • Works offline after 1st load       │
│ • Results sync when online           │
└──────────────────────────────────────┘
```

**Low-bandwidth notes**
- Keep CTA as a single button, no modal gating.
- Preload only the first question; lazy-load the rest.
- Show estimated time and offline behavior to reduce friction.

---

## Shared Components & Behavior
- **Top bar:** back, title, overflow menu.
- **Bottom bar:** Highlight, Notes, Practice.
- **Typography:** large, high-contrast, line-height ≥ 1.5.
- **Offline-first:** cache last read section, notes, and highlights.
- **Media:** use placeholders + tap-to-load images/diagrams.
- **Accessibility:** consistent focus states and 44px tap targets.
