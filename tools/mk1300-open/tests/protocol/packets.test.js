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
const packets = __importStar(require("../../src/protocol/packets.js"));
const assert = __importStar(require("assert"));
console.log("Running protocol regression tests...");
function testSetSingleKeyRgb() {
    const packet = packets.buildSetSingleKeyRgb(1, 0xFF, 0x00, 0x00);
    // Key index 1 -> offset 3 -> 0x03 0x00
    assert.strictEqual(packet[0], 0x00, "Report ID");
    assert.strictEqual(packet[1], 0x06, "Command Group");
    assert.strictEqual(packet[2], 0x14, "Command ID");
    assert.strictEqual(packet[3], 0x03, "Subcommand/Length");
    assert.strictEqual(packet[4], 0x03, "Offset Low");
    assert.strictEqual(packet[5], 0x00, "Offset High");
    assert.strictEqual(packet[8], 0xFF, "Red");
    assert.strictEqual(packet[9], 0x00, "Green");
    assert.strictEqual(packet[10], 0x00, "Blue");
}
function testReadKeymap() {
    const packet = packets.buildReadKeymap(256, 1);
    assert.strictEqual(packet[0], 0x00, "Report ID");
    assert.strictEqual(packet[1], 0x06, "Command Group");
    assert.strictEqual(packet[2], 0x08, "Command ID");
    assert.strictEqual(packet[3], 0x3A, "Chunk Read Command");
    assert.strictEqual(packet[4], 0x00, "Offset Low (256 & 0xFF)");
    assert.strictEqual(packet[5], 0x01, "Offset High (256 >> 8)");
    assert.strictEqual(packet[7], 0x01, "Layer");
}
function testEnterIap() {
    const packet = packets.buildEnterIap();
    assert.strictEqual(packet[0], 0x00, "Report ID");
    assert.strictEqual(packet[1], 0x5A, "Command Group");
    assert.strictEqual(packet[2], 0xA0, "Command ID");
}
testSetSingleKeyRgb();
testReadKeymap();
testEnterIap();
console.log("All protocol tests passed.");
//# sourceMappingURL=packets.test.js.map