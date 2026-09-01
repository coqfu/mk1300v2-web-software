import { HidTransport } from './HidTransport.js';
export declare class DryRunTransport implements HidTransport {
    private isOpen;
    writtenPackets: Buffer[];
    open(): Promise<void>;
    close(): Promise<void>;
    write(report: Buffer): Promise<void>;
    read(timeout?: number): Promise<Buffer>;
}
//# sourceMappingURL=DryRunTransport.d.ts.map