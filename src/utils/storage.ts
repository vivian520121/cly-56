import { Layout } from "@/types";

const STORAGE_KEY = "storage-layouts";

export function loadLayouts(): Layout[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load layouts from localStorage", e);
  }
  return [];
}

export function saveLayouts(layouts: Layout[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch (e) {
    console.error("Failed to save layouts to localStorage", e);
  }
}
