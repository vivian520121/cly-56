import React, { useRef, useState, useCallback, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ItemBlock } from "./ItemBlock";
import { snapToGrid, checkCollision } from "@/utils/collision";
import { PlacedItem } from "@/types";

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    canvasConfig,
    items,
    selectedItemId,
    selectItem,
    moveItem,
    addItem,
    dragPreview,
    setDragPreview,
    isDraggingNew,
    setIsDraggingNew,
  } = useAppStore();

  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);

  const { width, height, cellSize } = canvasConfig;

  const getMousePosition = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0]?.clientX || 0;
        clientY = e.touches[0]?.clientY || 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const handleCanvasClick = () => {
    selectItem(null);
  };

  const handleItemMouseDown = (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const pos = getMousePosition(e);
    setDraggingItemId(itemId);
    setDragOffset({
      x: pos.x - item.x * cellSize,
      y: pos.y - item.y * cellSize,
    });
    selectItem(itemId);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const pos = getMousePosition(e);

      if (draggingItemId) {
        const newX = Math.max(0, Math.min(pos.x - dragOffset.x, (width - 1) * cellSize));
        const newY = Math.max(0, Math.min(pos.y - dragOffset.y, (height - 1) * cellSize));
        const snapped = snapToGrid(newX, newY, cellSize);

        const item = items.find((i) => i.id === draggingItemId);
        if (item) {
          const testItem = { ...item, x: snapped.x, y: snapped.y };
          const collision = checkCollision(testItem, items, canvasConfig);
          if (!collision.isOutOfBounds) {
            setTempPosition(snapped);
          }
        }
      }

      if (isDraggingNew && dragPreview) {
        const newX = pos.x - (dragPreview.width * cellSize) / 2;
        const newY = pos.y - (dragPreview.height * cellSize) / 2;
        const snapped = snapToGrid(newX, newY, cellSize);
        setDragPreview({ ...dragPreview, x: snapped.x, y: snapped.y });
      }
    },
    [draggingItemId, dragOffset, isDraggingNew, dragPreview, items, canvasConfig, width, height, cellSize, getMousePosition, setDragPreview]
  );

  const handleMouseUp = useCallback(() => {
    if (draggingItemId && tempPosition) {
      const item = items.find((i) => i.id === draggingItemId);
      if (item) {
        const testItem = { ...item, x: tempPosition.x, y: tempPosition.y };
        const collision = checkCollision(testItem, items, canvasConfig);
        if (!collision.hasCollision) {
          moveItem(draggingItemId, tempPosition.x, tempPosition.y);
        }
      }
    }

    if (isDraggingNew && dragPreview) {
      const testItem: PlacedItem = {
        id: "temp",
        itemId: "temp",
        x: dragPreview.x,
        y: dragPreview.y,
        width: dragPreview.width,
        height: dragPreview.height,
        name: dragPreview.name,
        color: dragPreview.color,
        icon: dragPreview.icon,
      };
      const collision = checkCollision(testItem, items, canvasConfig);
      if (!collision.hasCollision && !collision.isOutOfBounds) {
        addItem({
          itemId: "custom",
          x: dragPreview.x,
          y: dragPreview.y,
          width: dragPreview.width,
          height: dragPreview.height,
          name: dragPreview.name,
          color: dragPreview.color,
          icon: dragPreview.icon,
        });
      }
      setDragPreview(null);
      setIsDraggingNew(false);
    }

    setDraggingItemId(null);
    setTempPosition(null);
  }, [draggingItemId, tempPosition, isDraggingNew, dragPreview, items, canvasConfig, moveItem, addItem, setDragPreview, setIsDraggingNew]);

  useEffect(() => {
    if (draggingItemId || isDraggingNew) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove as EventListener);
      window.addEventListener("touchend", handleMouseUp as EventListener);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove as EventListener);
      window.removeEventListener("touchend", handleMouseUp as EventListener);
    };
  }, [draggingItemId, isDraggingNew, handleMouseMove, handleMouseUp]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const itemData = JSON.parse(data);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - (itemData.width * cellSize) / 2;
    const y = e.clientY - rect.top - (itemData.height * cellSize) / 2;
    const snapped = snapToGrid(x, y, cellSize);

    const testItem: PlacedItem = {
      id: "temp",
      itemId: itemData.id,
      x: snapped.x,
      y: snapped.y,
      width: itemData.width,
      height: itemData.height,
      name: itemData.name,
      color: itemData.color,
      icon: itemData.icon,
    };

    const collision = checkCollision(testItem, items, canvasConfig);
    if (!collision.hasCollision && !collision.isOutOfBounds) {
      addItem({
        itemId: itemData.id,
        x: snapped.x,
        y: snapped.y,
        width: itemData.width,
        height: itemData.height,
        name: itemData.name,
        color: itemData.color,
        icon: itemData.icon,
      });
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            className="border border-cream-200/60"
            style={{
              position: "absolute",
              left: x * cellSize,
              top: y * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          />
        );
      }
    }
    return cells;
  };

  const getDisplayItems = () => {
    return items.map((item) => {
      const isDragging = draggingItemId === item.id && tempPosition;
      const displayItem = isDragging ? { ...item, x: tempPosition.x, y: tempPosition.y } : item;

      const collision = checkCollision(displayItem, items, canvasConfig);

      return (
        <div
          key={item.id}
          onMouseDown={(e) => handleItemMouseDown(e, item.id)}
          onTouchStart={(e) => handleItemMouseDown(e, item.id)}
          className={isDragging ? "opacity-80" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            cursor: draggingItemId === item.id ? "grabbing" : "grab",
            touchAction: "none",
          }}
        >
          <ItemBlock
            item={displayItem}
            cellSize={cellSize}
            isSelected={selectedItemId === item.id}
            hasCollision={isDragging && collision.hasCollision && collision.collidingItemIds.length > 0}
          />
        </div>
      );
    });
  };

  const renderDragPreview = () => {
    if (!isDraggingNew || !dragPreview) return null;

    const testItem: PlacedItem = {
      id: "preview",
      itemId: "preview",
      x: dragPreview.x,
      y: dragPreview.y,
      width: dragPreview.width,
      height: dragPreview.height,
      name: dragPreview.name,
      color: dragPreview.color,
      icon: dragPreview.icon,
    };

    const collision = checkCollision(testItem, items, canvasConfig);

    return (
      <div
        className="absolute pointer-events-none opacity-60 z-20"
        style={{
          left: dragPreview.x * cellSize,
          top: dragPreview.y * cellSize,
        }}
      >
        <ItemBlock
          item={testItem}
          cellSize={cellSize}
          isSelected={false}
          hasCollision={collision.hasCollision || collision.isOutOfBounds}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
      <div
        ref={canvasRef}
        id="layout-canvas"
        className="relative bg-white rounded-2xl shadow-card border border-cream-200"
        style={{
          width: width * cellSize,
          height: height * cellSize,
          minWidth: width * cellSize,
          minHeight: height * cellSize,
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderGrid()}
        {getDisplayItems()}
        {renderDragPreview()}
      </div>
    </div>
  );
};
