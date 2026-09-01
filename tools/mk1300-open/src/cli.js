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
const util_1 = require("util");
const packets = __importStar(require("./protocol/packets.js"));
const inspect_js_1 = require("./protocol/inspect.js");
const constants_js_1 = require("./protocol/constants.js");
const { values, positionals } = (0, util_1.parseArgs)({
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
        vid: constants_js_1.MK1300_VID.toString(16).toUpperCase(),
        pid: constants_js_1.MK1300_PID.toString(16).toUpperCase(),
        protocol: {
            reportId: 0,
            reportLength: constants_js_1.PACKET_LENGTH
        }
    };
    if (values.json) {
        console.log(JSON.stringify(info, null, 2));
    }
    else {
        console.log(`Target Device: MK1300 V2`);
        console.log(`VID: ${info.vid} | PID: ${info.pid}`);
    }
}
else if (command === 'inspect') {
    const subcommand = positionals[1];
    if (subcommand === 'rgb' && positionals[2] === 'static') {
        const hexColor = positionals[3] || 'FF0000';
        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);
        // Using keyIndex 0 as an example for inspection
        const packet = packets.buildSetSingleKeyRgb(0, r, g, b);
        console.log((0, inspect_js_1.inspectPacket)(packet));
    }
    else if (subcommand === 'factory-reset') {
        const packet = packets.buildFactoryReset();
        console.log((0, inspect_js_1.inspectPacket)(packet));
    }
    else {
        console.log("Unknown inspect subcommand.");
    }
}
else if (command === 'factory-reset' || command === 'iap') {
    console.error("Error: Hardware transport is disabled in this build.");
    process.exit(1);
}
else {
    console.log(`Unknown command: ${command}`);
}
//# sourceMappingURL=cli.js.map