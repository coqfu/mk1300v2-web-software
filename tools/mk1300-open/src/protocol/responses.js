"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = parseResponse;
const constants_js_1 = require("./constants.js");
function parseResponse(report) {
    if (report.length !== constants_js_1.PACKET_LENGTH) {
        return {
            opcode: -1,
            status: -1,
            payload: Buffer.alloc(0),
            error: `Invalid report length: ${report.length}`
        };
    }
    // Byte 0 is Report ID, Byte 1 is Opcode, Byte 2 is Status/Chunk Offset
    // The minified OEM code uses a DataView.
    // If the OEM code creates an ArrayBuffer, WebHID strips ReportID if it's implicitly 0, 
    // but the extracted code indicates 65 bytes, so we assume Report ID is present at index 0.
    // Fallback logic for WebHID that might strip the report ID:
    let payloadStart = 1;
    // We already check packet length is 65 above, so length === 64 is impossible unless we allow varying lengths. Let's just remove the 64 check.
    const opcode = report[payloadStart] || 0;
    const status = report[payloadStart + 1] || 0;
    const payload = report.slice(payloadStart + 2);
    return {
        opcode,
        status,
        payload
    };
}
//# sourceMappingURL=responses.js.map