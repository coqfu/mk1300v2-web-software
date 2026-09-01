"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DryRunTransport = void 0;
const constants_js_1 = require("../protocol/constants.js");
class DryRunTransport {
    isOpen = false;
    writtenPackets = [];
    async open() {
        this.isOpen = true;
    }
    async close() {
        this.isOpen = false;
    }
    async write(report) {
        if (!this.isOpen)
            throw new Error("Transport is closed");
        this.writtenPackets.push(Buffer.from(report));
    }
    async read(timeout) {
        if (!this.isOpen)
            throw new Error("Transport is closed");
        // Return a mock 65-byte zero buffer
        return Buffer.alloc(constants_js_1.PACKET_LENGTH, 0);
    }
}
exports.DryRunTransport = DryRunTransport;
//# sourceMappingURL=DryRunTransport.js.map