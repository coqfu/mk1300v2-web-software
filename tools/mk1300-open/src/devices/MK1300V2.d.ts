import { HidTransport } from '../hid/HidTransport.js';
export declare enum DeviceState {
    DISCONNECTED = 0,
    OPEN = 1,
    GET_CONFIG = 2,
    READ_KEYMAP = 3,
    READ_RGB = 4,
    READY = 5
}
export declare class MK1300V2 {
    private transport;
    state: DeviceState;
    constructor(transport: HidTransport);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private initializeSequence;
    setSingleKeyRgb(keyIndex: number, r: number, g: number, b: number): Promise<void>;
}
//# sourceMappingURL=MK1300V2.d.ts.map