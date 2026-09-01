"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectPacket = inspectPacket;
const constants_js_1 = require("./constants.js");
function inspectPacket(packet) {
    if (packet.length !== constants_js_1.PACKET_LENGTH) {
        return `INVALID PACKET LENGTH: ${packet.length} (Expected ${constants_js_1.PACKET_LENGTH})`;
    }
    const reportId = packet[0] || 0;
    const group = packet[1] || 0;
    const command = packet[2] || 0;
    const subcommand = packet[3] || 0;
    const payload = packet.slice(4).toString('hex').match(/.{1,2}/g)?.join(' ') || '';
    return `
Report ID:  0x${reportId.toString(16).padStart(2, '0')}
Length:     ${packet.length}
Group:      0x${group.toString(16).padStart(2, '0')}
Command:    0x${command.toString(16).padStart(2, '0')}
Subcommand: 0x${subcommand.toString(16).padStart(2, '0')}

Payload:
${payload}
`.trim();
}
//# sourceMappingURL=inspect.js.map