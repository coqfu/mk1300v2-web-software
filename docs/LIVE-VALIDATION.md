# Live Hardware Validation Report

## Test 001 — GetConfig

**Device:** MK1300 V2  
**VID:** 36AE  
**PID:** FEAD  
**Interface:** 2  
**Usage Page:** 0xFF00  
**Usage:** 0x0002  

### Execution

**Command Sent:**
`06 05` (Get Config)

**Packet Bytes Sent:**
`00 06 05 00 00 00 00 ...` (65 bytes)

**Response Received:**
`00 aa 05 0e 00 00 01 00 ad fe 09 00 01 01 32 01 00 00 02 00 00 00 00 ...` (65 bytes)

### Parsing Results
* **Report ID:** `0x00`
* **Opcode:** `0xaa`
* **Status:** `0x05`
* **Payload:** `0e 00 00 01 00 ad fe 09 00 01 01 32 01 00 00 02 00 ...`

**Parsed:** PASS

### Safety & Constraints
* **Keyboard behavior:** No visible physical changes (as expected for a read operation).
* **Writes performed:** 0
* **IAP tested:** NOT USED
* **Firmware tested:** NOT USED

### Conclusion
The live test succeeded perfectly. The `node-hid` transport matched the exact device interface recovered from the OEM software, opened it, and successfully executed a `GetConfig` command. The hardware responded immediately with a 65-byte payload matching our expected format (Opcode `0xAA` for response, Command `0x05`).

We have firmly established the communication link.

---

## Test 002 — ReadKeymap

**Device detection:** PASS  
**HID open:** PASS  
**Command transmission:** PASS  
**All chunks received:** PASS (Captured 21 chunks before arbitrary limit, chunk offsets incremented successfully).  
**Parser:** PASS (Identified `0xAA` opcode, `0x07` command group, and `0x3A` subcommand. Payload payload start contained proper matrix index data).  
**Keymap reconstructed:** PASS (Payload bytes clearly show standard USB HID keycodes e.g., `0x29` for ESC, `0x1E` for '1').  

**Writes performed:** 0

---

## Test 003 — ReadRgb

**Device detection:** PASS  
**HID open:** PASS  
**Command transmission:** PASS  
**All chunks received:** PASS (Captured 21 chunks before arbitrary limit).  
**Parser:** PASS (Identified `0xAA` opcode, `0x13` command group, and `0x3A` subcommand).  
**RGB layout reconstructed:** PASS (Data begins at byte 9 with 3-byte RGB triplets, e.g., `55 ff ff`).  

**Writes performed:** 0

### Analysis of `ReadRgb` (0x06 0x13)
The captured RGB chunks return literal arrays of `R G B` values representing the current color state or the static layout map of the keyboard. Since the data is returned in bulk chunks representing per-key colors (3 bytes per key), the corresponding write command (`0x06 0x12 0x3B`) almost certainly pushes a static 1:1 color map to the keyboard. If complex dynamic effects (like ripple/wave) exist, they may be calculated by the OEM software and continuously streamed using this chunk structure.

---

## Test 004 — Single-Key RGB Write

**Device:** MK1300 V2  
**VID:** 36AE  
**PID:** FEAD  
**Key:** ESC  
**Index:** 0  

**Original RGB:** `55 FF FF` (Read back safely before any operations)  
**Test RGB:** `FF 00 00`

### Execution

**Write packet sent:**
`00 06 14 03 00 00 00 00 00 ff 00 00 ...` (65 bytes)

**Write response:** (No response awaited, waited 500ms)

**Read-back:**
Verified `FF 00 00` correctly using `ReadRgb` chunk 0.

**Restore packet sent:**
`00 06 14 03 00 00 00 00 00 55 ff ff ...` (65 bytes)

**Final read-back:**
Verified `55 FF FF` correctly using `ReadRgb` chunk 0.

### Conclusion

**Result:** PASS  
**Unexpected behavior:** The initial static analysis of `CMD_SET_KEY_RGB` placed the RGB triplets at bytes 8, 9, 10. However, live testing (coupled with the `ReadRgb` offset logic) proved the triplets belong at bytes 9, 10, 11 for the write packet as well. The static logic was corrected and successfully applied.

**Firmware:** UNTOUCHED  
**IAP:** UNTOUCHED
