# Firmware Analysis & Updates

This document tracks everything related to the firmware of the MK1300 V2 keyboard, including updating, dumping, and analyzing firmware binaries.

## The Firmware Update Mechanism

The OEM software relies on a specific update manifest (`update.json`) to map Vendor ID and Product ID combinations to binary firmware files.

### Identified Firmware Mappings

| Internal ID | OEM Model Name | Firmware File | Configured Version |
|-------------|----------------|---------------|--------------------|
| `36ae_fead` | Youhua Z61-ARGB (MK1300v2) | `36ae_fead.bin` | v9 |
| `36ae_febb` | Jinyi 9800 (26-key NKRO) | `36ae_febb.bin` | v2 |
| `36ae_fe9c` | Xinhengwei | `36ae_fe9c.bin` | v4 |
| `36ae_feae` | Youhua TOP104-ARGB | `36ae_feae.bin` | v6 |
| `36ae_fea3` | Youhua TK83-ARGB | `36ae_fea3.bin` | v6 |

*(Note: These firmware versions correspond to the ones shipped within the proprietary tool.)*

## Bootloader Interface

Flashing the firmware involves switching the keyboard into a specific bootloader mode. The OEM software tracks a dedicated device for this:
* **Bootloader VID:** `0x5566`
* **Bootloader PID:** `0x0009`
* **Usage Page:** `0xFF00`
* **Usage:** `0x0001`

**WARNING:** Do not manually attempt to flash these binaries to your keyboard until the protocol is fully documented. A failed flash may permanently brick the keyboard if there is no documented recovery method.

## Firmware Preservation

If community members capture newer firmware `.bin` files via USB sniffing or extraction from newer software versions, they will be cataloged in `firmware/metadata/`. We do not host copyrighted manufacturer binaries directly in this repository.

### Analyzing the Binary

To properly understand the firmware format, we need to:
1. Identify if it's encrypted or plaintext (run `binwalk` or `strings` on `36ae_fead.bin`).
2. Identify the target architecture (e.g., ARM Cortex-M0/M3, 8051, etc.).
3. Discover checksum offsets to allow repacking custom firmware.
