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
const responses_js_1 = require("../../src/protocol/responses.js");
const constants_js_1 = require("../../src/protocol/constants.js");
const assert = __importStar(require("assert"));
console.log("Running response parser tests...");
function testValidResponse() {
    const packet = Buffer.alloc(constants_js_1.PACKET_LENGTH, 0);
    packet[0] = 0x00; // Report ID
    packet[1] = 0x06; // Opcode
    packet[2] = 0x01; // Status
    packet[3] = 0xFF; // Payload start
    const parsed = (0, responses_js_1.parseResponse)(packet);
    assert.strictEqual(parsed.opcode, 0x06);
    assert.strictEqual(parsed.status, 0x01);
    assert.strictEqual(parsed.payload[0], 0xFF);
}
function testInvalidLength() {
    const packet = Buffer.alloc(10, 0);
    const parsed = (0, responses_js_1.parseResponse)(packet);
    assert.strictEqual(parsed.opcode, -1);
    assert.ok(parsed.error?.includes('Invalid report length'));
}
testValidResponse();
testInvalidLength();
console.log("All response tests passed.");
//# sourceMappingURL=responses.test.js.map