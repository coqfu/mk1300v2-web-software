import * as constants from './constants.js';

/**
 * Creates a baseline 65-byte buffer with the report ID and command group.
 */
function createBasePacket(command: number): Buffer {
    const packet = Buffer.alloc(constants.PACKET_LENGTH, 0);
    packet[0] = constants.REPORT_ID;
    packet[1] = constants.COMMAND_GROUP;
    packet[2] = command;
    return packet;
}

export function buildGetConfig(): Buffer {
    return createBasePacket(constants.CMD_GET_CONFIG);
}

export function buildSetSingleKeyRgb(keyIndex: number, r: number, g: number, b: number): Buffer {
    const packet = createBasePacket(constants.CMD_SET_KEY_RGB);
    packet[3] = 0x03; 
    
    // Reverse engineered offset logic
    const offset = keyIndex * 3;
    packet[4] = offset & 0xFF;
    packet[5] = offset >> 8;
    
    packet[6] = 0x00;
    packet[7] = 0x00;
    packet[8] = 0x00;
    packet[9] = r;
    packet[10] = g;
    packet[11] = b;
    return packet;
}

export function buildReadKeymap(chunkOffset: number, layer: number): Buffer {
    const packet = createBasePacket(constants.CMD_READ_KEYMAP);
    packet[3] = 0x3A;
    packet[4] = chunkOffset & 0xFF;
    packet[5] = chunkOffset >> 8;
    packet[6] = 0x00;
    packet[7] = layer;
    return packet;
}

export function buildReadRgbMap(chunkOffset: number): Buffer {
    const packet = createBasePacket(constants.CMD_READ_RGB_MAP);
    packet[3] = 0x3A;
    packet[4] = chunkOffset & 0xFF;
    packet[5] = chunkOffset >> 8;
    return packet;
}

export function buildSetSleepTimer(timeInMinutes: number): Buffer {
    const packet = createBasePacket(constants.CMD_SET_SLEEP);
    packet[3] = 0x02;
    packet[4] = 0x00;
    packet[5] = 0x00;
    packet[6] = timeInMinutes & 0xFF;
    packet[7] = timeInMinutes >> 8;
    return packet;
}

export function buildSwitchProfile(profileId: number): Buffer {
    const packet = createBasePacket(constants.CMD_SWITCH_PROFILE);
    packet[3] = profileId;
    return packet;
}

export function buildFactoryReset(): Buffer {
    const packet = createBasePacket(constants.CMD_FACTORY_RESET);
    packet[3] = 0xFF;
    return packet;
}

export function buildEnterIap(): Buffer {
    const packet = Buffer.alloc(constants.PACKET_LENGTH, 0);
    packet[0] = constants.REPORT_ID;
    packet[1] = constants.IAP_COMMAND_GROUP;
    packet[2] = constants.CMD_ENTER_IAP;
    return packet;
}
