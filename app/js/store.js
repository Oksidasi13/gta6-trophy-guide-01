// Progress store: saved earned flags and per-trophy notes in localStorage,
// with export to a JSON file, import from a file, reset, and a fixed demo set.
export const STORAGE_KEY = 'gta6-trophy-guide-progress-v1';

// A fixed set of 13 earned trophies used only when ?demo=1 and no saved progress exists,
// so screenshots show a partly-filled tracker. The set is fixed on purpose: the same
// demo every time, so renders are deterministic.
export const DEMO_EARNED = [2, 3, 8, 15, 16, 21, 28, 35, 42, 44, 46, 53, 55];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: {}, notes: {} };
    const parsed = JSON.parse(raw);
    return { earned: parsed.earned || {}, notes: parsed.notes || {} };
  } catch {
    return { earned: {}, notes: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function earnedCount(progress) {
  return Object.values(progress.earned).filter(Boolean).length;
}

export function isEarned(progress, id) {
  return Boolean(progress.earned[id]);
}

export function toggleEarned(progress, id) {
  const next = { earned: { ...progress.earned }, notes: progress.notes };
  next.earned[id] = !next.earned[id];
  if (!next.earned[id]) delete next.earned[id];
  saveProgress(next);
  return next;
}

export function setNote(progress, id, text) {
  const next = { earned: progress.earned, notes: { ...progress.notes } };
  if (text.trim()) next.notes[id] = text;
  else delete next.notes[id];
  saveProgress(next);
  return next;
}

export function exportProgress(progress) {
  const blob = new Blob([JSON.stringify({ app: 'gta6-trophy-guide', version: 1, progress }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const progress = parsed.progress || parsed;
  const clean = { earned: {}, notes: {} };
  for (const [key, value] of Object.entries(progress.earned || {})) {
    if (value) clean.earned[Number(key)] = true;
  }
  for (const [key, value] of Object.entries(progress.notes || {})) {
    if (typeof value === 'string' && value.trim()) clean.notes[Number(key)] = value;
  }
  saveProgress(clean);
  return clean;
}

export function resetProgress() {
  const empty = { earned: {}, notes: {} };
  saveProgress(empty);
  return empty;
}

export function seedDemoIfNeeded(progress, demoRequested) {
  if (!demoRequested) return progress;
  if (earnedCount(progress) > 0 || Object.keys(progress.notes).length > 0) return progress;
  const seeded = { earned: {}, notes: {} };
  for (const id of DEMO_EARNED) seeded.earned[id] = true;
  saveProgress(seeded);
  return seeded;
}
