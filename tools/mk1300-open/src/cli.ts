import { parseArgs } from 'util';
import * as packets from './protocol/packets.js';
import { inspectPacket } from './protocol/inspect.js';
import { MK1300_VID, MK1300_PID, PACKET_LENGTH } from './protocol/constants.js';

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
        'dry-run': {
            type: 'boolean',
            default: true
        },
        json: {
            type: 'boolean',
            default: false
        }
    },
    allowPositionals: true
});

const command = positionals[0];

function printDryRunBanner() {
    if (!values.json) {
        console.log(`
=========================================
               DRY RUN
No HID device accessed. No data transmitted.
=========================================
        `);
    }
}

if (!command) {
    console.log("Usage: mk1300 <command> [args]");
    console.log("Commands: info, inspect");
    process.exit(1);
}

printDryRunBanner();

import { NodeHidTransport } from './hid/NodeHidTransport.js';
import * as fs from 'fs';
import * as path from 'path';
import { parseResponse } from './protocol/responses.js';

if (command === 'info') {
    const info = {
        device: "MK1300 V2",
        vid: MK1300_VID.toString(16).toUpperCase(),
        pid: MK1300_PID.toString(16).toUpperCase(),
        protocol: {
            reportId: 0,
            reportLength: PACKET_LENGTH
        }
    };
    if (values.json) {
        console.log(JSON.stringify(info, null, 2));
    } else {
        console.log(`Target Device: MK1300 V2`);
        console.log(`VID: ${info.vid} | PID: ${info.pid}`);
    }
} else if (command === 'devices') {
    try {
        const transport = new NodeHidTransport();
        transport.enumerate();
    } catch (e: any) {
        console.error(e.message);
    }
} else if (command === 'get-config') {
    (async () => {
        try {
            const transport = new NodeHidTransport();
            await transport.open();

            const packet = packets.buildGetConfig();
            console.log("\nCommand:\nGET_CONFIG\n");
            console.log(`Length:\n${packet.length} bytes\n`);
            console.log(`Bytes:\n${packet.toString('hex').match(/.{1,2}/g)?.join(' ')}\n`);

            await transport.write(packet);
            console.log("Waiting for response...");
            
            const response = await transport.read();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dataPath = path.join(process.cwd(), '..', 'research', 'live-captures');
            
            if (!fs.existsSync(dataPath)) {
                fs.mkdirSync(dataPath, { recursive: true });
            }
            
            const binFile = path.join(dataPath, `get-config-${timestamp}.bin`);
            const jsonFile = path.join(dataPath, `get-config-${timestamp}.json`);
            
            fs.writeFileSync(binFile, response);
            
            const parsed = parseResponse(response);
            const resultData = {
                timestamp,
                reportLength: response.length,
                rawBytes: response.toString('hex'),
                parsed
            };
            
            fs.writeFileSync(jsonFile, JSON.stringify(resultData, null, 2));
            
            console.log("\n=== Response Received ===");
            console.log(`Length: ${response.length}`);
            console.log(`Raw: ${response.toString('hex')}`);
            console.log(`\n=== Parsed ===`);
            console.log(`Opcode: 0x${parsed.opcode.toString(16).padStart(2, '0')}`);
            console.log(`Status: 0x${parsed.status.toString(16).padStart(2, '0')}`);
            console.log(`Payload length: ${parsed.payload.length}`);
            
            await transport.close();
            
        } catch (e: any) {
            console.error(e.message);
        }
    })();
} else if (command === 'read-keymap') {
    (async () => {
        try {
            const transport = new NodeHidTransport();
            await transport.open();
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dataPath = path.join(process.cwd(), '..', 'research', 'live-captures', 'keymap');
            if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

            let chunkOffset = 0;
            const allChunks: Buffer[] = [];
            console.log("\nStarting Keymap Read...");

            while (true) {
                console.log(`Requesting chunk ${chunkOffset}...`);
                const packet = packets.buildReadKeymap(chunkOffset, 0); // layer 0
                await transport.write(packet);
                
                let response: Buffer;
                try {
                    response = await transport.read(2000); // 2 second timeout
                } catch (e) {
                    console.log("Timeout reached, assuming end of chunks.");
                    break;
                }

                const parsed = parseResponse(response);
                
                const binFile = path.join(dataPath, `keymap-${timestamp}-chunk${chunkOffset}.bin`);
                fs.writeFileSync(binFile, response);

                allChunks.push(parsed.payload);

                // Stop condition: payload all zeros, or specific stop byte? 
                // Let's just break if chunkOffset > 15 to prevent infinite loops, 
                // or if the parsed status/offset doesn't match our requested offset.
                if (chunkOffset > 20) {
                    console.log("Max chunks reached.");
                    break;
                }
                
                // Usually the keyboard returns the offset as status
                // But we don't know for sure, so let's just inspect the first few bytes.
                // If the entire payload is FF or 00 and we've read a few chunks, we might be at the end.
                // We'll increment and continue.
                chunkOffset++;
            }

            console.log(`\nFinished reading ${chunkOffset} chunks.`);
            await transport.close();
        } catch (e: any) {
            console.error(e.message);
        }
    })();
} else if (command === 'read-rgb') {
    (async () => {
        try {
            const transport = new NodeHidTransport();
            await transport.open();
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dataPath = path.join(process.cwd(), '..', 'research', 'live-captures', 'rgb');
            if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

            let chunkOffset = 0;
            const allChunks: Buffer[] = [];
            console.log("\nStarting RGB Map Read...");

            while (true) {
                console.log(`Requesting chunk ${chunkOffset}...`);
                const packet = packets.buildReadRgbMap(chunkOffset);
                await transport.write(packet);
                
                let response: Buffer;
                try {
                    response = await transport.read(2000);
                } catch (e) {
                    console.log("Timeout reached, assuming end of chunks.");
                    break;
                }

                const parsed = parseResponse(response);
                
                const binFile = path.join(dataPath, `rgb-${timestamp}-chunk${chunkOffset}.bin`);
                fs.writeFileSync(binFile, response);

                allChunks.push(parsed.payload);

                if (chunkOffset > 20) {
                    console.log("Max chunks reached.");
                    break;
                }
                
                chunkOffset++;
            }

            console.log(`\nFinished reading ${chunkOffset} chunks.`);
            await transport.close();
        } catch (e: any) {
            console.error(e.message);
        }
    })();
} else if (command === 'test-single-rgb') {
    (async () => {
        try {
            const transport = new NodeHidTransport();
            await transport.open();

            const getRgbColor = async (index: number) => {
                const packet = packets.buildReadRgbMap(0);
                await transport.write(packet);
                const response = await transport.read(2000);
                const parsed = parseResponse(response);
                // Data starts at byte 7 of payload (which is byte 9 of packet).
                // Wait, parsed.payload has chunk offset at byte 4 of packet.
                // In responses.ts, payload is report.slice(3).
                // So index 0 is byte 3 of packet.
                // Byte 9 of packet is index 6 of payload.
                // So key 0 is at parsed.payload[6], [7], [8].
                const offset = 6 + (index * 3);
                return {
                    r: parsed.payload[offset] || 0,
                    g: parsed.payload[offset + 1] || 0,
                    b: parsed.payload[offset + 2] || 0
                };
            };

            const originalRgb = await getRgbColor(0);
            console.log(`\nTarget key: ESC`);
            console.log(`Key index: 0`);
            console.log(`Current RGB: ${originalRgb.r.toString(16).padStart(2, '0').toUpperCase()} ${originalRgb.g.toString(16).padStart(2, '0').toUpperCase()} ${originalRgb.b.toString(16).padStart(2, '0').toUpperCase()}`);
            console.log(`New RGB: FF 00 00\n`);

            const testColor = { r: 255, g: 0, b: 0 };
            const writePacket = packets.buildSetSingleKeyRgb(0, testColor.r, testColor.g, testColor.b);

            // Safety Checks
            if (writePacket[2] !== 0x14 || writePacket.length !== 65) {
                console.error("ABORT: Packet safety check failed.");
                process.exit(1);
            }

            console.log("Command:\nSET_SINGLE_KEY_RGB\n");
            console.log("Key:\nESC\n");
            console.log("Index:\n0\n");
            console.log("RGB:\nFF 00 00\n");
            console.log("Report:\n65 bytes\n");
            console.log(`Packet:\n${writePacket.toString('hex').match(/.{1,2}/g)?.join(' ')}\n`);

            console.log("Sending write packet...");
            await transport.write(writePacket);
            
            console.log("Waiting for write to apply (500ms)...");
            await new Promise(resolve => setTimeout(resolve, 500));

            const verifyRgb = await getRgbColor(0);
            console.log(`\nRead-back RGB: ${verifyRgb.r.toString(16).padStart(2, '0').toUpperCase()} ${verifyRgb.g.toString(16).padStart(2, '0').toUpperCase()} ${verifyRgb.b.toString(16).padStart(2, '0').toUpperCase()}`);

            if (verifyRgb.r !== testColor.r || verifyRgb.g !== testColor.g || verifyRgb.b !== testColor.b) {
                console.error("Warning: Read-back did not match expected test color.");
            } else {
                console.log("Read-back verification SUCCESS.");
            }

            console.log("\nRestoring original color...");
            const restorePacket = packets.buildSetSingleKeyRgb(0, originalRgb.r, originalRgb.g, originalRgb.b);
            await transport.write(restorePacket);

            console.log("Waiting for restore to apply (500ms)...");
            await new Promise(resolve => setTimeout(resolve, 500));

            const finalRgb = await getRgbColor(0);
            console.log(`\nFinal read-back RGB: ${finalRgb.r.toString(16).padStart(2, '0').toUpperCase()} ${finalRgb.g.toString(16).padStart(2, '0').toUpperCase()} ${finalRgb.b.toString(16).padStart(2, '0').toUpperCase()}`);

            if (finalRgb.r !== originalRgb.r || finalRgb.g !== originalRgb.g || finalRgb.b !== originalRgb.b) {
                console.error("Warning: Final read-back did not match original color.");
            } else {
                console.log("Restore verification SUCCESS.");
            }

            await transport.close();
        } catch (e: any) {
            console.error(e.message);
        }
    })();
} else if (command === 'test-effect') {
    (async () => {
        try {
            const transport = new NodeHidTransport();
            await transport.open();

            // --- STEP 1: Read current effect config (STATIC mode, ID=0) ---
            // OEM: sendDeviceData(6, [22, 0, 0, 0, 1, 0, MODE_ID])
            console.log('\n--- STEP 1: Reading current STATIC effect config (mode 0) ---');
            const getPacket = packets.buildGetLightEffectConfig(0);
            console.log(`Packet: ${getPacket.slice(0, 12).toString('hex').match(/.{2}/g)?.join(' ')}`);
            await transport.write(getPacket);
            const getResponse = await transport.read(2000);
            console.log(`Response (raw): ${getResponse.toString('hex')}`);

            // OEM slices response at bytes 5..15 (payload[3..13] in our parser)
            // Full 65-byte report: [reportId, groupByte, cmdByte, ...data]
            // payload parsed = report.slice(1) = [groupByte, cmdByte, ...data]
            // OEM does .slice(5,16) on the full 65-byte array (skipping reportId which is [0])
            // so that's bytes[5..15] of the 65-byte report = report[5] through report[15]
            const originalCfg = Array.from(getResponse.slice(5, 16));
            console.log(`\nOriginal effect config (11 bytes from response[5..15]):`);
            console.log(originalCfg.map(b => b.toString(16).padStart(2, '0')).join(' '));
            console.log(`  type:       ${originalCfg[0]}`);
            console.log(`  mode:       ${originalCfg[2]} (current effect ID)`);
            console.log(`  brightness: ${originalCfg[3]}`);
            console.log(`  speed:      ${originalCfg[4]}`);

            // --- STEP 2: Read BREATHING effect config (ID=1) to use as test ---
            console.log('\n--- STEP 2: Reading BREATHING effect config (mode 1) ---');
            const breathPacket = packets.buildGetLightEffectConfig(1);
            await transport.write(breathPacket);
            const breathResponse = await transport.read(2000);
            const breathCfg = Array.from(breathResponse.slice(5, 16));
            breathCfg[2] = 1; // enforce mode = BREATHING
            console.log(`Breathing config: ${breathCfg.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

            // --- STEP 3: Write BREATHING effect ---
            console.log('\n--- STEP 3: Writing BREATHING effect ---');
            const setBreathPacket = packets.buildSetLightConfig(breathCfg);
            console.log(`Packet: ${setBreathPacket.slice(0, 16).toString('hex').match(/.{2}/g)?.join(' ')}`);
            await transport.write(setBreathPacket);

            console.log('\nWaiting 2 seconds — observe keyboard breathing effect...');
            await new Promise(r => setTimeout(r, 2000));

            // --- STEP 4: Read back to verify ---
            console.log('\n--- STEP 4: Read back active effect config ---');
            await transport.write(packets.buildGetLightEffectConfig(1));
            const verifyResponse = await transport.read(2000);
            const verifyCfg = Array.from(verifyResponse.slice(5, 16));
            console.log(`Verified config: ${verifyCfg.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            console.log(`  mode: ${verifyCfg[2]} (expected: 1 = BREATHING)`);

            // --- STEP 5: Restore original ---
            console.log('\n--- STEP 5: Restoring original effect ---');
            const restorePacket = packets.buildSetLightConfig(originalCfg);
            await transport.write(restorePacket);
            console.log('Restore packet sent.');

            await new Promise(r => setTimeout(r, 500));

            // --- STEP 6: Final read-back ---
            console.log('\n--- STEP 6: Final read-back ---');
            await transport.write(packets.buildGetLightEffectConfig(originalCfg[2] ?? 0));
            const finalResponse = await transport.read(2000);
            const finalCfg = Array.from(finalResponse.slice(5, 16));
            console.log(`Final config: ${finalCfg.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
            console.log(`  mode: ${finalCfg[2]} (expected: ${originalCfg[2]})`);

            const restored = finalCfg[2] === originalCfg[2];
            console.log(`\nRestore: ${restored ? 'SUCCESS' : 'MISMATCH — investigate before proceeding'}`);

            await transport.close();
        } catch (e: any) {
            console.error(e.message);
        }
    })();
} else if (command === 'inspect') {

    const subcommand = positionals[1];
    if (subcommand === 'rgb' && positionals[2] === 'static') {
        const hexColor = positionals[3] || 'FF0000';
        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);
        // Using keyIndex 0 as an example for inspection
        const packet = packets.buildSetSingleKeyRgb(0, r, g, b);
        console.log(inspectPacket(packet));
    } else if (subcommand === 'factory-reset') {
        const packet = packets.buildFactoryReset();
        console.log(inspectPacket(packet));
    } else {
        console.log("Unknown inspect subcommand.");
    }
} else if (command === 'factory-reset' || command === 'iap') {
    console.error("Error: Hardware transport is disabled in this build.");
    process.exit(1);
} else {
    console.log(`Unknown command: ${command}`);
}
