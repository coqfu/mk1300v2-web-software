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
