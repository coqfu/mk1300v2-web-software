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

if (command === 'info' || command === 'devices') {
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
