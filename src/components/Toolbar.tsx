import React, { useState } from "react";
import {
  Settings,
  Save,
  Download,
  FolderOpen,
  Grid3X3,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatDate } from "@/utils/collision";

interface ToolbarProps {
  onExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExport }) => {
  const {
    canvasConfig,
    setCanvasConfig,
    clearItems,
    layouts,
    currentLayoutId,
    saveCurrentLayout,
    loadLayout,
    deleteLayout,
  } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState("");
  const [tempWidth, setTempWidth] = useState(canvasConfig.width);
  const [tempHeight, setTempHeight] = useState(canvasConfig.height);
  const [tempCellSize, setTempCellSize] = useState(canvasConfig.cellSize);

  const handleOpenSettings = () => {
    setTempWidth(canvasConfig.width);
    setTempHeight(canvasConfig.height);
    setTempCellSize(canvasConfig.cellSize);
    setShowSettings(true);
  };

  const handleApplySettings = () => {
    setCanvasConfig({
      width: Math.max(2, Math.min(30, tempWidth)),
      height: Math.max(2, Math.min(30, tempHeight)),
      cellSize: Math.max(20, Math.min(80, tempCellSize)),
    });
    clearItems();
    setShowSettings(false);
  };

  const handleSaveLayout = () => {
    if (currentLayoutId) {
      const currentLayout = layouts.find((l) => l.id === currentLayoutId);
      setLayoutName(currentLayout?.name || "");
    }
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    if (layoutName.trim()) {
      saveCurrentLayout(layoutName.trim());
      setShowSaveDialog(false);
      setLayoutName("");
    }
  };

  const currentLayout = layouts.find((l) => l.id === currentLayoutId);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-cream-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-400 rounded-xl flex items-center justify-center shadow-soft">
            <Grid3X3 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-700">收纳格子规划</h1>
            {currentLayout && (
              <p className="text-xs text-gray-400 truncate max-w-[150px]">
                {currentLayout.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handleOpenSettings}
            className="p-2 md:px-3 md:py-2 rounded-xl hover:bg-cream-100 transition-colors flex items-center gap-1.5"
            title="画布设置"
          >
            <Settings size={18} className="text-gray-600" />
            <span className="hidden md:inline text-sm text-gray-600">设置</span>
          </button>

          <button
            onClick={() => setShowLayouts(true)}
            className="p-2 md:px-3 md:py-2 rounded-xl hover:bg-cream-100 transition-colors flex items-center gap-1.5"
            title="方案管理"
          >
            <FolderOpen size={18} className="text-gray-600" />
            <span className="hidden md:inline text-sm text-gray-600">方案</span>
          </button>

          <button
            onClick={handleSaveLayout}
            className="p-2 md:px-3 md:py-2 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors flex items-center gap-1.5"
            title="保存方案"
          >
            <Save size={18} className="text-sage-600" />
            <span className="hidden md:inline text-sm text-sage-600 font-medium">保存</span>
          </button>

          <button
            onClick={onExport}
            className="p-2 md:px-3 md:py-2 rounded-xl bg-clay-50 hover:bg-clay-100 transition-colors flex items-center gap-1.5"
            title="导出图片"
          >
            <Download size={18} className="text-clay-500" />
            <span className="hidden md:inline text-sm text-clay-600 font-medium">导出</span>
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-sm">
            <div className="p-4 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">画布设置</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  宽度（{canvasConfig.unit}）
                </label>
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={tempWidth}
                  onChange={(e) => setTempWidth(parseInt(e.target.value) || 2)}
                  className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  高度（{canvasConfig.unit}）
                </label>
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={tempHeight}
                  onChange={(e) => setTempHeight(parseInt(e.target.value) || 2)}
                  className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  格子大小（像素）
                </label>
                <input
                  type="range"
                  min={20}
                  max={80}
                  value={tempCellSize}
                  onChange={(e) => setTempCellSize(parseInt(e.target.value))}
                  className="w-full accent-sage-400"
                />
                <p className="text-xs text-gray-400 text-center mt-1">{tempCellSize}px</p>
              </div>
              <p className="text-xs text-gray-400 bg-cream-50 p-3 rounded-lg">
                ⚠️ 修改画布尺寸会清空当前布局
              </p>
            </div>
            <div className="p-4 border-t border-cream-200 flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-2.5 border border-cream-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleApplySettings}
                className="flex-1 py-2.5 bg-sage-400 text-white rounded-xl text-sm font-medium hover:bg-sage-500 transition-colors"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      {showLayouts && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">收纳方案</h3>
              <button
                onClick={() => setShowLayouts(false)}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {layouts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FolderOpen size={48} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">暂无保存的方案</p>
                  <p className="text-xs mt-1">点击「保存」按钮创建第一个方案</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {layouts.map((layout) => (
                    <div
                      key={layout.id}
                      className={`p-3 rounded-xl border transition-all cursor-pointer
                        ${currentLayoutId === layout.id
                          ? "border-sage-300 bg-sage-50"
                          : "border-cream-200 bg-white hover:border-cream-300"
                        }
                      `}
                      onClick={() => {
                        loadLayout(layout.id);
                        setShowLayouts(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{layout.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {layout.canvasConfig.width}×{layout.canvasConfig.height} · {layout.items.length} 个物品
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("确定删除这个方案吗？")) {
                              deleteLayout(layout.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">
                        更新于 {formatDate(layout.updatedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-cream-200">
              <button
                onClick={() => {
                  clearItems();
                  setShowLayouts(false);
                }}
                className="w-full py-2.5 border border-cream-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                新建空白方案
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-sm">
            <div className="p-4 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">保存方案</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="p-5">
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                方案名称
              </label>
              <input
                type="text"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirmSave()}
                placeholder="例如：夏季衣柜"
                autoFocus
                className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
              />
            </div>
            <div className="p-4 border-t border-cream-200 flex gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2.5 border border-cream-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!layoutName.trim()}
                className="flex-1 py-2.5 bg-sage-400 text-white rounded-xl text-sm font-medium hover:bg-sage-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
