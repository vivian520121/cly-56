import { PlacedItem, CanvasConfig, CollisionResult } from "@/types";

export function snapToGrid(
  x: number,
  y: number,
  cellSize: number
): { x: number; y: number } {
  return {
    x: Math.round(x / cellSize),
    y: Math.round(y / cellSize),
  };
}

export function checkCollision(
  item: PlacedItem,
  items: PlacedItem[],
  canvasConfig: CanvasConfig
): CollisionResult {
  const result: CollisionResult = {
    hasCollision: false,
    isOutOfBounds: false,
    collidingItemIds: [],
  };

  if (
    item.x < 0 ||
    item.y < 0 ||
    item.x + item.width > canvasConfig.width ||
    item.y + item.height > canvasConfig.height
  ) {
    result.isOutOfBounds = true;
    result.hasCollision = true;
  }

  for (const other of items) {
    if (other.id === item.id) continue;

    if (
      item.x < other.x + other.width &&
      item.x + item.width > other.x &&
      item.y < other.y + other.height &&
      item.y + item.height > other.y
    ) {
      result.hasCollision = true;
      result.collidingItemIds.push(other.id);
    }
  }

  return result;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
