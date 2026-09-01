export interface HidTransport {
    open(): Promise<void>;
    close(): Promise<void>;
    write(report: Buffer): Promise<void>;
    read(timeout?: number): Promise<Buffer>;
}
//# sourceMappingURL=HidTransport.d.ts.map