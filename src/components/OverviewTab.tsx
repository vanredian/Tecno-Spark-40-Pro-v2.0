import React, { useState, useEffect } from "react";
import { tecnoSpark40ProPlusSpec } from "../data/deviceData";
import { BuildParams } from "../data/firmwareFiles";
import { TabKey } from "./Header";
import { FuturisticSiliconDie } from "./FuturisticSiliconDie";
import {
  Smartphone,
  Cpu,
  Monitor,
  Fingerprint,
  Wifi,
  BatteryCharging,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Radio,
  Sliders,
} from "lucide-react";

interface OverviewTabProps {
  params: BuildParams;
  onNavigateTab: (tab: TabKey) => void;
  onOpenExport: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  params,
  onNavigateTab,
  onOpenExport,
}) => {
  const spec = tecnoSpark40ProPlusSpec;

  // Real-time simulated frame telemetry
  const [frameTimeMs, setFrameTimeMs] = useState<number>(8.33);
  const [fpsCounter, setFpsCounter] = useState<number>(120);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseFps = params.refreshRate;
      const jitter = (Math.random() - 0.5) * 0.4;
      const currentFps = Math.min(baseFps, Math.max(baseFps - 1, baseFps + jitter));
      setFpsCounter(Number(currentFps.toFixed(1)));
      setFrameTimeMs(Number((1000 / currentFps).toFixed(2)));
    }, 600);
    return () => clearInterval(interval);
  }, [params.refreshRate]);

  return (
    <div className="space-y-10">
      {/* Hero Section with Futuristic HUD Styling */}
      <section className="hud-panel hud-corner rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>AOSP ANDROID {params.androidVersion.includes("16") ? "16 (BAKLAVA / API 36)" : params.androidVersion.includes("15") ? "15 (VANILLA ICE CREAM)" : "14"}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>MEDIATEK HELIO G100</span>
            <span aria-hidden="true">·</span>
            <span>ARMV8.2-A 64-BIT</span>
            <span aria-hidden="true">·</span>
            <span>DYNAMIC SUPER PARTITION</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AOSP {params.androidVersion.includes("16") ? "Android 16 (Baklava)" : params.androidVersion.includes("15") ? "Android 15" : "Android 14"} Базовая Прошивка <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              TECNO SPARK 40 PRO+
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Высокоточная аппаратная адаптация для смартфона TECNO SPARK 40 PRO+ на 6-нм архитектуре Helio G100 (MT6789) под управлением {params.androidVersion.includes("16") ? "новейшего AOSP Android 16 (Baklava / API 36) с поддержкой страниц 16KB" : params.androidVersion.includes("15") ? "AOSP Android 15 (API 35)" : "Android 14"}. Полная поддержка 120Hz AMOLED экрана, сенсора с частотой 360Hz, графики Mali-G57 (Vulkan 1.3) и сбалансированной среды MicroG с планировщиком EAS.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("tree")}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-400/20 active:scale-[0.98] transition-all font-mono"
            >
              <span>ОТКРЫТЬ DEVICE TREE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab("drivers")}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Статус драйверов</span>
            </button>
            <button
              onClick={() => onNavigateTab("apps")}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Приложения (MicroG Active)</span>
            </button>
            <button
              onClick={() => onNavigateTab("power")}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>EAS Энергосбережение</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Futuristic Silicon Die Component */}
      <FuturisticSiliconDie params={params} />

      {/* Real-time Display Frame-Pacer & PWM Waveform Telemetry */}
      <section className="hud-panel rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              SurfaceFlinger Frame-Pacing & Дисплейная телеметрия
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Частота обновления:</span>
            <span className="text-cyan-400 font-bold tabular-nums">{params.refreshRate} Hz</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400">Текущий Frame Rate (FPS):</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {fpsCounter} FPS
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Цель: {params.refreshRate}.0 FPS (HWC 2.4)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400">Время рендеринга кадра:</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {frameTimeMs} ms
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Бюджет: {(1000 / params.refreshRate).toFixed(2)} ms
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400">Частота ШИМ (Flicker-Free):</div>
            <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
              2160 Hz
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Защита зрения при низкой яркости
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400">Сенсорное сканирование:</div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              360 Hz
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Задержка отклика: 2.77 ms
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Specifications Grid with Futuristic Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Аппаратный профиль компонентов
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Драйверы и аппаратные модули платформы TECNO SPARK 40 PRO+, скомпилированные в ядре и HAL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SoC Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Процессор (SoC)</h3>
                <div className="text-xs text-slate-400">{spec.soc.name}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Архитектура:</span>
                <span className="font-mono text-cyan-300">{spec.soc.architecture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Техпроцесс:</span>
                <span className="font-mono">{spec.soc.process}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Кластеры:</span>
                <span>2x A76 (2.2GHz) + 6x A55 (2.0GHz)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Планировщик:</span>
                <span className="font-mono text-cyan-400">EAS schedutil</span>
              </div>
            </div>
          </div>

          {/* GPU Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Графика (GPU)</h3>
                <div className="text-xs text-slate-400">{spec.gpu.model}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Архитектура GPU:</span>
                <span>{spec.gpu.architecture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vulkan API:</span>
                <span className="font-mono text-emerald-400">{spec.gpu.vulkanVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OpenGL ES:</span>
                <span className="font-mono">{spec.gpu.openGLVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Рендерер UI:</span>
                <span className="font-mono text-purple-400">{params.gpuRenderer}</span>
              </div>
            </div>
          </div>

          {/* Display Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AMOLED Дисплей</h3>
                <div className="text-xs text-slate-400">{spec.display.diagonal} FHD+</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Разрешение:</span>
                <span className="font-mono tabular-nums">{spec.display.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Частота обновления:</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {params.refreshRate} Hz
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ШИМ-димминг:</span>
                <span className="font-mono">{spec.display.pwmFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Цветопередача:</span>
                <span>{spec.display.hdrSupport}</span>
              </div>
            </div>
          </div>

          {/* Touch Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Сенсорный экран</h3>
                <div className="text-xs text-slate-400">{spec.touch.controller}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Частота опроса:</span>
                <span className="font-mono tabular-nums">{spec.display.touchSampling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Мультитач:</span>
                <span className="font-mono">{spec.touch.multiTouch} касаний (Type B)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Пробуждение тапом:</span>
                <span className="text-cyan-400 font-medium">
                  {params.enableDoubleTapWake ? "Включено (KEY_WAKEUP)" : "Отключено"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Файл калибровки:</span>
                <span className="font-mono text-slate-400">{spec.touch.idcFile}</span>
              </div>
            </div>
          </div>

          {/* Wireless Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Связь & Радиомодули</h3>
                <div className="text-xs text-slate-400">{spec.connectivity.wifiChip}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Wi-Fi:</span>
                <span>{spec.connectivity.wifiStandards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Диапазоны:</span>
                <span>{spec.connectivity.wifiBands}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bluetooth:</span>
                <span className="font-mono">{spec.connectivity.btVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Аудиокодеки:</span>
                <span className="font-mono text-sky-300">LDAC, aptX HD, LC3</span>
              </div>
            </div>
          </div>

          {/* Power & Partitions Card */}
          <div className="hud-panel rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Питание & Разделы</h3>
                <div className="text-xs text-slate-400">{spec.power.capacity}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Быстрая зарядка:</span>
                <span>{spec.power.charging}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Схема разделов:</span>
                <span className="font-mono text-xs">{spec.partitions.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Размер Super:</span>
                <span className="font-mono tabular-nums">{spec.partitions.superSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Файловые системы:</span>
                <span className="font-mono text-xs">EROFS + F2FS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AOSP Architectural Pipeline */}
      <section className="hud-panel rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Стек интеграции аппаратных уровней AOSP 14
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
            <div className="text-xs font-mono text-cyan-400 font-bold">01. ЯДРО 5.15 GKI</div>
            <div className="text-sm font-semibold text-white">DRM KMS & Drivers</div>
            <div className="text-xs text-slate-400">
              MT6789 defconfig, wlan_drv_gen4m.ko, mali_kbase
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
            <div className="text-xs font-mono text-cyan-400 font-bold">02. HAL & VINTF</div>
            <div className="text-sm font-semibold text-white">AIDL Interfaces</div>
            <div className="text-xs text-slate-400">
              Composer 3.0, Wi-Fi AIDL, BT 1.1, Power v4
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
            <div className="text-xs font-mono text-cyan-400 font-bold">03. ГРАФИКА</div>
            <div className="text-sm font-semibold text-white">Mali-G57 Vulkan 1.3</div>
            <div className="text-xs text-slate-400">
              SurfaceFlinger 120Hz, Gralloc 4, RenderThread
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
            <div className="text-xs font-mono text-cyan-400 font-bold">04. ПИТАНИЕ & MICROG</div>
            <div className="text-sm font-semibold text-white">EAS Schedutil & Doze</div>
            <div className="text-xs text-slate-400">
              GmsCore FCM Push, Signature Spoofing, Cluster Idle
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
            <div className="text-xs font-mono text-cyan-400 font-bold">05. FASTBOOT FLASH</div>
            <div className="text-sm font-semibold text-white">Super & Virtual A/B</div>
            <div className="text-xs text-slate-400">
              Автоматические скрипты flash_all.sh / flash_all.bat
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
