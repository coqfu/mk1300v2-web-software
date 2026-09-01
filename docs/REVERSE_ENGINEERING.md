# MK1300v2 OEM Software Reverse Engineering Notes

Upon investigating the internal files of the Electron application, specifically `main/assets/vid_pid_offline.js` and `build/update.json`, we uncovered the true origins of the MK1300v2 and its OEM (Original Equipment Manufacturer).

## The "True" Identity of the Keyboard
The software is a generic, white-labeled tool designed by a Chinese OEM to configure multiple keyboards. The MK1300v2 is a rebrand of one of these generic boards. 

The source code contains a commented-out list of **all supported OEM keyboards**. Here are the hidden hardware IDs (Vendor ID / Product ID) and their original Chinese names:

### Manufacturer: Youhua (有华)
- `VID: 0x36ae, PID: 0xfeae` - Youhua TOP104-ARGB
- `VID: 0x36ae, PID: 0xfea3` - Youhua TK83-ARGB
- `VID: 0x3151, PID: 0x6000` - Youhua TL68-ARGB (French Layout)
- `VID: 0x36ae, PID: 0xfe81` - Youhua mini87UK-ARGB
- `VID: 0x36ae, PID: 0xfea4` - Youhua U98PRO(YH201)-ARGB
- `VID: 0x36ae, PID: 0xfda1` - Youhua ZA64-ARGB (28Pin)
- `VID: 0x36ae, PID: 0xfeab` - Youhua V68-ARGB (28Pin)
- `VID: 0x36ae, PID: 0xfead` - **Youhua Z61-ARGB (Currently active in the code!)**
- `VID: 0x36ae, PID: 0xfe80` - Youhua ZA87-UK-ARGB

### Manufacturer: Sanpin (三品)
- `VID: 0x36ae, PID: 0xfe9d` - Sanpin AK08M-DS
- `VID: 0x36ae, PID: 0xfe15` - Sanpin AK110M-KB926L-DE

### Manufacturer: Jinyi Electronics (金壹电子)
- `VID: 0x36ae, PID: 0xfebb` - Jinyi 9800 (26-key NKRO)

### Manufacturer: Xinhengwei (昕恒微)
- `VID: 0x36ae, PID: 0xfe9c` - Xinhengwei

### Others
- `VID: 0x36ae, PID: 0xfe12` - XH-XJ-RS6/Q6
- `VID: 0x36ae, PID: 0xfcab` - Nine-key 68PRO

> [!TIP]
> **Conclusion:** The Ant Esports MK1300v2 is highly likely a rebranded **Youhua Z61-ARGB** (Vendor ID `0x36AE`, Product ID `0xFEAD`), since this is the only uncommented, active device ID in the shipped source code!

## HID Communication Protocol
The keyboard communicates with the computer using a custom HID (Human Interface Device) implementation. 

* **Usage Page:** `0xFF00` (Vendor-defined)
* **Usage:** `0x0002` (Configuration Interface)
* **Bootloader Usage:** `0x0001` (Used for firmware flashing)

Because it uses `0xFF00` (Vendor-defined), the OS ignores the inputs as regular keystrokes, and passes the raw byte arrays directly to the Electron app via WebHID.

## Firmware & Updates
In `build/update.json`, we can see the firmware update manifest mapping PID revisions directly to `.bin` files:
```json
{
    "36ae_fead": {
        "version": 9,
        "file": "36ae_fead.bin"
    }
}
```
There is also a hidden bootloader device used specifically for flashing these `.bin` firmware files:
* **Bootloader VID:** `0x5566`
* **Bootloader PID:** `0x0009`

## Path to Open Source
To fully open-source this keyboard (e.g., to build a QMK or ZMK firmware replacement, or an open-source driver like OpenRGB):
1. **USB Sniffing:**
- [ ] Capture Wireshark PCAPs of the RGB commands.
- [ ] Cross-reference the Youhua firmware string tables with STM32/M0 bootloader behavior.
- [ ] Build the standalone `mk1300` Python CLI.

2. **Packet Mapping:** Once we intercept the packets, we can map out which bytes correspond to which RGB modes and keymap indices.
3. **OpenRGB Integration:** With the packet structure known, we can easily write a device profile for OpenRGB using the `0x36ae` Vendor ID, removing the need for this Electron app entirely!

## The "Known Unknowns"

Based on our exhaustive static extraction, here is what we explicitly **do not know yet**, and why static analysis cannot answer it:

### 1. Software vs. Firmware RGB Animation
**Status:** UNKNOWN
* **Why static analysis failed:** We extracted the names of 13 RGB effects and the command (`0x06 0x12`) to send bulk RGB layout chunks. However, we cannot tell if the OEM software sends one opcode to trigger a hardware-rendered "Ripple" effect, or if the software renders the Ripple effect on the PC and spams `0x06 0x12` chunk updates 60 times a second to the board.
* **Resolution:** Live USB capture (Wireshark) while activating an effect in the OEM UI.

### 2. Output Report / `receiveFeatureReport` Opcode Matching
**Status:** UNKNOWN
* **Why static analysis failed:** The minified JS contains the `inputreport` event handler that parses 64-byte `DataView` responses, but the minification obfucates which byte maps to which specific error/success status.
* **Resolution:** Send a malformed command manually via WebHID or a Python script and log the raw 64-byte response.

### 3. IAP Bootloader Checksums
**Status:** UNKNOWN
* **Why static analysis failed:** We found the firmware CDN (e.g. `software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/...`) and the `[0x5A, 0xA0]` command that kicks the keyboard into bootloader mode (`VID: 05566`, `PID: 0x0009`). However, the actual logic for chunking the downloaded `.bin` file and verifying its checksum is deeply buried in a Webpack chunk (`page-c8a291f1b4ca5560.js`) that resists simple AST extraction.
* **Resolution:** Download a firmware `.zip` from the CDN, extract the `.bin`, and analyze it using `binwalk` and `strings` to see if it's raw STM32 firmware or obfuscated.
