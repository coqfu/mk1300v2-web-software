import { parseResponse } from '../../src/protocol/responses.js';
import * as assert from 'assert';

console.log("Running rgb parser tests...");

function testRgbResponse() {
    // Simulated valid RGB chunk 0 response
    const packet = Buffer.alloc(65, 0);
    packet[0] = 0x00; // Report ID
    packet[1] = 0xAA; // Opcode
    packet[2] = 0x13; // Status/Group
    packet[3] = 0x3A; // Subcommand
    packet[4] = 0x00; // Chunk Offset
    packet[5] = 0x00;
    
    // Simulate first color (55 ff ff)
    packet[9] = 0x55; // R
    packet[10] = 0xFF; // G
    packet[11] = 0xFF; // B
    
    const parsed = parseResponse(packet);
    assert.strictEqual(parsed.opcode, 0xAA);
    assert.strictEqual(parsed.status, 0x13);
    
    // Verify payload bytes
    assert.strictEqual(parsed.payload[0], 0x3A);
    assert.strictEqual(parsed.payload[6], 0x55);
    assert.strictEqual(parsed.payload[7], 0xFF);
    assert.strictEqual(parsed.payload[8], 0xFF);
}

testRgbResponse();
console.log("RGB response tests passed.");
