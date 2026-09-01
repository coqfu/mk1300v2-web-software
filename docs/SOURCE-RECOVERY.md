# Source Recovery Log

This document tracks the reconstruction of the original OEM application logic from the minified Next.js Webpack chunks into a clean, standalone, Open Source TypeScript implementation.

## 1. Device Discovery & Registry

**Original Chunk:** `build/_next/static/chunks/app/page-e2712c16b4e30f31.js`
**Reconstructed Module:** `src/devices/registry.ts`, `src/devices/devices.json`
**Evidence for Reconstruction:**
* Statically extracted a large JSON object mapping `vendorId` and `productId` strings (e.g. `36ae_fead`) to internal layout files.
* Abstracted into a static JSON database of capabilities based on the OEM's assumptions about the target hardware.

## 2. Protocol Constants

**Original Chunk:** `build/_next/static/chunks/app/page-e2712c16b4e30f31.js`
**Reconstructed Module:** `src/protocol/constants.ts`
**Evidence for Reconstruction:**
* The minified application constantly writes to `Uint8Array(65)`. 
* Found array instantiations matching `[0x06, 0x12, 0x3B, ...]`, mapping directly to UI components for setting RGB colors.
* Named these constants strictly based on their discovered behavior (e.g., `CMD_SET_RGB_MAP`).

## 3. Protocol Packet Builders

**Original Chunk:** `build/_next/static/chunks/app/page-e2712c16b4e30f31.js`
**Reconstructed Module:** `src/protocol/packets.ts`
**Evidence for Reconstruction:**
* Found functions slicing and shifting bits (`key_index * 4 & 0xFF`, `(key_index * 4) >> 8`) to convert key matrix indices into 16-bit little-endian pointers.
* Extracted the exact byte placement from the JS array assignments and reconstructed them cleanly using standard Node `Buffer` operations.

## 4. HID Transport Layer

**Original Chunk:** `main/index.js` (Electron Main), `page-e2712c16b4e30f31.js`
**Reconstructed Module:** `src/hid/transport.ts`
**Evidence for Reconstruction:**
* Discovered that `navigator.hid.requestDevice({ filters: [] })` is intercepted by `main/index.js` dynamically.
* The frontend looks for `usagePage === 0xFF00` and `usage === 2` in the device collections before attaching the `inputreport` listener.

## 5. Firmware Updater (IAP)

**Original Chunk:** `page-c8a291f1b4ca5560.js`
**Reconstructed Module:** `src/firmware/iap.ts`
**Evidence for Reconstruction:**
* Found the explicit string `[0x5A, 0xA0]` bound to the UI button for updating the firmware.
* Found logic targeting `0x5566:0x0009` with `usage === 1` for the bootloader.
* Reconstructed as a "dry-run" state machine that does not actually send the payload.
