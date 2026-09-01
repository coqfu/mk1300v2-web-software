import { parseResponse } from '../../src/protocol/responses.js';
import { PACKET_LENGTH } from '../../src/protocol/constants.js';
import * as assert from 'assert';

console.log("Running response parser tests...");

function testValidResponse() {
    const packet = Buffer.alloc(PACKET_LENGTH, 0);
    packet[0] = 0x00; // Report ID
    packet[1] = 0x06; // Opcode
    packet[2] = 0x01; // Status
    packet[3] = 0xFF; // Payload start
    
    const parsed = parseResponse(packet);
    assert.strictEqual(parsed.opcode, 0x06);
    assert.strictEqual(parsed.status, 0x01);
    assert.strictEqual(parsed.payload[0], 0xFF);
}

function testInvalidLength() {
    const packet = Buffer.alloc(10, 0);
    const parsed = parseResponse(packet);
    assert.strictEqual(parsed.opcode, -1);
    assert.ok(parsed.error?.includes('Invalid report length'));
}

testValidResponse();
testInvalidLength();

console.log("All response tests passed.");
