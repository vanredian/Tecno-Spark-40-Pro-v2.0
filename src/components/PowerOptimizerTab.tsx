import React, { useState } from "react";
import { BuildParams } from "../data/firmwareFiles";
import {
  Battery,
  BatteryCharging,
  Zap,
  Moon,
  Sliders,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";

interface PowerOptimizerTabProps {
  params: BuildParams;
  onUpdateParams: (newParams: Partial<BuildParams>) => void;
}

export const PowerOptimizerTab: React.FC<PowerOptimizerTabProps> = ({
  params,
  onUpdateParams,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Dynamic battery projections based on settings and 5000 mAh battery
  const getProjections = () => {
    let sot = 8.0;
    let standbyHours = 120;
    let standbyDrain = 0.45;

    if (params.powerProfile === "battery_saver") {
      sot = 9.8;
      standbyHours = 160;
      standbyDrain = 0.28;
    } else if (params.powerProfile === "performance") {
      sot = 6.2;
      standbyHours = 85;
      standbyDrain = 0.65;
    }

    if (params.refreshRate === 60) {
      sot += 1.2;
    } else if (params.refreshRate === 90) {
      sot += 0.5;
    }

    if (params.dozeTimeoutMin <= 5) {
      standbyHours += 15;
      standbyDrain -= 0.05;
    }

    return {
      sot: sot.toFixed(1),
      standbyHours: Math.round(standbyHours),
      standbyDrain: standbyDrain.toFixed(2),
    };
  };

  const projections = getProjections();

  const handleCopySnippet = () => {
    const snippet = `# PowerHAL sysfs directives for TECNO SPARK 40 PRO+
write /proc/sys/kernel/sched_energy_aware 1
write /sys/devices/system/cpu/cpufreq/policy0/scaling_governor schedutil
write /sys/devices/system/cpu/cpufreq/policy6/scaling_governor schedutil
write /sys/module/wakeup/parameters/enable_si_ws 0
setprop persist.sys.power.deep_doze_delay_sec ${params.dozeTimeoutMin * 60}`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>Energy-Aware Scheduling (EAS)</span>
          <span aria-hidden="true">·</span>
          <span>AIDL PowerHAL v4</span>
          <span aria-hidden="true">·</span>
          <span>Deep Doze Automation</span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">
          Оптимизация энергопотребления стандартных сервисов AOSP
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          В стоковых прошивках Transsion фоновые системные процессы часто вызывают спонтанные пробуждения (wakelocks) и разряжают аккумулятор. В данной сборке AOSP реализован строгий контроль энергосбережения: таймеры тревог (AlarmManager) агрегируются в batch-окна, фоновые сетевые сканирования ограничиваются, а ядра Cortex-A76 переводятся в глубокий сон при неактивном экране.
        </p>
      </section>

      {/* Preset Profiles Matrix */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Готовые профили энергосбережения:
          </h3>
          <span className="text-xs text-slate-400">
            Переключение профиля автоматически корректирует параметры ядра и PowerHAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Battery Saver */}
          <button
            onClick={() =>
              onUpdateParams({
                powerProfile: "battery_saver",
                dozeTimeoutMin: 5,
              })
            }
            className={`p-5 rounded-xl border text-left transition-all ${
              params.powerProfile === "battery_saver"
                ? "bg-emerald-950/20 border-emerald-500/50 shadow-xs"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Ультра-сбережение
              </span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white">Максимальная автономность</div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Агрессивный Deep Doze через 5 минут, парковка Big ядер (A76), ограничение фоновых служб Google/AOSP.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Экран: ~{projections.sot}ч</span>
              <span className="text-emerald-400">Расход: &lt; 0.3%/ч</span>
            </div>
          </button>

          {/* Balanced */}
          <button
            onClick={() =>
              onUpdateParams({
                powerProfile: "balanced",
                dozeTimeoutMin: 10,
              })
            }
            className={`p-5 rounded-xl border text-left transition-all ${
              params.powerProfile === "balanced"
                ? "bg-blue-950/20 border-blue-500/50 shadow-xs"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-blue-400 font-semibold">
                Рекомендовано
              </span>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-bold text-white">Сбалансированный AOSP</div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Мгновенный отклик на касания (touch boost 120ms), плавные 120 FPS и разумное отключение спящих сервисов.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Экран: ~{projections.sot}ч</span>
              <span className="text-blue-400">Расход: ~0.45%/ч</span>
            </div>
          </button>

          {/* Performance */}
          <button
            onClick={() =>
              onUpdateParams({
                powerProfile: "performance",
                dozeTimeoutMin: 20,
              })
            }
            className={`p-5 rounded-xl border text-left transition-all ${
              params.powerProfile === "performance"
                ? "bg-purple-950/20 border-purple-500/50 shadow-xs"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-purple-400 font-semibold">
                Производительность
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold text-white">Постоянная мощность (120 FPS)</div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Минимальные задержки планировщика EAS, постоянная готовность Mali-G57 GPU для тяжелых 3D приложений.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Экран: ~{projections.sot}ч</span>
              <span className="text-purple-400">Расход: ~0.65%/ч</span>
            </div>
          </button>
        </div>
      </section>

      {/* Real-time Battery Life Projection Metrics */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Прогнозируемая автономность (Аккумулятор 5000 мА·ч)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Helio G100 (6nm) + AMOLED 120Hz
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Время активного экрана (SOT):</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {projections.sot} часов
            </div>
            <div className="text-[11px] text-slate-500">
              Веб-серфинг, мессенджеры, просмотр видео при яркости 50%
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Режим ожидания (Standby):</div>
            <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
              ~{projections.standbyHours} часов
            </div>
            <div className="text-[11px] text-slate-500">
              Более {(projections.standbyHours / 24).toFixed(1)} суток в режиме глубокого сна (Deep Doze)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Разряд в простое (за 1 час):</div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {projections.standbyDrain}% / час
            </div>
            <div className="text-[11px] text-slate-500">
              Против 1.2%/ч в стандартной неоптимизированной прошивке
            </div>
          </div>
        </div>
      </section>

      {/* Granular Sliders & Direct Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Container */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Тонкие параметры таймеров энергосбережения
            </h3>
          </div>

          {/* Deep Doze Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">
                Задержка перехода в глубокий сон (Deep Doze):
              </span>
              <span className="font-mono text-blue-400 font-semibold tabular-nums">
                {params.dozeTimeoutMin} минут
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={params.dozeTimeoutMin}
              onChange={(e) =>
                onUpdateParams({ dozeTimeoutMin: parseInt(e.target.value) })
              }
              className="w-full accent-blue-600 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>3 мин (Макс. экономия)</span>
              <span>15 мин</span>
              <span>30 мин (Меньше задержек)</span>
            </div>
          </div>

          {/* Standard Service Rules Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-200">
              Активные правила оптимизации сервисов:
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ограничение сканирования Wi-Fi при выключенном экране (300с)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Группировка wakelocks системных приложений через Doze Whitelist</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Снижение частоты опроса датчиков в фоновом режиме</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>EAS schedutil: понижение частоты Big ядер при падении нагрузки</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Sysfs Directives Output */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Директивы ядра init.mt6789.power.rc
              </h3>
            </div>
            <button
              onClick={handleCopySnippet}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {copiedSnippet ? (
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
          </div>

          <div className="flex-1 p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed border border-slate-800 overflow-x-auto">
            <div className="text-slate-500"># Сгенерировано для TECNO SPARK 40 PRO+</div>
            <div>write /proc/sys/kernel/sched_energy_aware 1</div>
            <div>write /sys/devices/system/cpu/cpufreq/policy0/scaling_governor schedutil</div>
            <div>write /sys/devices/system/cpu/cpufreq/policy6/scaling_governor schedutil</div>
            <div>write /sys/devices/system/cpu/cpufreq/policy6/schedutil/down_rate_limit_us {params.powerProfile === "battery_saver" ? "30000" : "10000"}</div>
            <div>write /proc/cpufreq/cpufreq_power_mode {params.powerProfile === "battery_saver" ? "3" : "1"}</div>
            <div>setprop persist.sys.power.deep_doze_delay_sec {params.dozeTimeoutMin * 60}</div>
            <div>setprop wifi.supplicant_scan_interval 180</div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              Данные правила внедряются автоматически в образ vendor.img при компиляции AOSP.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
