import React, { useState } from "react";
import { BuildParams, firmwareFiles } from "../data/firmwareFiles";
import { exportDeviceTreeZip } from "../utils/zipExport";
import {
  X,
  Download,
  FolderArchive,
  Check,
  Copy,
  Terminal,
  FileCode,
  ShieldCheck,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: BuildParams;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  params,
}) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await exportDeviceTreeZip(params);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to generate zip:", err);
    } finally {
      setDownloading(false);
    }
  };

  const buildCmd = `source build/envsetup.sh && lunch aosp_spark40pro_plus-userdebug && m bacon -j$(nproc)`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(buildCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Экспорт архива Device Tree AOSP
              </h3>
              <p className="text-xs text-slate-400">
                TECNO SPARK 40 PRO+ (MT6789 / Helio G100)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Target tree preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Содержимое архива (полное дерево устройства):</span>
              <span className="font-mono text-slate-400 tabular-nums">
                {firmwareFiles.length + 1} файлов
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
              <div className="text-blue-400 font-semibold">device/tecno/spark40pro_plus/</div>
              {firmwareFiles.map((file) => (
                <div key={file.path} className="pl-4 text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <FileCode className="w-3 h-3 text-slate-500" />
                  <span>{file.path.replace("device/tecno/spark40pro_plus/", "")}</span>
                </div>
              ))}
              <div className="pl-4 text-slate-400 flex items-center gap-1.5 text-[11px]">
                <FileCode className="w-3 h-3 text-slate-500" />
                <span>README.md</span>
              </div>
            </div>
          </div>

          {/* Compilation Instructions */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              Команда локальной сборки в дереве исходников AOSP:
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300">
              <span className="truncate">{buildCmd}</span>
              <button
                onClick={handleCopyCmd}
                className="ml-3 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs shrink-0 transition-colors"
              >
                {copiedCmd ? (
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
          </div>

          {/* Current Build Flags Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400">Дисплей & Графика:</div>
              <div className="font-mono text-white font-medium">
                {params.refreshRate}Hz AMOLED · {params.gpuRenderer.toUpperCase()}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400">Безопасность & Питание:</div>
              <div className="font-mono text-white font-medium">
                SELinux {params.selinuxMode} · {params.powerProfile}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cyan-500/15 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            Закрыть
          </button>
          <button
            disabled={downloading}
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] rounded-lg shadow-sm shadow-cyan-400/20 transition-all disabled:opacity-50 font-mono"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Архив успешно скачан!</span>
              </>
            ) : downloading ? (
              <span>Упаковка файлов ZIP...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Скачать device_tecno_spark40pro_plus_{params.androidVersion.includes("15") ? "aosp15" : "aosp14"}.zip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
