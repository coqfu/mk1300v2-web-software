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
exports.buildGetConfig = buildGetConfig;
exports.buildSetSingleKeyRgb = buildSetSingleKeyRgb;
exports.buildReadKeymap = buildReadKeymap;
exports.buildReadRgbMap = buildReadRgbMap;
exports.buildSetSleepTimer = buildSetSleepTimer;
exports.buildSwitchProfile = buildSwitchProfile;
exports.buildFactoryReset = buildFactoryReset;
exports.buildEnterIap = buildEnterIap;
const constants = __importStar(require("./constants.js"));
/**
 * Creates a baseline 65-byte buffer with the report ID and command group.
 */
function createBasePacket(command) {
    const packet = Buffer.alloc(constants.PACKET_LENGTH, 0);
    packet[0] = constants.REPORT_ID;
    packet[1] = constants.COMMAND_GROUP;
    packet[2] = command;
    return packet;
}
function buildGetConfig() {
    return createBasePacket(constants.CMD_GET_CONFIG);
}
function buildSetSingleKeyRgb(keyIndex, r, g, b) {
    const packet = createBasePacket(constants.CMD_SET_KEY_RGB);
    packet[3] = 0x03;
    // Reverse engineered offset logic
    const offset = keyIndex * 3;
    packet[4] = offset & 0xFF;
    packet[5] = offset >> 8;
    packet[6] = 0x00;
    packet[7] = 0x00;
    packet[8] = r;
    packet[9] = g;
    packet[10] = b;
    return packet;
}
function buildReadKeymap(chunkOffset, layer) {
    const packet = createBasePacket(constants.CMD_READ_KEYMAP);
    packet[3] = 0x3A;
    packet[4] = chunkOffset & 0xFF;
    packet[5] = chunkOffset >> 8;
    packet[6] = 0x00;
    packet[7] = layer;
    return packet;
}
function buildReadRgbMap(chunkOffset) {
    const packet = createBasePacket(constants.CMD_READ_RGB_MAP);
    packet[3] = 0x3A;
    packet[4] = chunkOffset & 0xFF;
    packet[5] = chunkOffset >> 8;
    return packet;
}
function buildSetSleepTimer(timeInMinutes) {
    const packet = createBasePacket(constants.CMD_SET_SLEEP);
    packet[3] = 0x02;
    packet[4] = 0x00;
    packet[5] = 0x00;
    packet[6] = timeInMinutes & 0xFF;
    packet[7] = timeInMinutes >> 8;
    return packet;
}
function buildSwitchProfile(profileId) {
    const packet = createBasePacket(constants.CMD_SWITCH_PROFILE);
    packet[3] = profileId;
    return packet;
}
function buildFactoryReset() {
    const packet = createBasePacket(constants.CMD_FACTORY_RESET);
    packet[3] = 0xFF;
    return packet;
}
function buildEnterIap() {
    const packet = Buffer.alloc(constants.PACKET_LENGTH, 0);
    packet[0] = constants.REPORT_ID;
    packet[1] = constants.IAP_COMMAND_GROUP;
    packet[2] = constants.CMD_ENTER_IAP;
    return packet;
}
//# sourceMappingURL=packets.js.map