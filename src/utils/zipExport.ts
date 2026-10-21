import JSZip from "jszip";
import { firmwareFiles, BuildParams } from "../data/firmwareFiles";

export async function exportDeviceTreeZip(params: BuildParams): Promise<void> {
  const zip = new JSZip();

  // Root folder
  const rootFolder = zip.folder("device/tecno/spark40pro_plus");
  if (!rootFolder) return;

  firmwareFiles.forEach((file) => {
    // Strip the device/tecno/spark40pro_plus/ prefix for the inner zip or preserve tree
    const relativePath = file.path.replace("device/tecno/spark40pro_plus/", "");
    const content = file.getContent(params);
    rootFolder.file(relativePath, content);
  });

  // Add README.md
  rootFolder.file(
    "README.md",
    `# TECNO SPARK 40 PRO+ AOSP Device Tree
**Target SoC**: MediaTek Helio G100 (MT6789)
**Base OS**: Android ${params.androidVersion}
**Codename**: spark40pro_plus

## How to Build:
1. Place this directory into your AOSP source tree at \`device/tecno/spark40pro_plus\`
2. Set up environment:
   \`\`\`bash
   source build/envsetup.sh
   lunch aosp_spark40pro_plus-userdebug
   m bacon -j$(nproc)
   \`\`\`
3. Flashing:
   Use \`scripts/flash_all.sh\` to flash generated boot, vendor_boot, dtbo, and super images.
`
  );

  const versionTag = params.androidVersion.includes("16")
    ? "aosp16"
    : params.androidVersion.includes("15")
    ? "aosp15"
    : "aosp14";
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `device_tecno_spark40pro_plus_${versionTag}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
