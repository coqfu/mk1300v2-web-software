# USB HID Protocol

This document maps the communication protocol used by the MK1300 V2 keyboard to interact with the host system.

> **Status:** The protocol is currently **UNKNOWN** and requires live USB packet capture.

## Setup for Protocol Discovery

To discover and document the protocol, we will need to intercept the HID reports sent by the proprietary Windows software.

1. **Linux Users:** Use `usbmon` combined with Wireshark to capture HID output reports.
2. **Windows Users:** Use Wireshark with USBPcap.
3. Filter traffic by the device Vendor ID: `0x36AE`.

## Known Endpoints

Based on the OEM software, the configuration happens over a custom HID usage page:
* **Usage Page:** `0xFF00`
* **Usage:** `0x0002`

## Identified Commands (TBD)

The following commands need to be identified through packet sniffing:
* Device initialization
* Reading firmware version
* Setting RGB effect mode
* Setting RGB brightness
* Setting static RGB color
* Per-key RGB manipulation
* Reading current keymap
* Writing keymap changes
* Saving configuration to onboard EEPROM

*(Note: Command tables will be added here as they are discovered.)*
