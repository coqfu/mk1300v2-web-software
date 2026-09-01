import * as packets from '../../src/protocol/packets.js';
import * as assert from 'assert';

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
