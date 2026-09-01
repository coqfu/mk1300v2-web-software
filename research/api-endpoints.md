# API & Cloud Endpoints

Static analysis of the OEM software has revealed the exact CDN and cloud endpoints used by the application.

## Firmware CDN
The application downloads firmware updates directly from a Tencent Cloud Object Storage (COS) bucket.
* **Bucket:** `software-1304108977.cos.ap-guangzhou.myqcloud.com`
* **Path:** `/sidehub/firmware/`

**Identified Firmware URLs in Source:**
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/101/K9UD_V101.zip`
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/101/K16HUBN2_V101.zip`
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/K108UD_0612.zip`
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/101/K12HUBN3_V101.zip`
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/101/K16HUBN4_V101.zip`
* `https://software-1304108977.cos.ap-guangzhou.myqcloud.com/sidehub/firmware/101/K6HUBUD_V101.zip`

**Analysis:**
The OEM (likely Youhua) hosts unauthenticated `.zip` files containing the firmware updates. These zips likely contain the `.bin` files referenced in `update.json`.

## Third-Party Software Tooling
The application also links to a personal GitHub release page for software dependencies:
* `https://github.com/daddasdsa/sd_tools/releases/download/v1.0.3-release/SDTech.Options.Win64.1.0.3.rar`
* `https://github.com/daddasdsa/sd_tools/releases/download/v1.0.3-release/SDTech.Options-mac-Intel-1.0.3.zip`

This suggests the OEM software was developed by or relies on a small generic library called "SDTech". The domain `www.sdcx-tech.com` was also found in the binary, linking this to **Shenzhen SDCX Technology Co., Ltd.**, a known white-label peripheral software developer.

## Telemetry
No active telemetry, analytics, or registration endpoints were identified in the static analysis. The software appears to communicate purely with the keyboard and the unauthenticated Tencent COS bucket for updates.
