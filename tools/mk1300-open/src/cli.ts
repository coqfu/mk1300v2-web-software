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
