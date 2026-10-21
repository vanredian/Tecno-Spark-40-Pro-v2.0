import React, { useState } from "react";
import { BuildParams } from "../data/firmwareFiles";
import {
  Monitor,
  Fingerprint,
  Wifi,
  Layers,
  Play,
  RotateCcw,
  Activity,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface DriversTabProps {
  params: BuildParams;
  onUpdateParams: (newParams: Partial<BuildParams>) => void;
}

export const DriversTab: React.FC<DriversTabProps> = ({
  params,
  onUpdateParams,
}) => {
  const [selectedDriver, setSelectedDriver] = useState<
    "display" | "touch" | "wifi_bt" | "gpu"
  >("display");

  // Interactive Diagnostic State
  const [diagRunning, setDiagRunning] = useState<boolean>(false);
  const [diagLogs, setDiagLogs] = useState<string[]>([
    "dmesg: [    0.000000] Linux version 5.15.137-android14-gki-mt6789",
    "dmesg: [    0.142012] CPU: ARMv8.2-A (2x Cortex-A76 @ 2.2GHz, 6x Cortex-A55 @ 2.0GHz)",
    "dmesg: [    0.280194] MTK: SoC MediaTek Helio G100 detected",
    "dmesg: [    0.412891] Ready for driver subsystem initialization.",
  ]);
  const [diagFinished, setDiagFinished] = useState<boolean>(false);

  // Touchpad test simulation state
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [touchCounter, setTouchCounter] = useState<number>(0);

  const runDiagnostics = () => {
    setDiagRunning(true);
    setDiagFinished(false);
    setDiagLogs([
      "dmesg: [    0.000000] Linux version 5.15.137-android14-gki-mt6789",
      "dmesg: [    0.142012] CPU: ARMv8.2-A (2x Cortex-A76 @ 2.2GHz, 6x Cortex-A55 @ 2.0GHz)",
      "dmesg: [    0.280194] MTK: SoC MediaTek Helio G100 detected",
      "dmesg: [    0.412891] Initing submodules...",
    ]);

    const steps = [
      {
        delay: 500,
        log: "dmesg: [    1.120482] drm/mediatek: Initializing 1080x2436 AMOLED panel @ " + params.refreshRate + "Hz",
      },
      {
        delay: 1000,
        log: "dmesg: [    1.439102] drm/mediatek: PWM dimming set to 2160Hz high-frequency mode",
      },
      {
        delay: 1500,
        log: "dmesg: [    1.821944] input: FocalTech FT3658 Touchscreen initialized on i2c-3, max_coords=(1080, 2436)",
      },
      {
        delay: 2000,
        log: "dmesg: [    2.109283] ft3658: Report rate calibrated to 360Hz. Gesture wakeup: " + (params.enableDoubleTapWake ? "ENABLED" : "DISABLED"),
      },
      {
        delay: 2500,
        log: "dmesg: [    2.651829] wlan_drv_gen4m: Firmware WIFI_RAM_CODE_MT6789 loaded, MAC verified",
      },
      {
        delay: 3000,
        log: "dmesg: [    3.018420] btmtksdio: Bluetooth 5.3 controller ready. LDAC & LC3 codecs registered",
      },
      {
        delay: 3500,
        log: "dmesg: [    3.490182] mali_kbase: ARM Mali-G57 MC2 initialized, 2 cores, Valhall DDK r38p0",
      },
      {
        delay: 4000,
        log: "dmesg: [    3.892019] SurfaceFlinger: HWUI renderer backend = " + params.gpuRenderer + ", dynamic frame-pacer active",
      },
      {
        delay: 4500,
        log: "dmesg: [    4.102390] ALL DRIVERS INITIALIZED SUCCESSFULLY. Status: NOMINAL",
      },
    ];

    steps.forEach(({ delay, log }, index) => {
      setTimeout(() => {
        setDiagLogs((prev) => [...prev, log]);
        if (index === steps.length - 1) {
          setDiagRunning(false);
          setDiagFinished(true);
        }
      }, delay);
    });
  };

  const resetDiagnostics = () => {
    setDiagRunning(false);
    setDiagFinished(false);
    setDiagLogs([
      "dmesg: [    0.000000] Linux version 5.15.137-android14-gki-mt6789",
      "dmesg: [    0.142012] CPU: ARMv8.2-A (2x Cortex-A76 @ 2.2GHz, 6x Cortex-A55 @ 2.0GHz)",
      "dmesg: [    0.280194] MTK: SoC MediaTek Helio G100 detected",
      "dmesg: [    0.412891] Ready for driver subsystem initialization.",
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Driver Category Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-cyan-500/20">
        {[
          {
            id: "display" as const,
            title: "Дисплей (AMOLED 120Hz)",
            icon: Monitor,
            status: "HWC 2.4 AIDL",
          },
          {
            id: "touch" as const,
            title: "Сенсорный экран (360Hz)",
            icon: Fingerprint,
            status: "FT3658 IDC",
          },
          {
            id: "wifi_bt" as const,
            title: "Wi-Fi 5 & Bluetooth 5.3",
            icon: Wifi,
            status: "MT6631 Combo",
          },
          {
            id: "gpu" as const,
            title: "Графика ARM Mali-G57",
            icon: Layers,
            status: "Vulkan 1.3 ICD",
          },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = selectedDriver === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedDriver(item.id)}
              className={`flex-1 min-w-[200px] flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                isActive
                  ? "bg-cyan-950/50 text-white shadow-xs border border-cyan-400/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-cyan-400" : "text-slate-500"
                  }`}
                />
                <span className="text-xs font-semibold">{item.title}</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-500/80">
                {item.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Driver Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Specifications & Direct Configs */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDriver === "display" && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Драйвер дисплея: Curved AMOLED 120Hz
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Интеграция через DRM/KMS, SurfaceFlinger и AIDL Hardware Composer 2.4
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  {params.refreshRate} FPS Frame-Pacing
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">ШИМ-димминг (PWM):</div>
                  <div className="font-mono text-white font-semibold">2160 Hz (Без мерцания)</div>
                  <div className="text-[11px] text-slate-500">
                    sysfs: /sys/devices/platform/1100f000.disp/pwm
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Пиковая яркость:</div>
                  <div className="font-mono text-white font-semibold">1300 nits (HBM Mode)</div>
                  <div className="text-[11px] text-slate-500">
                    Автоматический переход при освещении &gt; 20000 lux
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Цветовые пространства:</div>
                  <div className="font-mono text-white font-semibold">DCI-P3 + sRGB (10-bit)</div>
                  <div className="text-[11px] text-slate-500">
                    ro.surface_flinger.has_wide_color_display=true
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Динамические режимы:</div>
                  <div className="font-mono text-white font-semibold">60Hz · 90Hz · 120Hz</div>
                  <div className="text-[11px] text-slate-500">
                    Плавное переключение без мерцания (Seamless)
                  </div>
                </div>
              </div>

              {/* Dynamic Refresh Rate Switcher */}
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Целевая частота обновления экрана:
                  </span>
                  <span className="font-mono text-blue-400 font-semibold">
                    {params.refreshRate} Hz
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[60, 90, 120].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => onUpdateParams({ refreshRate: rate })}
                      className={`py-2 text-xs rounded-md font-mono transition-colors ${
                        params.refreshRate === rate
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {rate} Hz {rate === 120 ? "(Максимальная плавность)" : rate === 60 ? "(Экономия)" : "(Баланс)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedDriver === "touch" && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Драйвер сенсора: FocalTech FT3658 / Goodix
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Мультитач Type B, частота сканирования 360Hz и калибровка координат
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  360Hz Touch Polling
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Контроллер шины:</div>
                  <div className="font-mono text-white font-semibold">I2C-3 @ 400kHz Fast Mode</div>
                  <div className="text-[11px] text-slate-500">irq: 42 (edge falling)</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Точек касания:</div>
                  <div className="font-mono text-white font-semibold">10-Point Multi-touch</div>
                  <div className="text-[11px] text-slate-500">Защита от ложных нажатий по краям</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Жест пробуждения:</div>
                  <div className="font-mono text-white font-semibold">
                    {params.enableDoubleTapWake ? "Включен (KEY_WAKEUP)" : "Отключен"}
                  </div>
                  <div className="text-[11px] text-slate-500">Двойной тап по экрану в глубоком сне</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Файл калибровки:</div>
                  <div className="font-mono text-white font-semibold">ft3658.idc</div>
                  <div className="text-[11px] text-slate-500">/vendor/usr/idc/ft3658.idc</div>
                </div>
              </div>

              {/* Interactive Touch Test Pad */}
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Интерактивная панель проверки отклика сенсора:
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    Событий: {touchCounter} {touchPos ? `(X: ${touchPos.x}, Y: ${touchPos.y})` : ""}
                  </span>
                </div>
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1080);
                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 2436);
                    setTouchPos({ x, y });
                    setTouchCounter((prev) => prev + 1);
                  }}
                  onMouseLeave={() => setTouchPos(null)}
                  className="h-28 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center cursor-crosshair relative overflow-hidden"
                >
                  {touchPos ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                      <div className="w-3 h-3 rounded-full bg-blue-500/80 animate-ping" />
                      <span>Касание зафиксировано: X={touchPos.x} Y={touchPos.y} @ 360Hz</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Проведите курсором или пальцем по этой области для проверки частоты дискретизации
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedDriver === "wifi_bt" && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Беспроводные модули: MediaTek MT6631 Combo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Интеграция Wi-Fi 5 (802.11ac) и Bluetooth 5.3 с поддержкой Hi-Res аудиокодеков
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Dual-Band 2.4/5GHz
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Модуль ядра Wi-Fi:</div>
                  <div className="font-mono text-white font-semibold">wlan_drv_gen4m.ko</div>
                  <div className="text-[11px] text-slate-500">Прошивка: WIFI_RAM_CODE_MT6789</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Интерфейс Wi-Fi:</div>
                  <div className="font-mono text-white font-semibold">AIDL IWifi (v1.0)</div>
                  <div className="text-[11px] text-slate-500">wpa_supplicant + nl80211</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Стек Bluetooth:</div>
                  <div className="font-mono text-white font-semibold">Bluetooth 5.3 + BLE</div>
                  <div className="text-[11px] text-slate-500">HCI UART (/dev/ttyMT0)</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Hi-Res Аудиокодеки:</div>
                  <div className="font-mono text-white font-semibold">LDAC, aptX HD, LC3</div>
                  <div className="text-[11px] text-slate-500">Поддержка 990 kbps 24-bit 96kHz</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Оптимизация энергопотребления радиомодуля:</div>
                <p className="text-slate-400 leading-relaxed">
                  Интервал фонового сканирования сетей Wi-Fi увеличен до 180 секунд (параметр <code className="text-blue-400">wifi.supplicant_scan_interval=180</code>). При отключенном экране Wi-Fi переходит в режим Power Save Polling (PSP), что экономит до 45 мА в час.
                </p>
              </div>
            </div>
          )}

          {selectedDriver === "gpu" && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Графическое ускорение: ARM Mali-G57 MC2
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Архитектура Valhall, аппаратно ускоренный рендеринг UI через Vulkan 1.3 и OpenGL ES 3.2
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Valhall DDK r38p0
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Vulkan ICD:</div>
                  <div className="font-mono text-white font-semibold">vulkan.mali.so (v1.3)</div>
                  <div className="text-[11px] text-slate-500">Аппаратные очереди вычислительных шейдеров</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">OpenGL ES:</div>
                  <div className="font-mono text-white font-semibold">libGLES_mali.so (v3.2)</div>
                  <div className="text-[11px] text-slate-500">Поддержка ASTC сжатия текстур</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Буферный аллокатор:</div>
                  <div className="font-mono text-white font-semibold">Gralloc 4 (AIDL)</div>
                  <div className="text-[11px] text-slate-500">DMA-BUF и прямое обращение GPU к памяти</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Частоты ядра GPU:</div>
                  <div className="font-mono text-white font-semibold">300 MHz — 950 MHz</div>
                  <div className="text-[11px] text-slate-500">Динамическое управление через DVFS</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Бэкенд отрисовки интерфейса (HWUI):</span>
                  <span className="font-mono text-blue-400 font-semibold">{params.gpuRenderer}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateParams({ gpuRenderer: "vulkan" })}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      params.gpuRenderer === "vulkan"
                        ? "bg-blue-600/15 border-blue-500/40 text-blue-200"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-white">Vulkan 1.3 (Рекомендовано)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Меньше задержек отрисовки, стабильные 120 FPS
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateParams({ gpuRenderer: "skiagl" })}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      params.gpuRenderer === "skiagl"
                        ? "bg-blue-600/15 border-blue-500/40 text-blue-200"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-white">OpenGL ES (SkiaGL)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Классический режим совместимости
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Diagnostic Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">
                  Симулятор инициализации ядра и драйверов
                </h3>
              </div>
              {diagFinished && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Успешно</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Эмуляция последовательности загрузки ядра Linux 5.15 и HAL-сервисов TECNO SPARK 40 PRO+.
            </p>

            {/* Diagnostic Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={diagRunning}
                onClick={runDiagnostics}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {diagRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Инициализация...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Запустить проверку драйверов</span>
                  </>
                )}
              </button>

              <button
                disabled={diagRunning}
                onClick={resetDiagnostics}
                className="py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Log Terminal Screen */}
            <div className="flex-1 min-h-[300px] p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1.5 border border-slate-800/80">
              {diagLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.includes("SUCCESSFULLY")
                      ? "text-emerald-400 font-bold"
                      : log.includes("Initializing") || log.includes("loaded")
                      ? "text-blue-300"
                      : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
              {diagRunning && (
                <div className="text-blue-400 animate-pulse">
                  &gt; probing next hardware controller...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
