import React, { useState, useEffect } from "react";
import { Trash2, X, Edit3, Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const PropertyPanel: React.FC = () => {
  const { selectedItemId, items, updateItem, removeItem, canvasConfig } = useAppStore();
  const [editName, setEditName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  useEffect(() => {
    if (selectedItem) {
      setEditName(selectedItem.name);
    }
  }, [selectedItem]);

  if (!selectedItem) {
    return (
      <div className="w-full md:w-64 lg:w-72 bg-white border-l border-cream-200 p-4 flex flex-col items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Edit3 size={24} className="text-cream-400" />
          </div>
          <p className="text-sm">点击画布中的物品</p>
          <p className="text-xs mt-1">查看和编辑属性</p>
        </div>
      </div>
    );
  }

  const handleNameSubmit = () => {
    if (editName.trim()) {
      updateItem(selectedItem.id, { name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    const newValue = Math.max(1, Math.min(value, canvasConfig[dimension]));
    updateItem(selectedItem.id, { [dimension]: newValue });
  };

  return (
    <div className="w-full md:w-64 lg:w-72 bg-white border-l border-cream-200 flex flex-col h-full">
      <div className="p-4 border-b border-cream-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">物品属性</h3>
        <button
          onClick={() => updateItem(selectedItem.id, {})}
          className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">物品名称</label>
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                autoFocus
                className="flex-1 px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
              />
              <button
                onClick={handleNameSubmit}
                className="p-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-cream-100 transition-colors flex items-center justify-between"
            >
              <span>{selectedItem.name}</span>
              <Edit3 size={14} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-3 bg-cream-50 rounded-xl">
          <div
            className="rounded-lg mx-auto mb-3 flex items-center justify-center"
            style={{
              width: Math.min(selectedItem.width * 25, 100),
              height: Math.min(selectedItem.height * 25, 100),
              backgroundColor: selectedItem.color,
            }}
          >
            <span className="text-white text-xs font-medium">预览</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            {selectedItem.width} × {selectedItem.height} {canvasConfig.unit}
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">宽度</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={canvasConfig.width}
              value={selectedItem.width}
              onChange={(e) => handleSizeChange("width", parseInt(e.target.value))}
              className="flex-1 accent-sage-400"
            />
            <span className="text-sm text-gray-600 w-10 text-right">
              {selectedItem.width}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">高度</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={canvasConfig.height}
              value={selectedItem.height}
              onChange={(e) => handleSizeChange("height", parseInt(e.target.value))}
              className="flex-1 accent-sage-400"
            />
            <span className="text-sm text-gray-600 w-10 text-right">
              {selectedItem.height}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">位置</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-cream-50 rounded-lg text-center">
              <span className="text-xs text-gray-400">X</span>
              <p className="text-sm font-medium text-gray-700">{selectedItem.x}</p>
            </div>
            <div className="p-2 bg-cream-50 rounded-lg text-center">
              <span className="text-xs text-gray-400">Y</span>
              <p className="text-sm font-medium text-gray-700">{selectedItem.y}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-cream-200">
        <button
          onClick={() => removeItem(selectedItem.id)}
          className="w-full py-2.5 bg-red-50 text-red-500 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          删除物品
        </button>
      </div>
    </div>
  );
};
