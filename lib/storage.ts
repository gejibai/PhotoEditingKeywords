import type { SavedBuilderState } from "@/types/prompt";

const STORAGE_KEY = "photoEditingKeywordsMvp";

export function loadSavedState(): SavedBuilderState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedBuilderState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: SavedBuilderState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
