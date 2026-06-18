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
  isOutOfBounds?: boolean;
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
  isOutOfBounds = false,
}) => {
  const IconComponent = iconMap[item.icon] || Box;
  const selectItem = useAppStore((state) => state.selectItem);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectItem(item.id);
  };

  const blockWidth = item.width * cellSize - 4;
  const blockHeight = item.height * cellSize - 4;

  const useHorizontalLayout = blockHeight < cellSize * 1.2;

  const iconSize = useHorizontalLayout
    ? Math.min(blockHeight * 0.55, 20)
    : Math.min(blockHeight * 0.35, 24);

  const fontSize = useHorizontalLayout
    ? Math.max(9, Math.min(blockHeight * 0.35, 14))
    : Math.max(9, Math.min(blockHeight * 0.2, 14));

  const gapSize = useHorizontalLayout ? 4 : Math.max(2, blockHeight * 0.05);

  return (
    <div
      className={`absolute rounded-lg shadow-soft flex items-center justify-center cursor-pointer transition-all duration-150 select-none overflow-hidden
        ${isSelected ? "ring-2 ring-sage-400 ring-offset-2 z-10" : ""}
        ${hasCollision ? "ring-2 ring-red-400 animate-pulse" : ""}
        ${isOutOfBounds ? "ring-2 ring-orange-400 animate-pulse" : ""}
        ${useHorizontalLayout ? "flex-row px-2" : "flex-col px-1"}
      `}
      style={{
        left: item.x * cellSize,
        top: item.y * cellSize,
        width: blockWidth,
        height: blockHeight,
        margin: 2,
        backgroundColor: item.color,
        opacity: isOutOfBounds ? 0.5 : 1,
        gap: gapSize,
      }}
      onClick={handleClick}
    >
      <IconComponent
        className="text-white/90 flex-shrink-0"
        size={iconSize}
        strokeWidth={1.5}
      />
      <span
        className="text-white font-medium text-center leading-tight flex-shrink-0"
        style={{
          fontSize: fontSize,
          maxWidth: useHorizontalLayout ? blockWidth - iconSize - gapSize - 16 : "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: useHorizontalLayout ? "nowrap" : "normal",
          display: "-webkit-box",
          WebkitLineClamp: useHorizontalLayout ? 1 : 2,
          WebkitBoxOrient: "vertical",
          lineHeight: 1.1,
        }}
      >
        {item.name}
      </span>
    </div>
  );
};
