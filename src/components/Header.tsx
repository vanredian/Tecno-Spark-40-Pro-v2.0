import React from "react";
import { Download, Cpu } from "lucide-react";

export type TabKey = "overview" | "tree" | "drivers" | "power" | "apps" | "fastboot";

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onExportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onExportClick,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark with cyber branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              onTabChange("overview");
            }}
            className="text-base font-bold tracking-tight text-white whitespace-nowrap hover:text-cyan-400 transition-colors"
          >
            TECNO SPARK 40 PRO+ <span className="text-cyan-400 font-mono text-xs font-normal">AOSP STUDIO</span>
          </a>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => onTabChange("overview")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "overview"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Обзор платформы
          </button>
          <button
            onClick={() => onTabChange("tree")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "tree"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Дерево файлов
          </button>
          <button
            onClick={() => onTabChange("drivers")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "drivers"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Модули драйверов
          </button>
          <button
            onClick={() => onTabChange("power")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "power"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Энергосбережение
          </button>
          <button
            onClick={() => onTabChange("apps")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "apps"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Приложения (MicroG)
          </button>
          <button
            onClick={() => onTabChange("fastboot")}
            className={`transition-all whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "fastboot"
                ? "text-cyan-400 border-cyan-400"
                : "border-transparent hover:text-slate-200"
            }`}
          >
            Fastboot Flasher
          </button>
        </nav>

        {/* Zone 3: 1 primary action with futuristic cyber look */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] rounded-lg shadow-sm shadow-cyan-400/20 transition-all whitespace-nowrap font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Скачать Device Tree (.zip)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
