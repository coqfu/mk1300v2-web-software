# MK1300 V2 - Open Source Enablement Project

This repository is dedicated to reverse-engineering the **Ant Esports MK1300 V2** mechanical keyboard to make it completely open and community-accessible.

## What is MK1300 V2?
The MK1300 V2 is an affordable mechanical keyboard that ships with a proprietary, Windows-only configuration software for controlling RGB lighting and key mappings.

## Why reverse engineer it?
The end goal is simple: **The MK1300 V2 should not depend on proprietary Windows software to remain useful.** 

We are reverse engineering the hardware identifiers, USB HID communication protocols, and firmware update architecture to provide the community with everything needed to maintain, develop, and potentially replace its software and firmware stack. 

This enables:
* Using and configuring the keyboard properly on **Linux** and **macOS**.
* Controlling the RGB lighting directly via **OpenRGB**.
* Building independent, open-source CLI tools.
* Ensuring the keyboard remains functional and configurable even if the manufacturer drops support.

## What has already been discovered?
Through static analysis of the OEM software, we have discovered:
* **The True OEM:** The software is a generic tool supporting multiple keyboards. The MK1300 V2 is heavily implied to be a rebranded **Youhua Z61-ARGB**.
* **Device Identifiers:** We have mapped the hidden Vendor IDs and Product IDs. The active configuration targets `VID: 0x36AE` and `PID: 0xFEAD`.
* **Firmware Mappings:** The firmware update metadata has been extracted, showing a hidden bootloader device endpoint used for flashing `.bin` files.

## Roadmap & Status

- [x] Analyze vendor application
- [x] Discover hidden device identifiers
- [x] Identify firmware update metadata
- [x] Document initial reverse-engineering findings
- [ ] Fully map USB protocol
- [ ] Build standalone Linux tool
- [ ] Verify RGB commands
- [ ] Document HID protocol
- [ ] Implement OpenRGB support
- [ ] Investigate firmware architecture
- [ ] Investigate alternative firmware feasibility
- [ ] Build automated protocol tests
- [ ] Community hardware verification

*(Note: Items are only marked complete when physically verified and peer-reviewed.)*

## How can someone help?
We need the community's help! If you own an MK1300 V2, you can contribute by:
1. **Sniffing USB Traffic:** Capture the USB packets sent by the proprietary software using Wireshark and `USBPcap` (Windows) or `usbmon` (Linux). 
2. **Physical Teardown:** Open the keyboard and identify the MCU and LED controller chips printed on the PCB.
3. **Writing Tools:** Help draft the standalone Python/Rust CLI tool once the protocol commands are mapped.

Check out our [GitHub Issues](https://github.com/coqfu/mk1300v2-web-software/issues) to find tasks labeled `[RESEARCH]`, `[HARDWARE]`, or `[FEATURE]`.

## Documentation Hub
Explore the `/docs` directory for in-depth technical breakdowns:
* **[Hardware Profile](docs/HARDWARE.md):** Known VIDs, PIDs, and internal components.
* **[USB Protocol](docs/PROTOCOL.md):** The mapped HID command structure.
* **[Firmware Analysis](docs/FIRMWARE.md):** Metadata and bootloader logic.
* **[Linux Support](docs/LINUX.md):** Steps for getting it working natively on Linux.
* **[OpenRGB](docs/OPENRGB.md):** Our plan to integrate native lighting control.
* **[Reverse Engineering Log](docs/REVERSE_ENGINEERING.md):** Detailed logs of our discoveries and methods.

## Disclaimer
This project is not affiliated with Ant Esports or the original OEM. All reverse engineering is done in a clean-room environment for interoperability purposes. **Do not flash unknown firmware to your keyboard.**
