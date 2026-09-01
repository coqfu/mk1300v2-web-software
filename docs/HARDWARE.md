# Hardware Profile: MK1300 V2

This document details all hardware identifiers and components discovered for the MK1300 V2.

## USB Identifiers

| Property | Value | Confidence | Notes |
|----------|-------|------------|-------|
| Vendor ID (VID) | `0x36AE` | **PROBABLE** | Discovered in OEM configuration files. |
| Product ID (PID) | `0xFEAD` | **PROBABLE** | Identified as the only active device ID in shipped source code. Corresponds to the generic "Youhua Z61-ARGB" board. |
| Bootloader VID | `0x5566` | **PROBABLE** | Found in `vid_pid_offline.js` mapped to "boot". |
| Bootloader PID | `0x0009` | **PROBABLE** | Found in `vid_pid_offline.js` mapped to "boot". |

## HID Interfaces

| Property | Value | Confidence | Notes |
|----------|-------|------------|-------|
| Usage Page | `0xFF00` | **PROBABLE** | Discovered in `vid_pid_offline.js`. Vendor-defined page. |
| Usage | `0x0002` | **PROBABLE** | Indicates the configuration endpoint for WebHID. |
| Bootloader Usage | `0x0001` | **PROBABLE** | Used specifically for flashing firmware. |
| Input Report Size | Unknown | UNKNOWN | Requires USB packet sniffing. |
| Output Report Size | Unknown | UNKNOWN | Requires USB packet sniffing. |
| Feature Report Size | Unknown | UNKNOWN | Requires USB packet sniffing. |

## Internal Hardware

| Component | Identifier | Confidence | Notes |
|-----------|------------|------------|-------|
| MCU | Unknown | UNKNOWN | Physical teardown required. |
| LED Controller | Unknown | UNKNOWN | Physical teardown required. |
| Flash Memory | Unknown | UNKNOWN | Physical teardown required. |
| PCB Manufacturer | Youhua | **PROBABLE** | The software strongly maps the active PID to "Youhua Z61-ARGB". |

## Notes & Unknowns

* The physical keyboard has not been completely torn down to verify the MCU.
* The exact endpoint addresses (e.g., EP1, EP2) and interface numbers (e.g., Interface 1 for Keyboard, Interface 2 for Vendor-Defined) are currently unconfirmed and require tools like `lsusb -v`.
