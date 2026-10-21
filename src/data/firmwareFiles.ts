export interface AospFile {
  path: string;
  name: string;
  category: "device_tree" | "driver_hal" | "power" | "kernel" | "scripts";
  language: "makefile" | "shell" | "json" | "xml" | "ini" | "plaintext";
  description: string;
  getContent: (params: BuildParams) => string;
}

export interface BuildParams {
  androidVersion: string;
  selinuxMode: "enforcing" | "permissive";
  refreshRate: number; // 60, 90, 120
  powerProfile: "battery_saver" | "balanced" | "performance";
  gpuRenderer: "vulkan" | "skiagl";
  dozeTimeoutMin: number;
  enableDoubleTapWake: boolean;
  enableZram: boolean;
  zramSizeMb: number;
  appCompatibilityFlavor: "vanilla" | "microg" | "gapps";
}

export const defaultBuildParams: BuildParams = {
  androidVersion: "16 (Baklava)",
  selinuxMode: "enforcing",
  refreshRate: 120,
  powerProfile: "battery_saver",
  gpuRenderer: "vulkan",
  dozeTimeoutMin: 10,
  enableDoubleTapWake: true,
  enableZram: true,
  zramSizeMb: 3072,
  appCompatibilityFlavor: "microg",
};

export const firmwareFiles: AospFile[] = [
  {
    path: "device/tecno/spark40pro_plus/BoardConfig.mk",
    name: "BoardConfig.mk",
    category: "device_tree",
    language: "makefile",
    description: "Главная аппаратная конфигурация сборки: флаги процессора MT6789, динамические разделы, Mali GPU, дисплей 120Hz и SELinux",
    getContent: (params: BuildParams) => `#
# Copyright (C) 2024 The Android Open Source Project
# Hardware Configuration for TECNO SPARK 40 PRO+ (MT6789 / Helio G100)
#

DEVICE_PATH := device/tecno/spark40pro_plus

# Architecture
TARGET_ARCH := arm64
TARGET_ARCH_VARIANT := armv8-2a
TARGET_CPU_ABI := arm64-v8a
TARGET_CPU_ABI2 :=
TARGET_CPU_VARIANT := cortex-a76

TARGET_2ND_ARCH := arm
TARGET_2ND_ARCH_VARIANT := armv8-2a
TARGET_2ND_CPU_ABI := armeabi-v7a
TARGET_2ND_CPU_ABI2 := armeabi
TARGET_2ND_CPU_VARIANT := cortex-a55

# MediaTek SoC MT6789 Platform
TARGET_BOARD_PLATFORM := mt6789
TARGET_BOOTLOADER_BOARD_NAME := mt6789
BOARD_USES_MTK_HARDWARE := true
MTK_TARGET_PROJECT := spark40pro_plus
${params.androidVersion.includes("16") ? `# Android 16 (Baklava) API 36
PLATFORM_SDK_VERSION := 36
PRODUCT_SHIPPING_API_LEVEL := 34
TARGET_BOOTS_16K := true
BOARD_VNDK_VERSION := current
BOARD_SYSTEMSDK_VERSIONS := 34 35 36` : params.androidVersion.includes("15") ? `# Android 15 (Vanilla Ice Cream) API 35
PLATFORM_SDK_VERSION := 35
PRODUCT_SHIPPING_API_LEVEL := 34
TARGET_BOOTS_16K := true
BOARD_VNDK_VERSION := current` : `# Android 14 (Upside Down Cake) API 34
PLATFORM_SDK_VERSION := 34`}

# Kernel Configuration
BOARD_KERNEL_CMDLINE := bootconfig
BOARD_KERNEL_CMDLINE += androidboot.hardware=mt6789
BOARD_KERNEL_CMDLINE += loop.max_part=7
BOARD_KERNEL_CMDLINE += cgroup.memory=nokmem,nosocket
${params.selinuxMode === "permissive" ? "BOARD_KERNEL_CMDLINE += androidboot.selinux=permissive" : "BOARD_KERNEL_CMDLINE += androidboot.selinux=enforcing"}
BOARD_KERNEL_BASE := 0x40078000
BOARD_KERNEL_PAGESIZE := 2048
BOARD_RAMDISK_OFFSET := 0x07c08000
BOARD_TAGS_OFFSET := 0x0bc08000
BOARD_BOOT_HEADER_VERSION := 4
BOARD_MKBOOTIMG_ARGS += --header_version $(BOARD_BOOT_HEADER_VERSION)

# Linux 5.15 LTS GKI Kernel
TARGET_KERNEL_CONFIG := spark40pro_plus_defconfig
TARGET_KERNEL_SOURCE := kernel/tecno/mt6789
BOARD_KERNEL_IMAGE_NAME := Image.gz

# Dynamic Partitions (Virtual A/B Retrofit / Native)
BOARD_SUPER_PARTITION_SIZE := 9126805504
BOARD_SUPER_PARTITION_GROUPS := tecno_dynamic_partitions
BOARD_TECNO_DYNAMIC_PARTITIONS_SIZE := 9122611200
BOARD_TECNO_DYNAMIC_PARTITIONS_PARTITION_LIST := system system_ext product vendor

# File Systems
BOARD_SYSTEMIMAGE_FILE_SYSTEM_TYPE := erofs
BOARD_SYSTEM_EXTIMAGE_FILE_SYSTEM_TYPE := erofs
BOARD_PRODUCTIMAGE_FILE_SYSTEM_TYPE := erofs
BOARD_VENDORIMAGE_FILE_SYSTEM_TYPE := erofs
BOARD_USERDATAIMAGE_FILE_SYSTEM_TYPE := f2fs
TARGET_USERIMAGES_USE_EXT4 := false
TARGET_USERIMAGES_USE_F2FS := true
BOARD_USES_METADATA_PARTITION := true

# Display & SurfaceFlinger (AMOLED 1080x2436 @ ${params.refreshRate}Hz)
TARGET_USES_HWC2 := true
TARGET_FORCE_HWC_FOR_VIRTUAL_DISPLAYS := true
MAX_VIRTUAL_DISPLAY_DIMENSION := 4096
TARGET_RUNS_AT_120HZ := ${params.refreshRate === 120 ? "true" : "false"}
TARGET_DEFAULT_REFRESH_RATE := ${params.refreshRate}

# Graphics: ARM Mali-G57 MC2 (Valhall Architecture)
BOARD_USES_MALI := true
TARGET_USES_VULKAN := true
BOARD_GPU_DRV_VERSION := r38p0
BOARD_USES_DRM_HWCOMPOSER := true

# Wi-Fi (MediaTek MT6631/MT7663 Combo)
WPA_SUPPLICANT_VERSION := VER_0_8_X
BOARD_WPA_SUPPLICANT_DRIVER := NL80211
BOARD_WPA_SUPPLICANT_PRIVATE_LIB := lib_driver_cmd_mt66xx
BOARD_HOSTAPD_DRIVER := NL80211
BOARD_HOSTAPD_PRIVATE_LIB := lib_driver_cmd_mt66xx
WIFI_DRIVER_FW_PATH_PARAM := "/dev/wmtWifi"
WIFI_DRIVER_FW_PATH_STA := "STA"
WIFI_DRIVER_FW_PATH_AP := "AP"
WIFI_DRIVER_FW_PATH_P2P := "P2P"

# Bluetooth (MTK Combo BT 5.3)
BOARD_HAVE_BLUETOOTH := true
BOARD_HAVE_BLUETOOTH_MTK := true
BOARD_BLUETOOTH_BDROID_BUILDCFG_INCLUDE_DIR := $(DEVICE_PATH)/bluetooth

# Energy Aware Scheduling (EAS) & PowerHAL
BOARD_USES_EAS := true
TARGET_USES_ENERGY_MODEL := true
TARGET_POWERHAL_MODE := aidl
`
  },
  {
    path: "device/tecno/spark40pro_plus/device.mk",
    name: "device.mk",
    category: "device_tree",
    language: "makefile",
    description: "Определение системных пакетов AOSP, копирование прошивок модулей и свойства сборки (SurfaceFlinger, Wi-Fi, Audio)",
    getContent: (params: BuildParams) => `#
# Product Makefile for TECNO SPARK 40 PRO+
# AOSP Android ${params.androidVersion} Base (Clean + Power Optimized)
#

$(call inherit-product, $(SRC_TARGET_DIR)/product/generic_ramdisk.mk)
$(call inherit-product, $(SRC_TARGET_DIR)/product/virtual_ab_ota.mk)
$(call inherit-product, $(SRC_TARGET_DIR)/product/languages_full.mk)

LOCAL_PATH := device/tecno/spark40pro_plus

# Overlays
DEVICE_PACKAGE_OVERLAYS += $(LOCAL_PATH)/overlay
PRODUCT_ENFORCE_RRO_TARGETS := *

# System Properties (Display, GPU, Android 16 & Energy)
PRODUCT_PROPERTY_OVERRIDES += \\
${params.androidVersion.includes("16") ? `    ro.build.version.release=16 \\
    ro.build.version.sdk=36 \\
    ro.build.version.codename=Baklava \\
    ro.sys.16k_page_size=true \\
    ro.window.decor.caption_in_compat_mode=true \\
` : ""}    ro.sf.lcd_density=400 \\
    ro.surface_flinger.has_wide_color_display=true \\
    ro.surface_flinger.has_HDR_display=true \\
    ro.surface_flinger.use_color_management=true \\
    ro.surface_flinger.max_frame_buffer_acquired_buffers=3 \\
    ro.surface_flinger.set_idle_timer_ms=80 \\
    ro.surface_flinger.set_touch_timer_ms=200 \\
    ro.vendor.display.refresh_rate_modes=60,90,120 \\
    ro.vendor.display.default_refresh_rate=${params.refreshRate} \\
    debug.renderengine.backend=${params.gpuRenderer} \\
    ro.hardware.egl=mali \\
    ro.hardware.vulkan=mali \\
    ro.opengles.version=196610 \\
    debug.sf.latch_unsignaled=1

# Power & Battery Optimization Flags (${params.powerProfile})
PRODUCT_PROPERTY_OVERRIDES += \\
    pm.dexopt.downgrade_after_inactive_days=10 \\
    power.saving.mode=1 \\
    ro.config.hw_power_saving=true \\
    ro.ril.power_normal=1 \\
    wifi.supplicant_scan_interval=180 \\
    ro.vendor.mtk_power_gs_support=1 \\
    ro.vendor.powerhal.corepilot=1

# Input Device Configurations (Touchscreen FT3658 / Goodix)
PRODUCT_COPY_FILES += \\
    $(LOCAL_PATH)/configs/idc/ft3658.idc:$(TARGET_COPY_OUT_VENDOR)/usr/idc/ft3658.idc \\
    $(LOCAL_PATH)/configs/idc/goodix_touch.idc:$(TARGET_COPY_OUT_VENDOR)/usr/idc/goodix_touch.idc

# Init Scripts
PRODUCT_COPY_FILES += \\
    $(LOCAL_PATH)/rootdir/etc/init.mt6789.rc:$(TARGET_COPY_OUT_VENDOR)/etc/init/hw/init.mt6789.rc \\
    $(LOCAL_PATH)/rootdir/etc/init.mt6789.power.rc:$(TARGET_COPY_OUT_VENDOR)/etc/init/hw/init.mt6789.power.rc \\
    $(LOCAL_PATH)/rootdir/etc/fstab.mt6789:$(TARGET_COPY_OUT_VENDOR)/etc/fstab.mt6789

# PowerHAL AIDL & Display Configuration
PRODUCT_COPY_FILES += \\
    $(LOCAL_PATH)/configs/power/powerhint.json:$(TARGET_COPY_OUT_VENDOR)/etc/powerhint.json \\
    $(LOCAL_PATH)/configs/display/display_config_fhd_120hz.xml:$(TARGET_COPY_OUT_VENDOR)/etc/display_config_fhd_120hz.xml

# HAL Packages (AIDL / HIDL)
PRODUCT_PACKAGES += \\
    android.hardware.graphics.allocator-V1-service \\
    android.hardware.graphics.composer@2.4-service \\
    android.hardware.wifi-service \\
    android.hardware.bluetooth@1.1-service.mediatek \\
    android.hardware.power-service.mediatek \\
    android.hardware.health-service.mediatek \\
    android.hardware.usb-service.mediatek \\
    wpa_supplicant \\
    hostapd

# Wi-Fi Firmwares
PRODUCT_COPY_FILES += \\
    $(LOCAL_PATH)/firmware/WIFI_RAM_CODE_MT6789:$(TARGET_COPY_OUT_VENDOR)/firmware/WIFI_RAM_CODE_MT6789 \\
    $(LOCAL_PATH)/firmware/soc2_2_ram_bt_1a_1_hdr.bin:$(TARGET_COPY_OUT_VENDOR)/firmware/soc2_2_ram_bt_1a_1_hdr.bin

# Android App Compatibility & Services Flavor (${params.appCompatibilityFlavor.toUpperCase()})
${params.appCompatibilityFlavor === "microg" ? `# MicroG Services Core & Signature Spoofing Framework
PRODUCT_PACKAGES += \\
    GmsCore \\
    GsfProxy \\
    FakeStore \\
    com.google.android.maps \\
    UnifiedNlp

PRODUCT_COPY_FILES += \\
    $(LOCAL_PATH)/configs/permissions/privapp-permissions-microg.xml:$(TARGET_COPY_OUT_SYSTEM)/etc/permissions/privapp-permissions-microg.xml

# Enable Signature Spoofing for MicroG compatibility
PRODUCT_PACKAGE_OVERLAYS += $(LOCAL_PATH)/overlay-microg` : params.appCompatibilityFlavor === "gapps" ? `# Google Mobile Services (MindTheGapps / NikGApps integration)
$(call inherit-product-if-exists, vendor/gapps/arm64/arm64-vendor.mk)
PRODUCT_PACKAGES += \\
    Phonesky \\
    GoogleServicesFramework \\
    PrebuiltGmsCore` : `# Pure Vanilla AOSP: 100% Android Runtime (ART) compatibility
# Compatible with APK sideloading, RuStore, Aurora Store, and F-Droid`}
`
  },
  {
    path: "device/tecno/spark40pro_plus/rootdir/etc/init.mt6789.rc",
    name: "init.mt6789.rc",
    category: "device_tree",
    language: "ini",
    description: "Скрипт инициализации Init Android: запуск служб, права доступа к sysfs узлам сенсора, подсветки и радиомодулей",
    getContent: (params: BuildParams) => `#
# Init script for TECNO SPARK 40 PRO+ (MT6789)
#

on early-init
    mount debugfs debugfs /sys/kernel/debug
    chmod 0755 /sys/kernel/debug

on init
    # ZRAM Swapping Optimization
    ${params.enableZram ? `write /sys/block/zram0/comp_algorithm lz4
    write /sys/block/zram0/disksize ${params.zramSizeMb * 1024 * 1024}
    mkswap /dev/block/zram0
    swapon_all /vendor/etc/fstab.mt6789` : "# ZRAM disabled by configuration"}

    # Memory Management
    write /proc/sys/vm/swappiness 60
    write /proc/sys/vm/vfs_cache_pressure 90
    write /proc/sys/vm/dirty_background_ratio 5
    write /proc/sys/vm/dirty_ratio 15

on fs
    mount_all /vendor/etc/fstab.mt6789 --early

on late-fs
    mount_all /vendor/etc/fstab.mt6789 --late

on post-fs-data
    # Wi-Fi directory permissions
    mkdir /data/vendor/wifi 0770 wifi wifi
    mkdir /data/vendor/wifi/wpa 0770 wifi wifi
    mkdir /data/vendor/wifi/wpa/sockets 0770 wifi wifi

    # Touch gesture wake permissions
    chown system system /sys/class/touch/ft_gesture/wake_gesture
    chmod 0664 /sys/class/touch/ft_gesture/wake_gesture
    ${params.enableDoubleTapWake ? "write /sys/class/touch/ft_gesture/wake_gesture 1" : "write /sys/class/touch/ft_gesture/wake_gesture 0"}

    # Display 120Hz sysfs control
    chown system system /sys/devices/platform/1100f000.disp/refresh_rate
    chmod 0664 /sys/devices/platform/1100f000.disp/refresh_rate
    write /sys/devices/platform/1100f000.disp/refresh_rate ${params.refreshRate}

on boot
    # Wi-Fi Kernel Driver Probing
    insmod /vendor/lib/modules/wlan_drv_gen4m.ko
    insmod /vendor/lib/modules/btmtksdio.ko

    # Bluetooth MAC setup
    chown bluetooth bluetooth /dev/ttyMT0
    chmod 0660 /dev/ttyMT0

    # Mali-G57 Power Management
    chown system system /sys/class/misc/mali0/device/power_policy
    chmod 0664 /sys/class/misc/mali0/device/power_policy
    write /sys/class/misc/mali0/device/power_policy coarse_demand
`
  },
  {
    path: "device/tecno/spark40pro_plus/rootdir/etc/init.mt6789.power.rc",
    name: "init.mt6789.power.rc",
    category: "power",
    language: "ini",
    description: "Настройки ядер процессора, планировщика EAS schedutil и агрессивного энергосбережения в режиме простоя",
    getContent: (params: BuildParams) => `#
# Power Management & Energy Aware Scheduling for Helio G100
# Profile: ${params.powerProfile.toUpperCase()}
#

on boot
    # Enable Energy-Aware Scheduling
    write /proc/sys/kernel/sched_energy_aware 1

    # CPUFreq EAS Schedutil Governor Configuration
    # LITTLE cluster (Cortex-A55, cpu0-5)
    write /sys/devices/system/cpu/cpufreq/policy0/scaling_governor "schedutil"
    write /sys/devices/system/cpu/cpufreq/policy0/schedutil/up_rate_limit_us 500
    write /sys/devices/system/cpu/cpufreq/policy0/schedutil/down_rate_limit_us ${params.powerProfile === "battery_saver" ? "20000" : "5000"}

    # Big cluster (Cortex-A76, cpu6-7)
    write /sys/devices/system/cpu/cpufreq/policy6/scaling_governor "schedutil"
    write /sys/devices/system/cpu/cpufreq/policy6/schedutil/up_rate_limit_us ${params.powerProfile === "battery_saver" ? "1000" : "200"}
    write /sys/devices/system/cpu/cpufreq/policy6/schedutil/down_rate_limit_us ${params.powerProfile === "battery_saver" ? "30000" : "10000"}

    # CorePilot Cluster Idle Parking
    ${params.powerProfile === "battery_saver" ? `# Aggressive idle: Park big cores when screen turns off
    write /sys/devices/system/cpu/cpu6/online 1
    write /sys/devices/system/cpu/cpu7/online 1
    write /proc/cpufreq/cpufreq_power_mode 3` : "# Balanced CorePilot mode\n    write /proc/cpufreq/cpufreq_power_mode 1"}

on property:sys.boot_completed=1
    # Doze idle timeout tuning
    write /sys/module/wakeup/parameters/enable_si_ws 0
    write /sys/module/lpm_levels/parameters/sleep_disabled 0

    # Background service restrictions
    setprop persist.sys.power.deep_doze_delay_sec ${params.dozeTimeoutMin * 60}
`
  },
  {
    path: "device/tecno/spark40pro_plus/configs/power/powerhint.json",
    name: "powerhint.json",
    category: "power",
    language: "json",
    description: "AIDL PowerHAL: профили ускорения при касании, ограничение частот при низком заряде и Doze Mode",
    getContent: (params: BuildParams) => JSON.stringify({
      "PowerHAL": {
        "Version": "AIDL-MT6789-V1",
        "TargetDevice": "spark40pro_plus",
        "TargetPlatform": "Helio G100",
        "TuningProfile": params.powerProfile,
        "DeepDozeIdleTimeoutMinutes": params.dozeTimeoutMin,
        "Nodes": [
          {
            "Name": "CPULittleClusterMin",
            "Path": "/sys/devices/system/cpu/cpufreq/policy0/scaling_min_freq",
            "Values": ["416000", "800000", "1200000", "2000000"],
            "DefaultIndex": 0
          },
          {
            "Name": "CPUBigClusterMin",
            "Path": "/sys/devices/system/cpu/cpufreq/policy6/scaling_min_freq",
            "Values": ["600000", "1000000", "1600000", "2200000"],
            "DefaultIndex": 0
          },
          {
            "Name": "GPUMaliMinFreq",
            "Path": "/sys/class/misc/mali0/device/min_freq",
            "Values": ["300", "500", "750", "950"],
            "DefaultIndex": 0
          }
        ],
        "Actions": [
          {
            "PowerHint": "INTERACTION",
            "DurationMs": params.powerProfile === "battery_saver" ? 60 : 120,
            "TargetNode": "CPULittleClusterMin",
            "TargetValue": "1200000"
          },
          {
            "PowerHint": "LAUNCH",
            "DurationMs": 2000,
            "TargetNode": "CPUBigClusterMin",
            "TargetValue": "2200000"
          },
          {
            "PowerHint": "LOW_POWER",
            "DurationMs": 0,
            "TargetNode": "CPUBigClusterMin",
            "TargetValue": "600000"
          },
          {
            "PowerHint": "SUSTAINED_PERFORMANCE",
            "DurationMs": 0,
            "TargetNode": "GPUMaliMinFreq",
            "TargetValue": params.powerProfile === "performance" ? "750" : "500"
          }
        ],
        "StandardServicesOptimization": {
          "DeepDozeScreenOffGracePeriodSec": params.dozeTimeoutMin * 60,
          "AggressiveSensorLimiter": true,
          "WifiScanIntervalIdleSec": 300,
          "NetworkWakeLockThrottling": true
        }
      }
    }, null, 2)
  },
  {
    path: "device/tecno/spark40pro_plus/configs/idc/ft3658.idc",
    name: "ft3658.idc",
    category: "driver_hal",
    language: "ini",
    description: "Input Device Configuration (IDC) для сенсорного экрана FocalTech FT3658 с частотой опроса 360Hz",
    getContent: (params: BuildParams) => `#
# Input Device Configuration for FocalTech FT3658 Touchscreen
# TECNO SPARK 40 PRO+
#

touch.deviceType = touchScreen
touch.orientationAware = 1

# Touch Resolution (1080 x 2436)
touch.size.calibration = geometric
touch.size.scale = 1
touch.size.bias = 0
touch.size.isSummed = 0

# Pressure Calibration
touch.pressure.calibration = physical
touch.pressure.scale = 0.001

# Multi-touch Parameters & Polling Rate (360Hz)
touch.gestureMode = spots
touch.filter.level = 2
touch.coverage.calibration = box

# Wakeup Gestures (Double-tap to wake)
touch.wake.enabled = ${params.enableDoubleTapWake ? "1" : "0"}
touch.wake.gesture = 0x01
`
  },
  {
    path: "device/tecno/spark40pro_plus/configs/display/display_config_fhd_120hz.xml",
    name: "display_config_fhd_120hz.xml",
    category: "driver_hal",
    language: "xml",
    description: "Конфигурация AMOLED-экрана: кривые яркости PWM 2160Hz, динамические режимы 60/90/120Hz и цветовые профили",
    getContent: (params: BuildParams) => `<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<!-- Display Configuration for TECNO SPARK 40 PRO+ Curved AMOLED -->
<displayConfiguration>
    <name>AMOLED_678_FHD_120HZ</name>
    <densityMapping>
        <density>
            <width>1080</width>
            <height>2436</height>
            <density>400</density>
        </density>
    </densityMapping>
    
    <refreshRateConfigs>
        <defaultPeakRefreshRate>${params.refreshRate}</defaultPeakRefreshRate>
        <defaultRefreshRateInHbm>${params.refreshRate}</defaultRefreshRateInHbm>
        <refreshRateRange>
            <minimum>60</minimum>
            <maximum>${params.refreshRate}</maximum>
        </refreshRateRange>
        <supportedModes>
            <mode id="1" width="1080" height="2436" refreshRate="60.0" />
            <mode id="2" width="1080" height="2436" refreshRate="90.0" />
            <mode id="3" width="1080" height="2436" refreshRate="120.0" />
        </supportedModes>
    </refreshRateConfigs>

    <highBrightnessMode enabled="true">
        <transitionPoint>0.85</transitionPoint>
        <minimumLux>20000</minimumLux>
        <hbmType>sunlight</hbmType>
    </highBrightnessMode>

    <screenBrightnessMap>
        <point><lux>0</lux><nits>2.0</nits></point>
        <point><lux>10</lux><nits>35.0</nits></point>
        <point><lux>500</lux><nits>450.0</nits></point>
        <point><lux>10000</lux><nits>900.0</nits></point>
        <point><lux>40000</lux><nits>1300.0</nits></point>
    </screenBrightnessMap>
</displayConfiguration>
`
  },
  {
    path: "device/tecno/spark40pro_plus/rootdir/etc/fstab.mt6789",
    name: "fstab.mt6789",
    category: "device_tree",
    language: "plaintext",
    description: "Монтирование дисковых разделов с Dynamic Partitions (Super) и шифрованием F2FS/FBE",
    getContent: () => `#
# Android FSTAB for TECNO SPARK 40 PRO+
# <src>                                <mnt_point>     <type>  <mnt_flags and options>                                  <fs_mgr_flags>
system                                  /system         erofs   ro                                                       wait,slotselect,logical,first_stage_mount,avb=vbmeta_system
system_ext                              /system_ext     erofs   ro                                                       wait,slotselect,logical,first_stage_mount,avb=vbmeta_system
product                                 /product        erofs   ro                                                       wait,slotselect,logical,first_stage_mount,avb=vbmeta_system
vendor                                  /vendor         erofs   ro                                                       wait,slotselect,logical,first_stage_mount,avb=vbmeta_vendor

/dev/block/by-name/metadata             /metadata       ext4    noatime,nosuid,nodev,discard                             wait,check,formattable,first_stage_mount
/dev/block/by-name/userdata             /data           f2fs    noatime,nosuid,nodev,discard,inlinecrypt                 latemount,wait,check,formattable,quota,reservedsize=128M,checkpoint=fs,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized
/dev/block/by-name/boot                 /boot           emmc    defaults                                                 wait,slotselect,first_stage_mount
/dev/block/by-name/dtbo                 /dtbo           emmc    defaults                                                 wait,slotselect,first_stage_mount
/dev/block/by-name/vbmeta               /vbmeta         emmc    defaults                                                 wait,slotselect,first_stage_mount,avb
`
  },
  {
    path: "device/tecno/spark40pro_plus/manifest.xml",
    name: "manifest.xml",
    category: "driver_hal",
    language: "xml",
    description: "VINTF Manifest: декларирование AIDL HAL интерфейсов дисплея, графики Mali, Wi-Fi и Bluetooth",
    getContent: (params: BuildParams) => `<manifest version="5.0" type="device" target-level="${params.androidVersion.includes("16") ? "202504" : params.androidVersion.includes("15") ? "202404" : "8"}">
    <hal format="aidl">
        <name>android.hardware.graphics.allocator</name>
        <version>1</version>
        <interface>
            <name>IAllocation</name>
            <instance>default</instance>
        </interface>
    </hal>
    <hal format="aidl">
        <name>android.hardware.graphics.composer</name>
        <version>3</version>
        <interface>
            <name>IComposer</name>
            <instance>default</instance>
        </interface>
        <fqname>@2.4::IComposer/default</fqname>
    </hal>
    <hal format="aidl">
        <name>android.hardware.wifi</name>
        <version>1</version>
        <interface>
            <name>IWifi</name>
            <instance>default</instance>
        </interface>
    </hal>
    <hal format="aidl">
        <name>android.hardware.bluetooth</name>
        <version>1</version>
        <interface>
            <name>IBluetoothHci</name>
            <instance>default</instance>
        </interface>
    </hal>
    <hal format="aidl">
        <name>android.hardware.power</name>
        <version>4</version>
        <interface>
            <name>IPower</name>
            <instance>default</instance>
        </interface>
    </hal>
    <hal format="aidl">
        <name>android.hardware.health</name>
        <version>2</version>
        <interface>
            <name>IHealth</name>
            <instance>default</instance>
        </interface>
    </hal>
</manifest>
`
  },
  {
    path: "device/tecno/spark40pro_plus/kernel/spark40pro_plus_defconfig",
    name: "spark40pro_plus_defconfig",
    category: "kernel",
    language: "plaintext",
    description: "Конфигурация ядра Linux 5.15 LTS: драйверы Mali Bifrost/Valhall, дисплея DRM KMS, MTK Wi-Fi и EAS",
    getContent: (params: BuildParams) => `#
# Linux Kernel 5.15 LTS Configuration for MT6789 (TECNO SPARK 40 PRO+)
#
CONFIG_ARCH_MEDIATEK=y
CONFIG_MACH_MT6789=y

# CPU Architecture & Scheduling
CONFIG_ARM64=y
CONFIG_ARM64_VA_BITS_39=y
CONFIG_SCHED_MC=y
CONFIG_ENERGY_MODEL=y
CONFIG_CPU_FREQ_GOV_SCHEDUTIL=y
CONFIG_CPU_IDLE=y
CONFIG_ARM_CPUIDLE=y

# Mali-G57 GPU Driver
CONFIG_MALI_BIFROST=m
CONFIG_MALI_PLATFORM_NAME="devicetree"
CONFIG_MALI_MIDGARD_DVFS=y
CONFIG_MALI_DEVFREQ=y
CONFIG_DRM_PANFROST=n

# Display DRM / KMS Subsystem
CONFIG_DRM=y
CONFIG_DRM_MEDIATEK=y
CONFIG_DRM_PANEL_ORIENTATION_QUIRKS=y
CONFIG_FB=y
CONFIG_BACKLIGHT_CLASS_DEVICE=y
CONFIG_BACKLIGHT_PWM=y

# Touchscreen
CONFIG_INPUT_TOUCHSCREEN=y
CONFIG_TOUCHSCREEN_FOCALTECH=m
CONFIG_TOUCHSCREEN_GOODIX=m
${params.enableDoubleTapWake ? "CONFIG_TOUCHSCREEN_GESTURE_WAKEUP=y" : "# CONFIG_TOUCHSCREEN_GESTURE_WAKEUP is not set"}

# Wi-Fi & Bluetooth Connectivity
CONFIG_WLAN=y
CONFIG_WLAN_VENDOR_MEDIATEK=y
CONFIG_MTK_COMBO_WIFI=m
CONFIG_MTK_COMBO_BT=m
CONFIG_BT_HCIUART=m
CONFIG_BT_HCIUART_H4=y

# Power Management & Battery
CONFIG_BATTERY_MT6357=y
CONFIG_CHARGER_MT6357=y
CONFIG_MTK_PUMP_EXPRESS_PLUS_SUPPORT=y
CONFIG_SUSPEND=y
CONFIG_PM_AUTOSLEEP=y
CONFIG_PM_WAKELOCKS=y
`
  },
  {
    path: "device/tecno/spark40pro_plus/scripts/flash_all.sh",
    name: "flash_all.sh",
    category: "scripts",
    language: "shell",
    description: "Bash-скрипт автоматической прошивки через Fastboot (Linux / macOS) с поддержкой Dynamic Partitions",
    getContent: () => `#!/usr/bin/env bash
#
# Fastboot Flashing Script for TECNO SPARK 40 PRO+
# Dynamic Super Partition + Virtual A/B
#

set -e

echo "========================================================"
echo " TECNO SPARK 40 PRO+ - AOSP Android 14 Flasher"
echo "========================================================"

# Check Fastboot connection
if ! fastboot devices | grep -q "fastboot"; then
    echo "[!] Ошибка: Смартфон не обнаружен в режиме Fastboot."
    echo "    Переведите устройство в режим Fastboot (Power + Vol Down)"
    exit 1
fi

echo "[*] Устройство обнаружено."
SLOT=$(fastboot getvar current-slot 2>&1 | awk -F': ' '/current-slot/ {print $2}')
echo "[*] Активный слот: \${SLOT:-a}"

echo "[*] 1/5 Прошивка ядра boot..."
fastboot flash boot_a boot.img
fastboot flash boot_b boot.img

echo "[*] 2/5 Прошивка dtbo..."
fastboot flash dtbo_a dtbo.img
fastboot flash dtbo_b dtbo.img

echo "[*] 3/5 Прошивка vendor_boot..."
fastboot flash vendor_boot_a vendor_boot.img
fastboot flash vendor_boot_b vendor_boot.img

echo "[*] 4/5 Прошивка vbmeta с отключением верификации..."
fastboot --disable-verity --disable-verification flash vbmeta_a vbmeta.img
fastboot --disable-verity --disable-verification flash vbmeta_b vbmeta.img

echo "[*] 5/5 Прошивка динамического раздела Super..."
fastboot flash super super.img

echo "[?] Желаете выполнить сброс раздела userdata? (y/n)"
read -r CONFIRM
if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
    echo "[*] Очистка userdata (Factory Reset)..."
    fastboot erase userdata
    fastboot erase metadata
fi

echo "[*] Прошивка успешно завершена! Перезагрузка в систему..."
fastboot reboot
`
  },
  {
    path: "device/tecno/spark40pro_plus/scripts/flash_all.bat",
    name: "flash_all.bat",
    category: "scripts",
    language: "shell",
    description: "Windows BAT-скрипт прошивки через Fastboot с цветным выводом и проверками",
    getContent: () => `@echo off
title TECNO SPARK 40 PRO+ Fastboot Flasher
color 0b

echo ========================================================
echo  TECNO SPARK 40 PRO+ - AOSP Android 14 Flasher (Windows)
echo ========================================================
echo.

fastboot devices > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Устройство не обнаружено в режиме Fastboot!
    echo Проверьте подключение USB и установку драйвера MediaTek VCore.
    pause
    exit /b 1
)

echo [*] Прошивка основных разделов (A/B slots)...
fastboot flash boot_a boot.img
fastboot flash boot_b boot.img
fastboot flash dtbo_a dtbo.img
fastboot flash dtbo_b dtbo.img
fastboot flash vendor_boot_a vendor_boot.img
fastboot flash vendor_boot_b vendor_boot.img
fastboot --disable-verity --disable-verification flash vbmeta_a vbmeta.img
fastboot --disable-verity --disable-verification flash vbmeta_b vbmeta.img

echo [*] Прошивка динамического раздела Super...
fastboot flash super super.img

echo.
set /p WIPE="Выполнить очистку userdata (y/n)? "
if /i "%WIPE%"=="y" (
    fastboot erase userdata
    fastboot erase metadata
)

echo [*] Готово! Перезагрузка смартфона...
fastboot reboot
pause
`
  },
  {
    path: "device/tecno/spark40pro_plus/scripts/build_rom.sh",
    name: "build_rom.sh",
    category: "scripts",
    language: "shell",
    description: "Скрипт компиляции прошивки из корня исходного кода AOSP",
    getContent: () => `#!/usr/bin/env bash
#
# Build script for AOSP on TECNO SPARK 40 PRO+
#

set -e

echo "[*] Инициализация окружения сборки AOSP 14..."
source build/envsetup.sh

echo "[*] Выбор целевого устройства spark40pro_plus..."
lunch aosp_spark40pro_plus-userdebug

echo "[*] Очистка промежуточных артефактов (ninja clean)..."
# make installclean

CORES=$(nproc)
echo "[*] Старт компиляции на $CORES потоках..."
m bacon -j"$CORES"

echo "[*] Сборка успешно завершена!"
echo "    Образы прошивки находятся в out/target/product/spark40pro_plus/"
`
  },
  {
    path: "device/tecno/spark40pro_plus/overlay-microg/frameworks/base/core/res/res/values/config.xml",
    name: "config.xml (MicroG Overlay)",
    category: "device_tree",
    language: "xml",
    description: "Android Framework RRO Overlay: включение Signature Spoofing для подмены цифровой подписи Google Play Services",
    getContent: () => `<?xml version="1.0" encoding="utf-8"?>
<!--
    MicroG Signature Spoofing Overlay for TECNO SPARK 40 PRO+
    Enables com.google.android.gms package signature spoofing
-->
<resources>
    <!-- Whether to allow signature spoofing for MicroG -->
    <bool name="config_allowSignatureSpoofing">true</bool>

    <!-- Packages authorized for signature spoofing -->
    <string-array name="config_signatureSpoofingPackageWhitelist" translatable="false">
        <item>com.google.android.gms</item>
        <item>com.android.vending</item>
    </string-array>

    <!-- UnifiedNlp backend resolvers -->
    <string-array name="config_locationProviderPackageNames" translatable="false">
        <item>com.google.android.gms</item>
        <item>org.microg.nlp.backend.ichnaea</item>
    </string-array>
</resources>
`
  },
  {
    path: "device/tecno/spark40pro_plus/configs/permissions/privapp-permissions-microg.xml",
    name: "privapp-permissions-microg.xml",
    category: "driver_hal",
    language: "xml",
    description: "Привилегированные системные права для GmsCore (геолокация, Doze whitelist, background start)",
    getContent: () => `<?xml version="1.0" encoding="utf-8"?>
<!-- Privileged permissions for MicroG Core on TECNO SPARK 40 PRO+ -->
<permissions>
    <privapp-permissions package="com.google.android.gms">
        <permission name="android.permission.FAKE_PACKAGE_SIGNATURE" />
        <permission name="android.permission.ACCESS_COARSE_LOCATION" />
        <permission name="android.permission.ACCESS_FINE_LOCATION" />
        <permission name="android.permission.CHANGE_DEVICE_IDLE_TEMP_WHITELIST" />
        <permission name="android.permission.START_ACTIVITIES_FROM_BACKGROUND" />
        <permission name="android.permission.INTERACT_ACROSS_USERS" />
        <permission name="android.permission.WRITE_SECURE_SETTINGS" />
    </privapp-permissions>

    <privapp-permissions package="com.android.vending">
        <permission name="android.permission.FAKE_PACKAGE_SIGNATURE" />
        <permission name="android.permission.INSTALL_PACKAGES" />
        <permission name="android.permission.DELETE_PACKAGES" />
    </privapp-permissions>
</permissions>
`
  }
];
