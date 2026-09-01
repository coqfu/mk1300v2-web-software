import { MK1300V2, DeviceState } from '../../src/devices/MK1300V2.js';
import { DryRunTransport } from '../../src/hid/DryRunTransport.js';
import * as assert from 'assert';

async function testDeviceStateMachine() {
    console.log("Running MK1300V2 State Machine Test...");
    const transport = new DryRunTransport();
    const device = new MK1300V2(transport);

    assert.strictEqual(device.state, DeviceState.DISCONNECTED);

    await device.connect();

    // After connect, it should have progressed through the initialization sequence
    assert.strictEqual(device.state, DeviceState.READY);

    // Verify it sent exactly 3 initialization packets (GetConfig, ReadKeymap, ReadRgb)
    assert.strictEqual(transport.writtenPackets.length, 3);
    
    // First packet should be GetConfig (0x00, 0x06, 0x05)
    assert.strictEqual(transport.writtenPackets[0] ? transport.writtenPackets[0][2] : -1, 0x05);

    // Now test a regular command
    await device.setSingleKeyRgb(1, 0xFF, 0, 0);
    assert.strictEqual(transport.writtenPackets.length, 4);
    assert.strictEqual(transport.writtenPackets[3] ? transport.writtenPackets[3][2] : -1, 0x14); // SetKeyRgb

    await device.disconnect();
    assert.strictEqual(device.state, DeviceState.DISCONNECTED);
}

testDeviceStateMachine().catch(err => {
    console.error(err);
    process.exit(1);
});
