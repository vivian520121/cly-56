import React, { useState } from "react";
import {
  Shirt,
  BookOpen,
  Box,
  Smartphone,
  Circle,
  Tablet,
  Laptop,
  BatteryCharging,
  Headphones,
  Search,
} from "lucide-react";
import { ItemTemplate, ItemCategory } from "@/types";
import { itemTemplates, categoryLabels } from "@/data/itemTemplates";
import { useAppStore } from "@/store/useAppStore";

const iconMap: Record<string, React.ElementType> = {
  shirt: Shirt,
  "book-open": BookOpen,
  box: Box,
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  "battery-charging": BatteryCharging,
  headphones: Headphones,
  circle: Circle,
};

export const ItemLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const setIsDraggingNew = useAppStore((state) => state.setIsDraggingNew);
  const setDragPreview = useAppStore((state) => state.setDragPreview);

  const categories: (ItemCategory | "all")[] = ["all", "clothing", "books", "misc", "electronics"];

  const filteredItems = itemTemplates.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, item: ItemTemplate) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleTouchStart = (e: React.TouchEvent, item: ItemTemplate) => {
    e.preventDefault();
    setIsDraggingNew(true);
    setDragPreview({
      width: item.width,
      height: item.height,
      color: item.color,
      name: item.name,
      icon: item.icon,
      x: -100,
      y: -100,
    });
  };

  return (
    <div className="w-full md:w-64 lg:w-72 bg-white border-r border-cream-200 flex flex-col h-full">
      <div className="p-4 border-b border-cream-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">收纳物件库</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="搜索物品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-3 border-b border-cream-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${activeCategory === cat
                ? "bg-sage-400 text-white"
                : "bg-cream-100 text-gray-600 hover:bg-cream-200"
              }
            `}
          >
            {cat === "all" ? "全部" : categoryLabels[cat as ItemCategory]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
          {filteredItems.map((item) => {
            const IconComponent = iconMap[item.icon] || Box;
            const previewSize = 32;
            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                className="bg-cream-50 rounded-xl p-2 md:p-3 cursor-grab active:cursor-grabbing hover:bg-cream-100 transition-all hover:shadow-soft active:scale-95 select-none touch-none"
              >
                <div
                  className="rounded-lg flex items-center justify-center mb-1 md:mb-2 mx-auto"
                  style={{
                    width: Math.min(item.width * 16, previewSize),
                    height: Math.min(item.height * 16, previewSize),
                    backgroundColor: item.color,
                  }}
                >
                  <IconComponent className="text-white/90" size={16} strokeWidth={1.5} />
                </div>
                <p className="text-xs text-center text-gray-700 font-medium truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-center text-gray-400 mt-0.5 hidden md:block">
                  {item.width}×{item.height}
                </p>
              </div>
            );
          })}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            未找到匹配的物品
          </div>
        )}
      </div>
    </div>
  );
};
