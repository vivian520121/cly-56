import React from "react";
import {
  Shirt,
  BookOpen,
  Box,
  Smartphone,
  Tablet,
  Laptop,
  BatteryCharging,
  Headphones,
  Star,
  Circle,
} from "lucide-react";
import { PlacedItem } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface ItemBlockProps {
  item: PlacedItem;
  cellSize: number;
  isSelected: boolean;
  hasCollision?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  shirt: Shirt,
  "book-open": BookOpen,
  box: Box,
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  "battery-charging": BatteryCharging,
  headphones: Headphones,
  star: Star,
  circle: Circle,
};

export const ItemBlock: React.FC<ItemBlockProps> = ({
  item,
  cellSize,
  isSelected,
  hasCollision = false,
}) => {
  const IconComponent = iconMap[item.icon] || Box;
  const selectItem = useAppStore((state) => state.selectItem);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(item.id);
  };

  return (
    <div
      className={`absolute rounded-lg shadow-soft flex flex-col items-center justify-center cursor-pointer transition-all duration-150 select-none
        ${isSelected ? "ring-2 ring-sage-400 ring-offset-2 z-10" : ""}
        ${hasCollision ? "ring-2 ring-red-400 animate-pulse" : ""}
      `}
      style={{
        left: item.x * cellSize,
        top: item.y * cellSize,
        width: item.width * cellSize - 4,
        height: item.height * cellSize - 4,
        margin: 2,
        backgroundColor: item.color,
      }}
      onClick={handleClick}
    >
      <IconComponent
        className="text-white/90 mb-1"
        size={Math.min(cellSize * 0.5, 24)}
        strokeWidth={1.5}
      />
      <span
        className="text-white text-xs font-medium truncate px-1 w-full text-center"
        style={{ fontSize: Math.max(10, cellSize * 0.22) }}
      >
        {item.name}
      </span>
    </div>
  );
};
