import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { ItemLibrary } from "@/components/ItemLibrary";
import { Canvas } from "@/components/Canvas";
import { PropertyPanel } from "@/components/PropertyPanel";
import { useAppStore } from "@/store/useAppStore";
import { downloadLayoutImage } from "@/utils/exportImage";

export default function Home() {
  const { currentLayoutId, layouts } = useAppStore();
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const currentLayout = layouts.find((l) => l.id === currentLayoutId);
  const layoutName = currentLayout?.name || "收纳布局";

  const handleExport = async () => {
    const canvasElement = document.getElementById("layout-canvas");
    if (canvasElement) {
      try {
        await downloadLayoutImage(canvasElement, layoutName);
      } catch {
        alert("导出失败，请重试");
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-cream-100">
      <Toolbar onExport={handleExport} />

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <ItemLibrary />
        </div>

        <Canvas />

        <div className="hidden md:block">
          <PropertyPanel />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 p-3 flex justify-around z-20">
        <button
          onClick={() => setShowMobileLibrary(true)}
          className="flex flex-col items-center gap-1 text-gray-600"
        >
          <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
            <span className="text-lg">📦</span>
          </div>
          <span className="text-xs">物件库</span>
        </button>
        <button
          onClick={() => setShowMobilePanel(true)}
          className="flex flex-col items-center gap-1 text-gray-600"
        >
          <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
            <span className="text-lg">⚙️</span>
          </div>
          <span className="text-xs">属性</span>
        </button>
      </div>

      {showMobileLibrary && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setShowMobileLibrary(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">收纳物件库</h3>
              <button
                onClick={() => setShowMobileLibrary(false)}
                className="p-2 hover:bg-cream-100 rounded-lg"
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <ItemLibrary />
            </div>
          </div>
        </div>
      )}

      {showMobilePanel && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setShowMobilePanel(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[60vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-cream-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">物品属性</h3>
              <button
                onClick={() => setShowMobilePanel(false)}
                className="p-2 hover:bg-cream-100 rounded-lg"
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[50vh]">
              <PropertyPanel />
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden h-20" />
    </div>
  );
}
