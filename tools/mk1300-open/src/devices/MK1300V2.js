"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MK1300V2 = exports.DeviceState = void 0;
const packets = __importStar(require("../protocol/packets.js"));
var DeviceState;
(function (DeviceState) {
    DeviceState[DeviceState["DISCONNECTED"] = 0] = "DISCONNECTED";
    DeviceState[DeviceState["OPEN"] = 1] = "OPEN";
    DeviceState[DeviceState["GET_CONFIG"] = 2] = "GET_CONFIG";
    DeviceState[DeviceState["READ_KEYMAP"] = 3] = "READ_KEYMAP";
    DeviceState[DeviceState["READ_RGB"] = 4] = "READ_RGB";
    DeviceState[DeviceState["READY"] = 5] = "READY";
})(DeviceState || (exports.DeviceState = DeviceState = {}));
class MK1300V2 {
    transport;
    state = DeviceState.DISCONNECTED;
    constructor(transport) {
        this.transport = transport;
    }
    async connect() {
        await this.transport.open();
        this.state = DeviceState.OPEN;
        await this.initializeSequence();
    }
    async disconnect() {
        await this.transport.close();
        this.state = DeviceState.DISCONNECTED;
    }
    async initializeSequence() {
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
    async setSingleKeyRgb(keyIndex, r, g, b) {
        if (this.state !== DeviceState.READY)
            throw new Error("Device not ready");
        const packet = packets.buildSetSingleKeyRgb(keyIndex, r, g, b);
        await this.transport.write(packet);
    }
}
exports.MK1300V2 = MK1300V2;
//# sourceMappingURL=MK1300V2.js.map