import React, { useState } from "react";
import { firmwareFiles, BuildParams, AospFile } from "../data/firmwareFiles";
import { downloadSingleFile } from "../utils/zipExport";
import {
  FileCode,
  Copy,
  Check,
  Download,
  Search,
  Sliders,
  Settings2,
  FolderTree,
} from "lucide-react";

interface DeviceTreeTabProps {
  params: BuildParams;
  onUpdateParams: (newParams: Partial<BuildParams>) => void;
}

export const DeviceTreeTab: React.FC<DeviceTreeTabProps> = ({
  params,
  onUpdateParams,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copied, setCopied] = useState<boolean>(false);

  const filteredFiles = firmwareFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeFile: AospFile =
    filteredFiles[selectedFileIndex] || filteredFiles[0] || firmwareFiles[0];
  const fileContent = activeFile ? activeFile.getContent(params) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadSingleFile(activeFile.name, fileContent);
  };

  // Generate numbered lines for code viewer
  const lines = fileContent.split("\n");

  return (
    <div className="space-y-6">
      {/* Top Tuning Parameters Strip */}
      <section className="hud-panel rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Параметры компиляции Device Tree в реальном времени
            </h2>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            BOARDCONFIG & DEVICEMK LIVE SYNC
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Target Android Version */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <label className="text-slate-400 block font-medium">Версия AOSP:</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateParams({ androidVersion: "14 (Upside Down Cake)" })}
                className={`flex-1 py-1 px-1 rounded font-mono text-[10px] text-center transition-colors ${
                  params.androidVersion.includes("14")
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                A14
              </button>
              <button
                onClick={() => onUpdateParams({ androidVersion: "15 (Vanilla Ice Cream)" })}
                className={`flex-1 py-1 px-1 rounded font-mono text-[10px] text-center transition-colors ${
                  params.androidVersion.includes("15")
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                A15
              </button>
              <button
                onClick={() => onUpdateParams({ androidVersion: "16 (Baklava)" })}
                className={`flex-1 py-1 px-1 rounded font-mono text-[10px] text-center transition-colors ${
                  params.androidVersion.includes("16")
                    ? "bg-purple-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                A16
              </button>
            </div>
          </div>

          {/* Refresh Rate */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <label className="text-slate-400 block font-medium">Частота экрана (AMOLED):</label>
            <div className="flex items-center gap-1">
              {[60, 90, 120].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onUpdateParams({ refreshRate: rate })}
                  className={`flex-1 py-1 px-2 rounded font-mono text-center transition-colors ${
                    params.refreshRate === rate
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {rate}Hz
                </button>
              ))}
            </div>
          </div>

          {/* SELinux Mode */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <label className="text-slate-400 block font-medium">Режим безопасности SELinux:</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateParams({ selinuxMode: "enforcing" })}
                className={`flex-1 py-1 px-2 rounded font-mono text-center transition-colors ${
                  params.selinuxMode === "enforcing"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Enforcing
              </button>
              <button
                onClick={() => onUpdateParams({ selinuxMode: "permissive" })}
                className={`flex-1 py-1 px-2 rounded font-mono text-center transition-colors ${
                  params.selinuxMode === "permissive"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Permissive
              </button>
            </div>
          </div>

          {/* GPU Renderer */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <label className="text-slate-400 block font-medium">Рендерер Mali-G57 (HWUI):</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateParams({ gpuRenderer: "vulkan" })}
                className={`flex-1 py-1 px-2 rounded font-mono text-center transition-colors ${
                  params.gpuRenderer === "vulkan"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Vulkan 1.3
              </button>
              <button
                onClick={() => onUpdateParams({ gpuRenderer: "skiagl" })}
                className={`flex-1 py-1 px-2 rounded font-mono text-center transition-colors ${
                  params.gpuRenderer === "skiagl"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                OpenGL ES
              </button>
            </div>
          </div>

          {/* ZRAM & Gestures */}
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <label className="text-slate-400 block font-medium">Своп и пробуждение:</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdateParams({ enableDoubleTapWake: !params.enableDoubleTapWake })
                }
                className={`flex-1 py-1 px-2 rounded text-center transition-colors ${
                  params.enableDoubleTapWake
                    ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-medium"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                Тап-Wake: {params.enableDoubleTapWake ? "Вкл" : "Выкл"}
              </button>
              <button
                onClick={() => onUpdateParams({ enableZram: !params.enableZram })}
                className={`flex-1 py-1 px-2 rounded text-center transition-colors ${
                  params.enableZram
                    ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-medium"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                ZRAM: {params.enableZram ? "3GB" : "Выкл"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main File Explorer & Code View Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: File Tree & Filter */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Файлы прошивки</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {filteredFiles.length} файлов
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по файлам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-950 rounded-lg">
              {[
                { id: "all", label: "Все" },
                { id: "device_tree", label: "Дерево" },
                { id: "driver_hal", label: "HAL" },
                { id: "power", label: "Питание" },
                { id: "scripts", label: "Скрипты" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCategoryFilter(tab.id);
                    setSelectedFileIndex(0);
                  }}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    categoryFilter === tab.id
                      ? "bg-slate-800 text-white font-medium"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredFiles.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                    activeFile.path === file.path
                      ? "bg-blue-600/15 border border-blue-500/30 text-blue-300"
                      : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  <FileCode className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate text-slate-200">
                      {file.name}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                      {file.path}
                    </div>
                  </div>
                </button>
              ))}
              {filteredFiles.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">
                  Файлы не найдены
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Code Viewer */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col h-full">
            {/* Code Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                  {activeFile.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать файл</span>
                </button>
              </div>
            </div>

            {/* File Description Banner */}
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{activeFile.description}</span>
            </div>

            {/* Code View with Line Numbers */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                      <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top tabular-nums">
                        {i + 1}
                      </td>
                      <td className="text-slate-300 whitespace-pre font-mono">
                        {line}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
