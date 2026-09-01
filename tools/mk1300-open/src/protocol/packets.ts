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

/**
 * OEM: sendDeviceData(6, [22, 0, 0, 0, 1, 0, MODE_ID])
 * Queries the keyboard's stored config for a given effect mode ID.
 * The keyboard returns an 11-byte struct starting at response byte 5.
 */
export function buildGetLightEffectConfig(modeId: number): Buffer {
    const packet = createBasePacket(constants.CMD_GET_LIGHT_EFFECT_CONFIG);
    packet[3] = 0x00;
    packet[4] = 0x00;
    packet[5] = 0x00;
    packet[6] = 0x01;
    packet[7] = 0x00;
    packet[8] = modeId & 0xFF;
    return packet;
}

/**
 * OEM: sendDeviceData(6, [11, cfg.length, 0, 0, ...cfg])
 * cfg is an 11-byte struct. cfg[2] = modeId to activate.
 *
 * NOTE: the firmware uses cfg as-is. Pass the full struct with meaningful values.
 * For effect-slot data from buildGetLightEffectConfig, override cfg[0]=type and cfg[3]=brightness
 * to match the UI's always-type=1 behaviour before calling this.
 */
export function buildSetLightConfig(cfg: number[]): Buffer {
    const packet = createBasePacket(constants.CMD_SET_LIGHT_CONFIG);
    packet[3] = cfg.length & 0xFF;
    packet[4] = 0x00;
    packet[5] = 0x00;
    for (let i = 0; i < cfg.length && i + 6 < constants.PACKET_LENGTH; i++) {
        packet[6 + i] = (cfg[i] ?? 0) & 0xFF;
    }
    return packet;
}

/**
 * OEM: getLightConfig() = sendDeviceData(6, [10]) -> .slice(5, 16) = 11-byte active config.
 * This reads the CURRENTLY ACTIVE effect, not a per-slot default.
 * Use this for read-before-write + restoration sequences.
 */
export function buildGetActiveLightConfig(): Buffer {
    return createBasePacket(constants.CMD_GET_LIGHT_CONFIG);
}

/**
 * Typed helper matching the OEM's setLightConfig() UI call pattern.
 * The OEM always uses type=1 when writing from the UI.
 * Struct layout: [type, 0, mode, brightness, speed, direction, color, 0, h, s, v]
 * Special case: if mode=STATIC (0), color is forced to 0.
 */
export type LightConfigParams = {
    mode: number;       // 0=Static, 1=Breathing, 2=Wave, etc.
    brightness: number; // 0–255
    speed: number;      // 0–255
    direction: number;  // 0 or 1
    color: number;      // 0=off, 1=on (non-static only)
    h: number;          // hue 0–255
    s: number;          // saturation 0–255
    v: number;          // value 0–255
};

export function buildSetLightConfigFromParams(p: LightConfigParams): Buffer {
    const cfg = [
        1,            // type — OEM always sends 1
        0,            // padding
        p.mode,
        p.brightness,
        p.speed,
        p.direction,
        p.mode === 0 ? 0 : p.color,  // OEM forces color=0 for STATIC
        0,            // padding
        p.h,
        p.s,
        p.v,
    ];
    return buildSetLightConfig(cfg);
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
