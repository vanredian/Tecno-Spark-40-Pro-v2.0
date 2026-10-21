export interface DeviceSpec {
  brand: string;
  model: string;
  codename: string;
  soc: {
    name: string;
    chipset: string;
    process: string;
    cores: string;
    architecture: string;
    clusters: {
      type: string;
      cores: string;
      frequency: string;
      governor: string;
    }[];
  };
  gpu: {
    model: string;
    architecture: string;
    cores: string;
    vulkanVersion: string;
    openGLVersion: string;
    renderEngine: string;
  };
  display: {
    type: string;
    diagonal: string;
    resolution: string;
    density: string;
    refreshRates: number[];
    pwmFrequency: string;
    touchSampling: string;
    hdrSupport: string;
  };
  touch: {
    controller: string;
    protocol: string;
    multiTouch: number;
    idcFile: string;
    features: string[];
  };
  connectivity: {
    wifiChip: string;
    wifiStandards: string;
    wifiBands: string;
    btVersion: string;
    btCodecs: string[];
    modem: string;
  };
  power: {
    capacity: string;
    charging: string;
    thermalEngine: string;
    easSupport: boolean;
    dozeTuning: string;
  };
  partitions: {
    type: string;
    slots: string;
    superSize: string;
    filesystems: string;
  };
}

export const tecnoSpark40ProPlusSpec: DeviceSpec = {
  brand: "TECNO",
  model: "SPARK 40 PRO+",
  codename: "spark40pro_plus",
  soc: {
    name: "MediaTek Helio G100",
    chipset: "MT6789 (MT6835 architecture)",
    process: "6nm TSMC",
    cores: "8 ядер (Octa-Core)",
    architecture: "ARMv8.2-A (64-bit)",
    clusters: [
      {
        type: "Производительный (Big Cluster)",
        cores: "2x Cortex-A76",
        frequency: "2.20 GHz",
        governor: "schedutil (EAS)"
      },
      {
        type: "Энергоэффективный (LITTLE Cluster)",
        cores: "6x Cortex-A55",
        frequency: "2.00 GHz",
        governor: "schedutil (EAS)"
      }
    ]
  },
  gpu: {
    model: "ARM Mali-G57 MC2",
    architecture: "Valhall",
    cores: "2 Execution Engines (Bifrost/Valhall DDK)",
    vulkanVersion: "Vulkan 1.3 ICD",
    openGLVersion: "OpenGL ES 3.2",
    renderEngine: "SkiaGL / Threaded RenderThread"
  },
  display: {
    type: "AMOLED Curved 3D Display (10-bit)",
    diagonal: "6.78 дюйма",
    resolution: "1080 x 2436 (FHD+)",
    density: "393 PPI",
    refreshRates: [60, 90, 120],
    pwmFrequency: "2160 Hz PWM Dimming",
    touchSampling: "360 Hz Touch Sampling Rate",
    hdrSupport: "HDR10+ / Wide Color DCI-P3"
  },
  touch: {
    controller: "FocalTech FT3658 / Goodix GT9886",
    protocol: "Multi-touch Protocol Type B (input_mt)",
    multiTouch: 10,
    idcFile: "ft3658.idc",
    features: ["Double-Tap to Wake (KEY_WAKEUP)", "Palm Rejection", "Glove Mode", "High-frequency polling 360Hz"]
  },
  connectivity: {
    wifiChip: "MediaTek MT6631 / MT7663 Combo",
    wifiStandards: "Wi-Fi 5 (802.11 a/b/g/n/ac)",
    wifiBands: "2.4 GHz + 5.0 GHz Dual-Band",
    btVersion: "Bluetooth 5.3 (BLE / LE Audio)",
    btCodecs: ["LDAC (Sony 990kbps)", "AAC", "SBC", "aptX HD", "LC3 (LE Audio)"],
    modem: "4G LTE Cat-13 DL / Cat-7 UL, VoLTE / ViLTE"
  },
  power: {
    capacity: "5000 mAh Li-Polymer",
    charging: "33W Flash Charge (Pump Express / Type-C PD)",
    thermalEngine: "MediaTek CorePilot Thermal Mitigations",
    easSupport: true,
    dozeTuning: "Deep Sleep Doze + Aggressive Wakelock Suppression"
  },
  partitions: {
    type: "Dynamic Partitions (Super Partition)",
    slots: "Virtual A/B (Seamless OTA A/B slots)",
    superSize: "9,126,805,504 bytes (~8.5 GB)",
    filesystems: "EROFS (System/Vendor/Product) + F2FS (Userdata with FBE)"
  }
};
