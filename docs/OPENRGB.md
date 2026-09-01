# OpenRGB Integration Plan

The ultimate goal of reverse engineering the MK1300 V2's USB HID protocol is to introduce native support into [OpenRGB](https://openrgb.org/), allowing cross-platform, open-source control of the keyboard's lighting.

## Implementation Roadmap

To get MK1300 V2 supported in OpenRGB, we need to accomplish the following:

- [ ] **Protocol Discovery:** Fully map out the commands required to set static colors, toggle lighting effects, and set brightness over HID.
- [ ] **Device Identification:** Confirm the exact USB Vendor ID (`0x36AE`) and Product ID (`0xFEAD`) on physical hardware.
- [ ] **LED Mapping:** Determine the physical layout of the LEDs. Does the keyboard use a direct matrix mapping, or are there zones? How many LEDs are addressable?
- [ ] **OpenRGB Controller Development:** Write a C++ `RGBController` class implementation for OpenRGB based on the discovered HID packets.
- [ ] **Hardware Verification:** Have multiple community members test the OpenRGB module to ensure stability and compatibility across different firmware versions.

## Resources
* [OpenRGB Supported Devices](https://gitlab.com/CalcProgrammer1/OpenRGB/-/wikis/Supported-Devices)
* [Adding a new device to OpenRGB](https://gitlab.com/CalcProgrammer1/OpenRGB/-/wikis/Adding-a-New-Device)

If you have captured USB packets corresponding to RGB changes, please open an issue in this repository so we can begin drafting the OpenRGB controller logic!
