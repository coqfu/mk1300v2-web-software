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
const MK1300V2_js_1 = require("../../src/devices/MK1300V2.js");
const DryRunTransport_js_1 = require("../../src/hid/DryRunTransport.js");
const assert = __importStar(require("assert"));
async function testDeviceStateMachine() {
    console.log("Running MK1300V2 State Machine Test...");
    const transport = new DryRunTransport_js_1.DryRunTransport();
    const device = new MK1300V2_js_1.MK1300V2(transport);
    assert.strictEqual(device.state, MK1300V2_js_1.DeviceState.DISCONNECTED);
    await device.connect();
    // After connect, it should have progressed through the initialization sequence
    assert.strictEqual(device.state, MK1300V2_js_1.DeviceState.READY);
    // Verify it sent exactly 3 initialization packets (GetConfig, ReadKeymap, ReadRgb)
    assert.strictEqual(transport.writtenPackets.length, 3);
    // First packet should be GetConfig (0x00, 0x06, 0x05)
    assert.strictEqual(transport.writtenPackets[0] ? transport.writtenPackets[0][2] : -1, 0x05);
    // Now test a regular command
    await device.setSingleKeyRgb(1, 0xFF, 0, 0);
    assert.strictEqual(transport.writtenPackets.length, 4);
    assert.strictEqual(transport.writtenPackets[3] ? transport.writtenPackets[3][2] : -1, 0x14); // SetKeyRgb
    await device.disconnect();
    assert.strictEqual(device.state, MK1300V2_js_1.DeviceState.DISCONNECTED);
}
testDeviceStateMachine().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=MK1300V2.test.js.map