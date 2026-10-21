import React, { useState } from "react";
import { Header, TabKey } from "./components/Header";
import { OverviewTab } from "./components/OverviewTab";
import { DeviceTreeTab } from "./components/DeviceTreeTab";
import { DriversTab } from "./components/DriversTab";
import { PowerOptimizerTab } from "./components/PowerOptimizerTab";
import { AppsCompatibilityTab } from "./components/AppsCompatibilityTab";
import { FastbootTab } from "./components/FastbootTab";
import { ExportModal } from "./components/ExportModal";
import { defaultBuildParams, BuildParams } from "./data/firmwareFiles";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [buildParams, setBuildParams] = useState<BuildParams>(defaultBuildParams);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const updateBuildParams = (newParams: Partial<BuildParams>) => {
    setBuildParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 cyber-grid-bg radar-glow">
      {/* Top Bar with 3-Zone Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportClick={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            params={buildParams}
            onNavigateTab={setActiveTab}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === "tree" && (
          <DeviceTreeTab
            params={buildParams}
            onUpdateParams={updateBuildParams}
          />
        )}

        {activeTab === "drivers" && (
          <DriversTab
            params={buildParams}
            onUpdateParams={updateBuildParams}
          />
        )}

        {activeTab === "power" && (
          <PowerOptimizerTab
            params={buildParams}
            onUpdateParams={updateBuildParams}
          />
        )}

        {activeTab === "apps" && (
          <AppsCompatibilityTab
            params={buildParams}
            onUpdateParams={updateBuildParams}
          />
        )}

        {activeTab === "fastboot" && (
          <FastbootTab params={buildParams} />
        )}
      </main>

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">
              TECNO SPARK 40 PRO+ AOSP Studio
            </span>
            <span aria-hidden="true">·</span>
            <span>MediaTek Helio G100 (MT6789)</span>
            <span aria-hidden="true">·</span>
            <span>AOSP Android 14 Base</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Dynamic Super Partition</span>
            <span aria-hidden="true">·</span>
            <span>EAS Schedutil PowerHAL</span>
            <span aria-hidden="true">·</span>
            <span>Mali-G57 Vulkan 1.3</span>
          </div>
        </div>
      </footer>

      {/* Export Device Tree Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        params={buildParams}
      />
    </div>
  );
}
