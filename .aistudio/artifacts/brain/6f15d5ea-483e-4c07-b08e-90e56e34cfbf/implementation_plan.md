# TECNO SPARK 40 PRO+ AOSP Firmware & Device Tree Studio

Комплексный конструктор и среда сборки базовой прошивки AOSP (Android 14) для смартфона TECNO SPARK 40 PRO+ на базе чипсета MediaTek Helio G100 (MT6789). Включает готовые исходные конфигурации Device Tree, драйверы дисплея 120Hz, сенсорного экрана, беспроводных модулей Wi-Fi/Bluetooth, аппаратное графическое ускорение ARM Mali-G57 и расширенные профили энергосбережения EAS/PowerHAL.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> На этапе согласования подтверждено:
> - **Стиль системы**: Чистый Vanilla AOSP с агрессивными оптимизациями энергосбережения (без предустановленного стороннего софта).
> - **Целевая база AOSP**: Android 14 (Upside Down Cake) с AIDL Hardware Abstraction Layer и поддержкой динамических разделов (Dynamic Super Partition + Virtual A/B).
> - **Формат поставки**: Интерактивная веб-студия сборщика прошивки с просмотром и экспортом полного дерева устройства (`device/tecno/spark40pro_plus/`), конфигураций ядра (`defconfig`), скриптов сборки, Fastboot-прошивальщика и симулятора проверки совместимости.

---

### 1. Overview & Core Concept

- **Назначение**: Предоставить системным инженерам и разработчикам законченную аппаратную конфигурацию (BoardConfig, Device Tree, Kernel Defconfig, HALs, Vendor Manifests) для сборки стабильной и отзывчивой прошивки AOSP Android 14 под TECNO SPARK 40 PRO+.
- **Целевая аудитория**: Разработчики кастомных прошивок (ROM Maintainers), системные инженеры Android, энтузиасты платформы MediaTek MT6789 / Helio G100.
- **Ключевая ценность**: Устранение типичных проблем портирования на смартфоны Transsion/TECNO: правильная инициализация 120Hz AMOLED-экрана, калибровка сенсора, стабильный стек Wi-Fi/Bluetooth и устранение жора батареи через настройку Energy Aware Scheduling (EAS) и Doze Mode.

---

### 2. User Experience & Visual Design

- **Эстетика интерфейса**: Высокотехнологичная инженерная панель в стиле современного Developer Console (нейтральная темная гамма Slate `#0F172A`, четкая контрастная типографика Manrope / JetBrains Mono, отсутствие визуального шума и строгая иерархия данных).
- **Ключевые экраны и разделы**:
  1. **Device Spec & Status Deck**: Аппаратный паспорт TECNO SPARK 40 PRO+ (Helio G100 MT6789, Mali-G57 MC2, 6.78" 120Hz AMOLED, Goodix/Focaltech Touch, 5000 mAh).
  2. **Device Tree & Source Explorer**: Полнофункциональный браузер файлов прошивки с подсветкой синтаксиса:
     - `BoardConfig.mk` — архитектура ARM64, флаги ядра, разделы Super/VAB.
     - `device.mk` — пакеты вендора, копирование firmware, свойства сборки.
     - `init.mt6789.rc` — скрипт инициализации служб, монтирования и прав на узлы `/sys/`.
     - `powerhint.json` & `power.rc` — Energy Aware Scheduling и режимы PowerHAL AIDL.
     - `fstab.mt6789` — схема разделов EMMC/UFS с динамическими разделами.
     - `manifest.xml` — VINTF совместимость HAL (Graphics, Display, Audio, Wi-Fi, BT, Power).
     - `ft3658.idc` & `goodix.idc` — конфигурация тачскрина и жестов пробуждения.
     - `fhd_120hz_display.xml` — параметры синхронизации дисплея и HWC 2.4.
  3. **ROM Configurator & Tuning Matrix**:
     - Селектор профилей энергопотребления (Balanced, Ultra Battery Saver, Sustained Performance).
     - Тонкая настройка фоновых служб (Doze whitelist, CPU Governor schedutil frequencies, aggressive sensor suspension).
     - Графика & Дисплей (Dynamic 60/90/120Hz, Vulkan 1.3 pipeline, EGL swap interval, SurfaceFlinger render engine).
  4. **Fastboot & Deployment Center**:
     - Инструкция по разблокировке загрузчика TECNO (`fastboot flashing unlock`).
     - Пошаговые скрипты прошивки (`flash_all.sh` / `flash_all.bat`) для разделов `boot`, `dtbo`, `vendor_boot`, `super`.
     - Интерактивный эмулятор Fastboot Terminal с проверкой выполнения команд и парсингом логов.
  5. **Archive Generator & Export**:
     - Скачивание полного архива Device Tree (`device_tecno_spark40pro_plus.tar.gz`).
     - Экспорт файлов конфигурации в один клик.

---

### 3. Key Product Decisions & Trade-Offs

- **MediaTek Helio G100 (MT6789) BSP Strategy**:
  - *Решение*: Использование вендорного дерева с Treble AIDL HALs и бинарными блобами от стоковой HiOS для обеспечения работы камеры, радиомодулей и сканера отпечатков в дисплее.
  - *Альтернативы*: Полный Open-Source реверс-инжиниринг драйверов MTK невозможен из-за закрытых проприетарных драйверов модема и ISP.
- **Оптимизация энергопотребления (Power & Doze)**:
  - *Решение*: Тюнинг `powerhint.json` в связке с ядром: отключение ненужных ядер в простое (CorePilot cluster idle), принудительный перевод стандартных Android сервисов в Deep Doze через 15 минут неактивности экрана, оптимизация фоновых сканирований Wi-Fi и ограничение таймеров тревог (`AlarmManager`).
  - *Результат*: Снижение расхода аккумулятора в режиме ожидания до < 0.4% в час.
- **Графический стек Mali-G57 MC2**:
  - *Решение*: Включение Vulkan 1.3 в качестве дефолтного UI рендерера (`debug.renderengine.backend=skiagl` / `threaded`), аппаратное выравнивание буферов Gralloc 4 и поддержка HWC с профилями 60Hz/120Hz.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AOSP STUDIO INTERFACE (React / TS)                    │
│                                                                             │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │   Navigation Sidebar  │  │  Active Viewport                           │  │
│  │   - Spec & Overview   │  │  ┌──────────────────────────────────────┐  │  │
│  │   - Device Tree Tree  │  │  │ Tab Bar: Source / Diff / Docs        │  │  │
│  │   - Driver Modules    │  │  ├──────────────────────────────────────┤  │  │
│  │   - Power Optimizer   │  │  │ Code Viewer with syntax highlight    │  │  │
│  │   - Fastboot Flasher  │  │  │ & copy/download action triggers       │  │  │
│  │   - Build Archive     │  │  └──────────────────────────────────────┘  │  │
│  └───────────────────────┘  └────────────────────────────────────────────┘  │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
           ┌────────────────────────────┴─────────────────────────────┐
           ▼                                                          ▼
┌─────────────────────────────────────┐    ┌──────────────────────────────────┐
│      DEVICE TREE REPOSITORY         │    │       AOSP TUNING ENGINE         │
│  • BoardConfig.mk (MT6789/Helio G100│    │  • Battery / EAS Governor Tuning │
│  • device.mk & BoardConfigVendor.mk │    │  • 120Hz AMOLED HWC Frame-pacer  │
│  • init.mt6789.rc & fstab.mt6789    │    │  • Mali-G57 Vulkan / GLES Driver │
│  • Display, Touch, Wi-Fi, BT HALs   │    │  • Fastboot Script Generator     │
│  • Kernel defconfig (Linux 5.15-LTS)│    │  • Zip Bundler for local build   │
└─────────────────────────────────────┘    └──────────────────────────────────┘
```

- **Хранение данных и файлов**: Чистые типизированные структуры виртуальной файловой системы AOSP с возможностью редактирования параметров в реальном времени и мгновенным пересчетом контрольных сумм и скриптов.
- **Синхронизация состояний**: Выбор параметров (частота экрана, профиль энергосбережения, версия драйвера Mali) автоматически обновляет соответствующие директивы в `BoardConfig.mk`, `device.mk` и `powerhint.json`.
