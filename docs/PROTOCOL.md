# USB HID Protocol

This document maps the communication protocol used by the MK1300 V2 keyboard to interact with the host system.

> **Status:** The protocol has been successfully statically extracted from the OEM application.

## Transport Specifications

* **Usage Page:** `0xFF00`
* **Usage:** `0x0002` (or `0x0001` for bootloader)
* **Report ID:** `0x00`
* **Packet Length:** 65 Bytes (1 byte Report ID + 64 bytes Payload)

## Identified Commands

All standard commands begin with the byte `0x06`. 

| Command Name | Byte 0 | Byte 1 | Byte 2 | Parameters |
|--------------|--------|--------|--------|------------|
| Get Config | `0x06` | `0x05` | - | - |
| Set Keymap | `0x06` | `0x10` | `0x07` | `key_offset`, `layer`, `type`, `keycode` |
| Set Batch RGB | `0x06` | `0x12` | `0x3B` | `chunk_offset`, `[RGB array]` |
| Set Single RGB| `0x06` | `0x14` | `0x03` | `key_offset`, `R`, `G`, `B` |
| Read Keymap | `0x06` | `0x08` | `0x3A` | `chunk_offset`, `layer` |
| Read RGB Map | `0x06` | `0x13` | `0x3A` | `chunk_offset` |
| Set Auto Sleep| `0x06` | `0xFC` | `0x02` | `timeL`, `timeH` |
| Set Profile | `0x06` | `0xFB` | `profile_id` | - |
| Factory Reset | `0x06` | `0x0F` | `0xFF` | - |
| **Enter IAP** | `0x5A` | `0xA0` | - | Bootloader Mode Trigger |

For the complete, machine-readable protocol layout, refer to `protocol/commands.json`.
