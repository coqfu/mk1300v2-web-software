import { HidTransport } from '../hid/HidTransport.js';
import * as packets from '../protocol/packets.js';
import { parseResponse } from '../protocol/responses.js';

export enum DeviceState {
    DISCONNECTED,
    OPEN,
    GET_CONFIG,
    READ_KEYMAP,
    READ_RGB,
    READY
}

export class MK1300V2 {
    private transport: HidTransport;
    public state: DeviceState = DeviceState.DISCONNECTED;

    constructor(transport: HidTransport) {
        this.transport = transport;
    }

    async connect(): Promise<void> {
        await this.transport.open();
        this.state = DeviceState.OPEN;
        await this.initializeSequence();
    }

    async disconnect(): Promise<void> {
        await this.transport.close();
        this.state = DeviceState.DISCONNECTED;
    }

    private async initializeSequence(): Promise<void> {
        // 1. Get Config
        this.state = DeviceState.GET_CONFIG;
        await this.transport.write(packets.buildGetConfig());
        await this.transport.read();

        // 2. Read Keymap (mocked 1 chunk for now)
        this.state = DeviceState.READ_KEYMAP;
        await this.transport.write(packets.buildReadKeymap(0, 0));
        await this.transport.read();

        // 3. Read RGB (mocked 1 chunk for now)
        this.state = DeviceState.READ_RGB;
        await this.transport.write(packets.buildReadRgbMap(0));
        await this.transport.read();

        this.state = DeviceState.READY;
    }

    async setSingleKeyRgb(keyIndex: number, r: number, g: number, b: number): Promise<void> {
        if (this.state !== DeviceState.READY) throw new Error("Device not ready");
        const packet = packets.buildSetSingleKeyRgb(keyIndex, r, g, b);
        await this.transport.write(packet);
    }
}
