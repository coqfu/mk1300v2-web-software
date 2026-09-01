# Device Database (OEM Supported Hardware)

The OEM application (`build/_next/static/chunks/app/page-e2712c16b4e30f31.js`) contains a massive internal registry of supported keyboards. It queries `navigator.hid` and attempts to load layout files based on the `<vendorId>_<productId>.json` naming scheme.

## MK1300 V2 Context

The Ant Esports MK1300 V2 runs on this shared platform. Based on the previous extraction of `update.json`, it specifically maps to `36ae_fead`. The discovery of over 80 other supported IDs means the MK1300 V2 shares its core HID protocol, packet structure, and possibly MCU architecture with dozens of other OEM keyboards.

## Full Extracted VID:PID List

* `0461:4001`, `0461:4002`, `0461:4003`
* `0483:0010` (Note: `0483` is STMicroelectronics, highly indicative of an STM32 MCU family)
* `05ac:021d`, `05ac:021e`, `05ac:024f`, `05ac:0250` (Note: `05ac` is Apple Inc., likely spoofing Apple keyboard identifiers for macOS compatibility modes)
* `0816:021d`, `0816:021f`, `0816:0220`, `0816:024c`
* `0816:0600`, `0816:0601`, `0816:0605`
* `0816:246d` through `0816:2479`
* `0817:d18a`, `0817:dcfb`
* `0818:d18a`, `0818:dcfa`, `0818:dcfb`
* `0819:d18a`
* `08a1:dcfc`, `08a3:1cfc`, `08a3:2cfc`, `08a3:3cfc`, `08a5:dcfc`, `08ae:dcfb`
* `2e3c:af01`
* `3151:4010`, `3151:6000`
* `342d:e451`, `342d:e453`
* `35ae:0250` through `35ae:0258`, `35ae:dcfc`
* `36ae:021f`, `36ae:0257`, `36ae:0261`, `36ae:4002`
* `36ae:f021`, `36ae:f024`, `36ae:f031`, `36ae:f041`, `36ae:f042`, `36ae:f043`, `36ae:f051`, `36ae:f069`, `36ae:f070`
* `36ae:f100`, `36ae:f101`
* `36ae:fcab`, `36ae:fda1`
* `36ae:fe12`, `36ae:fe15`, `36ae:fe80`, `36ae:fe81`, `36ae:fe9c`, `36ae:fe9d`, `36ae:fea3`, `36ae:fea4`, `36ae:fea6`, `36ae:feab`, `36ae:fead` (MK1300 V2), `36ae:feae`, `36ae:feaf`, `36ae:febb`, `36ae:febc`
* `68bd:dcfc`
* `6d02:dcfc` through `6d07:dcfc`
* `6d7b:dcfa` through `6d7f:dcfe`
* `6d80:dc81` through `6d83:dc85`, `6d83:dcfa`
* `7dfa:37a1`, `7dfa:dcfa` through `7dfa:ddfc`, `7dfa:defa`
* `9a9a:baba`

## Conclusions
1. The firmware developer is likely reusing an STMicroelectronics MCU or a clone (given `0483:0010` presence).
2. The `36AE` Vendor ID is heavily used, indicating a large product family from the Youhua OEM.
3. Apple VIDs are present, suggesting the firmware implements a Mac mode toggle.
