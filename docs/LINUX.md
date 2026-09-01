# Linux Support & Usage

The MK1300 V2 requires proprietary Windows software for configuration out of the box. Our goal is to make it a first-class citizen on Linux.

## Udev Permissions

By default, Linux requires root access (e.g., `sudo`) to write directly to RAW HID devices. To allow user-space tools (like the upcoming standalone CLI and OpenRGB) to communicate with the keyboard, you will need to add a `udev` rule.

*(Note: The exact rule will be provided here once the VID/PID is fully confirmed physically. Based on current data, the rule will likely target `ATTRS{idVendor}=="36ae"`).*

## Current Status
Currently, there is no native Linux configuration software for this keyboard.

## Next Steps
Once the protocol is reverse engineered (see `PROTOCOL.md`), a standalone Python or Rust CLI tool will be developed in `tools/mk1300/` to allow seamless configuration on Linux. 

Eventually, all RGB functionality will be routed through OpenRGB, and keymapping functionality may be supported by a cross-platform tool.
