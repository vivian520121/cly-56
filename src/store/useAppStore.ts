import { create } from "zustand";
import { CanvasConfig, PlacedItem, Layout } from "@/types";
import { generateId } from "@/utils/collision";
import { loadLayouts, saveLayouts } from "@/utils/storage";

interface AppState {
  canvasConfig: CanvasConfig;
  items: PlacedItem[];
  selectedItemId: string | null;
  layouts: Layout[];
  currentLayoutId: string | null;
  isDraggingNew: boolean;
  dragPreview: {
    width: number;
    height: number;
    color: string;
    name: string;
    icon: string;
    x: number;
    y: number;
  } | null;
  collisionWarning: {
    show: boolean;
    type: "collision" | "outOfBounds" | null;
    message: string;
  };

  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
  addItem: (item: Omit<PlacedItem, "id">) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, x: number, y: number) => void;
  updateItem: (id: string, updates: Partial<PlacedItem>) => void;
  selectItem: (id: string | null) => void;
  clearItems: () => void;

  setDragPreview: (preview: AppState["dragPreview"]) => void;
  setIsDraggingNew: (dragging: boolean) => void;
  setCollisionWarning: (warning: AppState["collisionWarning"]) => void;

  saveCurrentLayout: (name: string) => void;
  loadLayout: (id: string) => void;
  deleteLayout: (id: string) => void;
  updateLayoutName: (id: string, name: string) => void;
}

const defaultCanvasConfig: CanvasConfig = {
  width: 10,
  height: 8,
  cellSize: 50,
  unit: "格",
};

export const useAppStore = create<AppState>((set, get) => ({
  canvasConfig: defaultCanvasConfig,
  items: [],
  selectedItemId: null,
  layouts: loadLayouts(),
  currentLayoutId: null,
  isDraggingNew: false,
  dragPreview: null,
  collisionWarning: {
    show: false,
    type: null,
    message: "",
  },

  setCanvasConfig: (config) =>
    set((state) => ({
      canvasConfig: { ...state.canvasConfig, ...config },
    })),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: generateId() }],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    })),

  moveItem: (id, x, y) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, x, y } : i)),
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  selectItem: (id) => set({ selectedItemId: id }),

  clearItems: () => set({ items: [], selectedItemId: null }),

  setDragPreview: (preview) => set({ dragPreview: preview }),

  setIsDraggingNew: (dragging) =>
    set({
      isDraggingNew: dragging,
      collisionWarning: dragging
        ? get().collisionWarning
        : { show: false, type: null, message: "" },
    }),

  setCollisionWarning: (warning) => set({ collisionWarning: warning }),

  saveCurrentLayout: (name) => {
    const state = get();
    const now = Date.now();

    if (state.currentLayoutId) {
      const updatedLayouts = state.layouts.map((l) =>
        l.id === state.currentLayoutId
          ? {
              ...l,
              name,
              canvasConfig: { ...state.canvasConfig },
              items: [...state.items],
              updatedAt: now,
            }
          : l
      );
      set({ layouts: updatedLayouts });
      saveLayouts(updatedLayouts);
    } else {
      const newLayout: Layout = {
        id: generateId(),
        name,
        canvasConfig: { ...state.canvasConfig },
        items: [...state.items],
        createdAt: now,
        updatedAt: now,
      };
      const updatedLayouts = [...state.layouts, newLayout];
      set({
        layouts: updatedLayouts,
        currentLayoutId: newLayout.id,
      });
      saveLayouts(updatedLayouts);
    }
  },

  loadLayout: (id) => {
    const state = get();
    const layout = state.layouts.find((l) => l.id === id);
    if (layout) {
      set({
        canvasConfig: { ...layout.canvasConfig },
        items: [...layout.items],
        currentLayoutId: id,
        selectedItemId: null,
      });
    }
  },

  deleteLayout: (id) => {
    const state = get();
    const updatedLayouts = state.layouts.filter((l) => l.id !== id);
    set({
      layouts: updatedLayouts,
      currentLayoutId: state.currentLayoutId === id ? null : state.currentLayoutId,
    });
    saveLayouts(updatedLayouts);
  },

  updateLayoutName: (id, name) => {
    const state = get();
    const updatedLayouts = state.layouts.map((l) =>
      l.id === id ? { ...l, name, updatedAt: Date.now() } : l
    );
    set({ layouts: updatedLayouts });
    saveLayouts(updatedLayouts);
  },
}));
