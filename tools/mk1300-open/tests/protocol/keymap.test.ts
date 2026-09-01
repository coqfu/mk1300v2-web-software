import { parseResponse } from '../../src/protocol/responses.js';
import * as assert from 'assert';

console.log("Running keymap parser tests...");

function testKeymapResponse() {
    // Simulated valid keymap chunk 0 response
    const packet = Buffer.alloc(65, 0);
    packet[0] = 0x00; // Report ID
    packet[1] = 0xAA; // Opcode
    packet[2] = 0x07; // Status/Group
    packet[3] = 0x3A; // Subcommand
    packet[4] = 0x00; // Chunk Offset
    packet[5] = 0x00;
    
    // Simulate first key mapping (Escape)
    packet[9] = 0x00;
    packet[10] = 0x20;
    packet[11] = 0x00;
    packet[12] = 0x29; // HID code for ESC
    
    const parsed = parseResponse(packet);
    assert.strictEqual(parsed.opcode, 0xAA);
    assert.strictEqual(parsed.status, 0x07);
    
    // Verify payload bytes
    assert.strictEqual(parsed.payload[0], 0x3A);
    assert.strictEqual(parsed.payload[9], 0x29);
}

testKeymapResponse();
console.log("Keymap response tests passed.");
