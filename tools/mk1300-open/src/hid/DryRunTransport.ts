import { HidTransport } from './HidTransport.js';
import { PACKET_LENGTH } from '../protocol/constants.js';

export class DryRunTransport implements HidTransport {
    private isOpen = false;
    public writtenPackets: Buffer[] = [];

    async open(): Promise<void> {
        this.isOpen = true;
    }

    async close(): Promise<void> {
        this.isOpen = false;
    }

    async write(report: Buffer): Promise<void> {
        if (!this.isOpen) throw new Error("Transport is closed");
        this.writtenPackets.push(Buffer.from(report));
    }

    async read(timeout?: number): Promise<Buffer> {
        if (!this.isOpen) throw new Error("Transport is closed");
        // Return a mock 65-byte zero buffer
        return Buffer.alloc(PACKET_LENGTH, 0);
    }
}
