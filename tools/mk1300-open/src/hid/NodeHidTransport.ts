import * as hid from 'node-hid';
import { HidTransport } from './HidTransport.js';
import { MK1300_VID, MK1300_PID, USAGE_PAGE_KEYBOARD, USAGE_KEYBOARD, CMD_GET_CONFIG, PACKET_LENGTH } from '../protocol/constants.js';

export class NodeHidTransport implements HidTransport {
    private device: hid.HID | null = null;
    private devicePath: string | null = null;
    
    constructor() {
        if (process.env.MK1300_ALLOW_HARDWARE !== '1') {
            console.error("ERROR: Hardware access disabled.");
            console.error("Set MK1300_ALLOW_HARDWARE=1 to enable live HID access.");
            process.exit(1);
        }
    }

    public enumerate(): void {
        const devices = hid.devices();
        console.log("HID devices:");
        let found = false;
        devices.forEach((d, index) => {
            if (d.vendorId === MK1300_VID && d.productId === MK1300_PID) {
                console.log(`\n[${index}]`);
                console.log(`VID:  ${d.vendorId.toString(16).toUpperCase().padStart(4, '0')}`);
                console.log(`PID:  ${d.productId.toString(16).toUpperCase().padStart(4, '0')}`);
                console.log(`Path: ${d.path}`);
                console.log(`Usage Page: 0x${d.usagePage?.toString(16).toUpperCase().padStart(4, '0')}`);
                console.log(`Usage:      0x${d.usage?.toString(16).toUpperCase().padStart(4, '0')}`);
                console.log(`Interface:  ${d.interface}`);
                console.log(`Product:    ${d.product}`);
                found = true;
            }
        });
        if (!found) {
            console.log("\nNo matching MK1300 V2 devices found in enumeration.");
        }
    }

    async open(): Promise<void> {
        const devices = hid.devices();
        const target = devices.find(d => 
            d.vendorId === MK1300_VID && 
            d.productId === MK1300_PID &&
            d.usagePage === USAGE_PAGE_KEYBOARD &&
            d.usage === USAGE_KEYBOARD
        );

        if (!target || !target.path) {
            throw new Error(`STOP: Expected HID interface (VID: 36AE, PID: FEAD, UsagePage: FF00, Usage: 0002) not found.`);
        }

        this.devicePath = target.path;
        this.device = new hid.HID(target.path);
        
        console.log(`\nOpened MK1300 V2`);
        console.log(`VID: ${MK1300_VID.toString(16).toUpperCase()}`);
        console.log(`PID: ${MK1300_PID.toString(16).toUpperCase()}`);
        console.log(`Usage Page: ${USAGE_PAGE_KEYBOARD.toString(16).toUpperCase()}`);
        console.log(`Usage: ${USAGE_KEYBOARD.toString(16).padStart(4, '0')}`);
        console.log(`\nREAD-ONLY MODE`);
        console.log(`Writes disabled\n`);
    }

    async close(): Promise<void> {
        if (this.device) {
            this.device.close();
            this.device = null;
        }
    }

    async write(report: Buffer): Promise<void> {
        if (!this.device) throw new Error("Device not opened");

        // HARDWARE SAFETY GATE
        // We only allow GET_CONFIG during Phase 2A
        if (report[2] !== CMD_GET_CONFIG) {
            throw new Error(`HardwareWriteDisabledError: Only GET_CONFIG is permitted in this phase. Rejected command: 0x${(report[2] || 0).toString(16)}`);
        }

        // WebHID write equivalent in node-hid is often write() or sendFeatureReport().
        // Usually, 0x00 prefix report ID means 65 bytes output report.
        try {
            // Some platforms require 65 bytes, some require 64 if Report ID is 0.
            // node-hid write() requires the report ID as the first byte.
            this.device.write(Array.from(report));
        } catch (err) {
            throw new Error(`Failed to write to HID device: ${err}`);
        }
    }

    async read(timeoutMs: number = 5000): Promise<Buffer> {
        if (!this.device) throw new Error("Device not opened");
        
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.device?.removeAllListeners();
                reject(new Error("Timeout waiting for HID response"));
            }, timeoutMs);

            this.device!.once("data", (data: Buffer) => {
                clearTimeout(timer);
                
                // On some systems (like Linux hidraw), the Report ID is included. On others it's stripped if it's 0.
                // We normalize it to exactly 65 bytes to match our protocol abstraction.
                let normalized = data;
                if (data.length === PACKET_LENGTH - 1) {
                    normalized = Buffer.concat([Buffer.from([0x00]), data]);
                }
                
                resolve(normalized);
            });

            this.device!.once("error", (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }
}
