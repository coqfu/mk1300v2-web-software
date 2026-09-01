# RGB Effects Registry

Through static analysis of the frontend chunks (specifically `page-e2712c16b4e30f31.js` and other Webpack bundles), we have mapped out the RGB capabilities understood by the OEM software.

## Discovered Software-Supported Effects
The software contains parsing and UI strings for the following lighting modes:
* `static`
* `breathing`
* `wave`
* `reactive`
* `ripple`
* `aurora`
* `rainbow`
* `twinkle`
* `snake`
* `radar`
* `meteor`
* `starlight`
* `raindrop`

## Protocol Implementation
* The software writes bulk RGB mapping using command `0x06 0x12 0x3B [Chunk Offset]`. This indicates that the software can address individual LEDs by splitting the mapping into chunks.
* Single-key mapping uses `0x06 0x14 0x03 [Key Offset] [R] [G] [B]`.

## Firmware vs. Software Processing
Because the protocol relies on chunking static color data to the board, it is highly probable that some of the advanced animations (like reactive, ripple, or meteor) are either:
1. Hardcoded in the firmware and triggered by an unknown opcode (still needs discovery).
2. Processed entirely in the OEM software, which then spams the `0x06 0x12` bulk update command to the board rapidly (software-driven RGB).

To determine this definitively, we must capture USB traffic when switching effects. If switching to "Ripple" sends only a few bytes, it's firmware-driven. If it floods the USB bus with chunk updates continuously, it's software-driven.
