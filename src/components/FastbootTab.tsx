import React, { useState } from "react";
import { firmwareFiles, BuildParams } from "../data/firmwareFiles";
import { downloadSingleFile } from "../utils/zipExport";
import {
  Terminal,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  HardDrive,
  Cpu,
} from "lucide-react";

interface FastbootTabProps {
  params: BuildParams;
}

export const FastbootTab: React.FC<FastbootTabProps> = ({ params }) => {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "$ fastboot devices",
    "084651336B000219    fastboot (TECNO SPARK 40 PRO+)",
    "$ fastboot getvar product",
    "product: MT6789_spark40pro_plus",
    "Finished. Total time: 0.012s",
  ]);

  const [inputCommand, setInputCommand] = useState<string>("");

  const runCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    let response: string[] = [];

    if (cleanCmd === "fastboot devices") {
      response = ["084651336B000219    fastboot (TECNO SPARK 40 PRO+)"];
    } else if (cleanCmd === "fastboot getvar all") {
      response = [
        "(bootloader) version: 0.5",
        "(bootloader) version-bootloader: MTK6789_v8.0.0",
        "(bootloader) version-baseband: MOLY.LR12A.R3.MP",
        "(bootloader) product: MT6789_spark40pro_plus",
        "(bootloader) secure: no",
        "(bootloader) unlocked: yes",
        "(bootloader) current-slot: a",
        "(bootloader) has-slot:boot: yes",
        "(bootloader) has-slot:super: no",
        "(bootloader) is-logical:system: yes",
        "(bootloader) is-logical:vendor: yes",
        "(bootloader) is-logical:product: yes",
        "(bootloader) is-logical:system_ext: yes",
        "(bootloader) max-download-size: 0x20000000",
        "all: done",
        "Finished. Total time: 0.054s",
      ];
    } else if (cleanCmd === "fastboot getvar current-slot") {
      response = ["current-slot: a", "Finished. Total time: 0.005s"];
    } else if (cleanCmd.includes("flash boot")) {
      response = [
        "Sending 'boot_a' (65536 KB)... OKAY [  1.420s]",
        "Writing 'boot_a'...            OKAY [  0.312s]",
        "Finished. Total time: 1.732s",
      ];
    } else if (cleanCmd.includes("flash dtbo")) {
      response = [
        "Sending 'dtbo_a' (8192 KB)...  OKAY [  0.198s]",
        "Writing 'dtbo_a'...            OKAY [  0.084s]",
        "Finished. Total time: 0.282s",
      ];
    } else if (cleanCmd.includes("flash vendor_boot")) {
      response = [
        "Sending 'vendor_boot_a' (65536 KB)... OKAY [  1.412s]",
        "Writing 'vendor_boot_a'...            OKAY [  0.320s]",
        "Finished. Total time: 1.732s",
      ];
    } else if (cleanCmd.includes("flash super")) {
      response = [
        "Sending sparse 'super' 1/3 (1572864 KB)... OKAY [ 32.140s]",
        "Writing 'super' 1/3...                      OKAY [ 12.040s]",
        "Sending sparse 'super' 2/3 (1572864 KB)... OKAY [ 31.890s]",
        "Writing 'super' 2/3...                      OKAY [ 11.950s]",
        "Sending sparse 'super' 3/3 (1240192 KB)... OKAY [ 24.620s]",
        "Writing 'super' 3/3...                      OKAY [  9.420s]",
        "Dynamic super partition updated successfully.",
        "Finished. Total time: 122.060s",
      ];
    } else if (cleanCmd.includes("disable-verity") || cleanCmd.includes("vbmeta")) {
      response = [
        "Sending 'vbmeta_a' (4096 KB)... OKAY [  0.082s]",
        "Writing 'vbmeta_a'...           OKAY [  0.041s]",
        "AVB Verification disabled flag set.",
        "Finished. Total time: 0.123s",
      ];
    } else if (cleanCmd.includes("erase userdata")) {
      response = [
        "Erasing 'userdata'...           OKAY [  1.240s]",
        "Finished. Total time: 1.240s",
      ];
    } else if (cleanCmd === "fastboot reboot") {
      response = [
        `Device rebooted into Android ${params.androidVersion} AOSP system.`,
      ];
    } else if (cleanCmd === "clear") {
      setTerminalLogs([]);
      setInputCommand("");
      return;
    } else {
      response = [
        `Unknown command or argument: ${cleanCmd}`,
        "Supported commands: fastboot devices, fastboot getvar all, fastboot flash <partition> <img_file>, fastboot erase userdata, fastboot reboot, clear",
      ];
    }

    setTerminalLogs((prev) => [...prev, `$ ${cleanCmd}`, ...response]);
    setInputCommand("");
  };

  const handleDownloadScript = (isWindows: boolean) => {
    const filename = isWindows ? "flash_all.bat" : "flash_all.sh";
    const file = firmwareFiles.find((f) => f.name === filename);
    if (file) {
      downloadSingleFile(filename, file.getContent(params));
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview & Pre-flight warnings */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <HardDrive className="w-4 h-4" />
          <span>Dynamic Partitions (Super)</span>
          <span aria-hidden="true">·</span>
          <span>Virtual A/B Slot Switching</span>
          <span aria-hidden="true">·</span>
          <span>MediaTek MT6789 Bootloader</span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">
          Инструкция и центр прошивки TECNO SPARK 40 PRO+
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Смартфон оснащен динамическим супер-разделом (Super Partition) и архитектурой Virtual A/B. Это означает, что разделы <code>system</code>, <code>vendor</code>, <code>product</code> и <code>system_ext</code> не прошиваются отдельно через Fastboot — вместо этого обновляется общий супер-образ <code>super.img</code> либо ядро <code>boot.img</code> и оверлей <code>vendor_boot.img</code>.
        </p>

        {/* Warning banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-300 font-semibold">Важное предупреждение:</strong> Перед прошивкой убедитесь, что загрузчик разблокирован в меню «Для разработчиков» (OEM Unlocking) и выполнена команда <code>fastboot flashing unlock</code>. Процедура удалит все данные с устройства.
          </div>
        </div>
      </section>

      {/* Step by Step Visual Guide */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Пошаговый регламент развертывания:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-blue-400 font-semibold">Шаг 1</div>
            <div className="font-bold text-white text-sm">Подготовка и Fastboot</div>
            <p className="text-slate-400 leading-relaxed">
              Выключите смартфон. Зажмите комбинацию клавиш <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">Питание + Громкость Вниз</kbd> до появления надписи «FASTBOOT mode». Подключите оригинальный кабель USB Type-C к ПК.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-blue-400 font-semibold">Шаг 2</div>
            <div className="font-bold text-white text-sm">Прошивка ядер и Super</div>
            <p className="text-slate-400 leading-relaxed">
              Запустите автоматический скрипт <code>flash_all.sh</code> (или <code>flash_all.bat</code>). Скрипт последовательно запишет ядро Linux 5.15 в оба слота (boot_a / boot_b), отключит верификацию vbmeta и заполнит супер-раздел.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-blue-400 font-semibold">Шаг 3</div>
            <div className="font-bold text-white text-sm">Очистка и запуск AOSP</div>
            <p className="text-slate-400 leading-relaxed">
              После завершения прошивки супер-образа выполните <code>fastboot erase userdata</code> для форматирования файловой системы в F2FS. Выполните <code>fastboot reboot</code> — смартфон загрузится в чистый AOSP Android 14.
            </p>
          </div>
        </div>
      </section>

      {/* Script Download Buttons Strip */}
      <section className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-white">
            Скачать готовые исполняемые скрипты прошивки
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Содержат все команды для одновременной прошивки A/B слотов и проверки ошибок
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadScript(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>flash_all.sh (Linux/macOS)</span>
          </button>
          <button
            onClick={() => handleDownloadScript(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>flash_all.bat (Windows)</span>
          </button>
        </div>
      </section>

      {/* Interactive Fastboot Terminal Simulator */}
      <section className="hud-panel hud-corner rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Интерактивный симулятор терминала Fastboot
            </h3>
          </div>
          <button
            onClick={() => setTerminalLogs([])}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Очистить лог</span>
          </button>
        </div>

        {/* Quick Command Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center text-[11px] font-mono mr-1">Быстрый запуск:</span>
          {[
            "fastboot devices",
            "fastboot getvar all",
            "fastboot flash boot boot.img",
            "fastboot flash super super.img",
            "fastboot --disable-verity flash vbmeta vbmeta.img",
            "fastboot erase userdata",
            "fastboot reboot",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runCommand(cmd)}
              className="py-1 px-2.5 rounded bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 font-mono text-[11px] transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen */}
        <div className="p-4 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 min-h-[300px] max-h-[420px] overflow-y-auto space-y-1.5 border border-cyan-500/20 shadow-inner">
          {terminalLogs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.startsWith("$")
                  ? "text-cyan-400 font-bold"
                  : log.includes("OKAY") || log.includes("successfully")
                  ? "text-emerald-400"
                  : log.includes("Unknown") || log.includes("Error")
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {log}
            </div>
          ))}
          {terminalLogs.length === 0 && (
            <div className="text-slate-600 text-[11px] font-mono">
              Терминал очищен. Введите команду или выберите из списка быстрого запуска.
            </div>
          )}
        </div>

        {/* Command Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(inputCommand);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 font-mono text-xs text-cyan-400 select-none">
              $
            </span>
            <input
              type="text"
              placeholder="Введите команду (например, fastboot getvar all)..."
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              className="w-full pl-7 pr-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shrink-0 font-mono"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Выполнить</span>
          </button>
        </form>
      </section>
    </div>
  );
};
