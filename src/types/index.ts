export interface CanvasConfig {
  width: number;
  height: number;
  cellSize: number;
  unit: string;
}

export interface ItemTemplate {
  id: string;
  name: string;
  category: ItemCategory;
  width: number;
  height: number;
  color: string;
  icon: string;
}

export interface PlacedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
  icon: string;
}

export interface Layout {
  id: string;
  name: string;
  canvasConfig: CanvasConfig;
  items: PlacedItem[];
  createdAt: number;
  updatedAt: number;
}

export type ItemCategory = "clothing" | "books" | "misc" | "electronics";

export interface CollisionResult {
  hasCollision: boolean;
  isOutOfBounds: boolean;
  collidingItemIds: string[];
}
