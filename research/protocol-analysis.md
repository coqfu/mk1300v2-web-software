# Protocol Analysis Log

This document records the static analysis of the OEM software's HID protocol implementation.

## Discovery Methodology
The OEM software frontend (a compiled Next.js application in `build/_next/static/chunks`) was statically analyzed using AST parsing and string extraction tools to find WebHID `navigator.hid` calls and the corresponding byte array builders.

## HID Transport Specifications
- **Interface:** `1`
- **Usage Page:** `0xFF00` (65280)
- **Usage:** `2` (or `1` for bootloader)
- **Report Length:** 65 Bytes (64 bytes of data + 1 byte Report ID)
- **Report ID:** `0x00`

## Packet Structure
The standard packet for communicating with the keyboard uses the base opcode `0x06`. 
The second byte usually indicates the specific command category (e.g., `0x05` for config, `0x10` for key mapping, `0x12` for batch RGB).

### Discovered Opcodes (Host -> Device)
1. `[0x06, 0x05]` - **Get Keyboard Config**
2. `[0x06, 0x10, 0x07, keyIndex, layer, type, codes...]` - **Set Single Key Mapping**
3. `[0x06, 0x12, 0x3B, chunkOffset, ...RGB]` - **Set Batch RGB Data**
4. `[0x06, 0x14, 0x03, keyOffset, R, G, B]` - **Set Single Key RGB**
5. `[0x06, 0x08, 0x3A, chunkOffset, layer]` - **Read Keymap Layout**
6. `[0x06, 0x13, 0x3A, chunkOffset]` - **Read RGB Layout**
7. `[0x06, 0xFC, 0x02, timeL, timeH]` - **Set Auto Sleep Timer**
8. `[0x06, 0xFB, profile_id]` - **Switch Active Profile**
9. `[0x06, 0x0F, 0xFF]` - **Factory Reset**

### Firmware Bootloader Switch
The software uses a special command to drop the keyboard into IAP (In-Application Programming) mode for flashing `.bin` files:
`[0x5A, 0xA0]`

*(Note: Command `0x5A` (90) deviates from the standard `0x06` prefix, indicating it is likely trapped by the lower-level USB controller rather than the main application loop).*
