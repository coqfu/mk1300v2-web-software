# SAFETY BOUNDARY

## Current Version Status
**STATIC / DRY-RUN ONLY**

The current implementation of the MK1300 open-source library is completely isolated from physical hardware. It is built strictly from statically recovered OEM logic to guarantee packet correctness before attempting live execution.

### Hardware Risk Assessment
The protocol reconstructed here targets a specific vendor and product ID (`36AE:FEAD`). Incorrect HID reports, specifically boundary-exceeding chunk offsets or misformatted IAP commands, carry a genuine risk of:
* Bricking the keyboard microcontroller.
* Corrupting the onboard EEPROM (rendering the keyboard non-functional or losing the factory keymap).
* Forcing the keyboard into an unrecoverable bootloader state without the matching OEM firmware binary.

### Safety Enforcement
To protect hardware during the reconstruction phase, the following enforcement is active:

* **Physical HID writes:** DISABLED (No `node-hid` or `WebHID` implementation exists).
* **Firmware flashing:** DISABLED (Only the unauthenticated firmware CDN endpoints have been mapped; no binary extraction or payload assembly is implemented).
* **IAP Mode:** DISABLED (The `buildEnterIap()` function exists for testing, but transport execution is mocked).
* **Factory Reset:** DISABLED (The packet builder exists, but execution is blocked).

The CLI operates purely in `--dry-run` mode. If you execute a command, it will print the generated 65-byte USB packet and exit. It will not communicate with your keyboard.
