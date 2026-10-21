import React, { useState } from "react";
import { Cpu, Zap, Activity, Layers, Monitor, Wifi, ShieldAlert } from "lucide-react";
import { BuildParams } from "../data/firmwareFiles";

interface FuturisticSiliconDieProps {
  params: BuildParams;
}

export const FuturisticSiliconDie: React.FC<FuturisticSiliconDieProps> = ({
  params,
}) => {
  const [activeBlock, setActiveBlock] = useState<string>("big_cores");

  const blocks: Record<
    string,
    {
      title: string;
      subtitle: string;
      specs: string;
      clock: string;
      status: string;
      details: string;
      power: string;
    }
  > = {
    big_cores: {
      title: "Cortex-A76 Кластер (2 ядра)",
      subtitle: "Высокопроизводительные ядра ARMv8.2-A",
      specs: "2x 512KB L2 кэш, 2MB общий L3",
      clock: "2.20 GHz",
      status:
        params.powerProfile === "battery_saver"
          ? "CorePilot Idle (Парковка в простое)"
          : "EAS Schedutil Active",
      details:
        "Активируются при тяжелых вычислениях, запуске приложений и играх. В режиме глубокого сна отключаются для экономии батареи.",
      power: params.powerProfile === "battery_saver" ? "0.15 W (Idle)" : "1.85 W (Peak)",
    },
    little_cores: {
      title: "Cortex-A55 Кластер (6 ядер)",
      subtitle: "Энергоэффективные ядра ARMv8.2-A",
      specs: "6x 128KB L2 кэш, энергосберегающая шина",
      clock: "2.00 GHz",
      status: "EAS Default Handler",
      details:
        "Обрабатывают 90% фоновых процессов AOSP, мессенджеры, системный интерфейс и воспроизведение аудио.",
      power: "0.28 W (Continuous)",
    },
    mali_gpu: {
      title: "ARM Mali-G57 MC2 GPU",
      subtitle: "Графический ускоритель Valhall Architecture",
      specs: "2 Execution Engines, Vulkan 1.3 ICD, OpenGL ES 3.2",
      clock: "950 MHz",
      status: `${params.gpuRenderer.toUpperCase()} Pipeline Active`,
      details:
        "Аппаратный рендеринг интерфейса SurfaceFlinger и 3D игр с прямым доступом к памяти через Gralloc 4.",
      power: "1.10 W (120 FPS Rendering)",
    },
    display_engine: {
      title: "AMOLED 120Hz Display Processor",
      subtitle: "Контроллер аппаратного компоновщика HWC 2.4",
      specs: "1080 x 2436 @ 120Hz, 10-bit HDR10+, 2160Hz PWM",
      clock: "8.33 ms Frame Budget",
      status: `Active @ ${params.refreshRate} Hz`,
      details:
        "Обеспечивает плавное динамическое переключение частоты кадров без разрывов (VSYNC) и безмерцающее затемнение.",
      power: "0.45 W",
    },
    modem_rf: {
      title: "MT6631 Wi-Fi & Bluetooth 5.3",
      subtitle: "Интегрированный беспроводной радиочастотный модуль",
      specs: "802.11 a/b/g/n/ac 2.4/5GHz, BLE, LDAC 990kbps",
      clock: "Dual-Band 2x2 MIMO",
      status: "Power Save Polling Active",
      details:
        "Драйвер wlan_drv_gen4m.ko с аппаратным оффлоадингом сетевых пакетов для минимизации пробуждений CPU.",
      power: "0.18 W",
    },
    memory_bus: {
      title: "LPDDR4X & UFS 2.2 Memory Controller",
      subtitle: "Высокоскоростная шина данных и DMA-контроллер",
      specs: "4266 MT/s LPDDR4X, ZRAM Swap " + (params.enableZram ? "3GB" : "OFF"),
      clock: "17.0 GB/s Bandwidth",
      status: "Inline Crypt AES-256 Enabled",
      details:
        "Прямой DMA-обмен буферов между камерой, графическим процессором и динамическим разделом Super.",
      power: "0.32 W",
    },
  };

  const current = blocks[activeBlock] || blocks.big_cores;

  return (
    <div className="hud-panel hud-corner rounded-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SILICON BLUEPRINT · 6NM FINFET</span>
            <span aria-hidden="true">·</span>
            <span>MEDIATEK HELIO G100</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Интерактивная архитектура кристалла MT6789
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            AOSP 14 KERNEL 5.15
          </span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            THERMAL: 34.2°C NOMINAL
          </span>
        </div>
      </div>

      {/* Grid: Interactive Silicon Die on Left, Telemetry Readout on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Die Schematic */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-cyan-500/20 relative overflow-hidden">
          {/* Subtle Cyber Grid Lines */}
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

          <div className="relative space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
              <span>DIE AREA: ~82 mm²</span>
              <span>TSMC 6NM EUV PROCESS</span>
            </div>

            {/* Row 1: Big Cores & LITTLE Cores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Big Cores Block */}
              <button
                onClick={() => setActiveBlock("big_cores")}
                className={`p-4 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "big_cores"
                    ? "bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-400 font-bold">2x Cortex-A76</span>
                  <span className="text-slate-400 tabular-nums">2.20 GHz</span>
                </div>
                <div className="text-xs text-slate-200 font-medium">Big Cluster (High Perf)</div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>EAS Schedutil</span>
                  <span className="text-cyan-400 group-hover:underline">Инфо &gt;</span>
                </div>
              </button>

              {/* Little Cores Block */}
              <button
                onClick={() => setActiveBlock("little_cores")}
                className={`p-4 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "little_cores"
                    ? "bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-blue-400 font-bold">6x Cortex-A55</span>
                  <span className="text-slate-400 tabular-nums">2.00 GHz</span>
                </div>
                <div className="text-xs text-slate-200 font-medium">LITTLE Cluster (Efficiency)</div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Always Online</span>
                  <span className="text-blue-400 group-hover:underline">Инфо &gt;</span>
                </div>
              </button>
            </div>

            {/* Row 2: Mali-G57 GPU & Display Engine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mali GPU */}
              <button
                onClick={() => setActiveBlock("mali_gpu")}
                className={`p-4 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "mali_gpu"
                    ? "bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-purple-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-purple-400 font-bold">Mali-G57 MC2</span>
                  <span className="text-slate-400 tabular-nums">950 MHz</span>
                </div>
                <div className="text-xs text-slate-200 font-medium">Valhall 3D Engine</div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Vulkan 1.3 ICD</span>
                  <span className="text-purple-400 group-hover:underline">Инфо &gt;</span>
                </div>
              </button>

              {/* Display Controller */}
              <button
                onClick={() => setActiveBlock("display_engine")}
                className={`p-4 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "display_engine"
                    ? "bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">HWC 2.4 AMOLED</span>
                  <span className="text-slate-400 tabular-nums">{params.refreshRate} Hz</span>
                </div>
                <div className="text-xs text-slate-200 font-medium">1080x2436 · PWM 2160Hz</div>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>SurfaceFlinger</span>
                  <span className="text-emerald-400 group-hover:underline">Инфо &gt;</span>
                </div>
              </button>
            </div>

            {/* Row 3: Modem RF & Memory Controller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveBlock("modem_rf")}
                className={`p-3.5 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "modem_rf"
                    ? "bg-sky-950/40 border-sky-400 shadow-md shadow-sky-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-sky-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-sky-400 font-bold">MT6631 Combo</span>
                  <span className="text-slate-400">Wi-Fi 5 / BT 5.3</span>
                </div>
                <div className="text-xs text-slate-200">wlan_drv_gen4m.ko</div>
              </button>

              <button
                onClick={() => setActiveBlock("memory_bus")}
                className={`p-3.5 rounded-lg text-left transition-all border relative overflow-hidden group ${
                  activeBlock === "memory_bus"
                    ? "bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 font-bold">LPDDR4X / UFS 2.2</span>
                  <span className="text-slate-400">17 GB/s DMA</span>
                </div>
                <div className="text-xs text-slate-200">Dynamic Super Partition</div>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Telemetry Readout on Right */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                ТЕЛЕМЕТРИЯ ПОДСИСТЕМЫ
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white tracking-tight">{current.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-800/80 py-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Конфигурация:</span>
                <span className="font-mono text-slate-200 text-right">{current.specs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Рабочая частота:</span>
                <span className="font-mono text-cyan-300 font-semibold">{current.clock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Статус AOSP:</span>
                <span className="font-mono text-emerald-400">{current.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Энергопотребление:</span>
                <span className="font-mono text-amber-300 tabular-nums">{current.power}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {current.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
