export const REPORT_ID = 0x00;
export const COMMAND_GROUP = 0x06;

export const CMD_GET_CONFIG = 0x05;
export const CMD_READ_KEYMAP = 0x08;
export const CMD_SET_LIGHT_CONFIG = 0x0B; // Writes effect config struct
export const CMD_FACTORY_RESET = 0x0F;
export const CMD_SET_KEY_MAPPING = 0x10;
export const CMD_SET_RGB_MAP = 0x12;
export const CMD_READ_RGB_MAP = 0x13;
export const CMD_SET_KEY_RGB = 0x14;
export const CMD_GET_LIGHT_EFFECT_CONFIG = 0x16; // Queries effect config for a given mode ID
export const CMD_SWITCH_PROFILE = 0xFB;
export const CMD_SET_SLEEP = 0xFC;

// RGB Effect Mode IDs recovered from OEM setLightEffectConfig() dispatch
// Source: page-e2712c16b4e30f31.js — sendDeviceData(6, [22, 0, 0, 0, 1, 0, MODE_ID])
// These are firmware-native effect IDs stored as byte index [2] in the effect config struct.
export enum RgbEffectMode {
    STATIC = 0,
    BREATHING = 1,
    WAVE = 2,
    REACTIVE = 3,
    RIPPLE = 4,
    AURORA = 5,
    RAINBOW = 6,
    TWINKLE = 7,
    SNAKE = 8,
    RADAR = 9,
    METEOR = 10,
    STARLIGHT = 11,
    RAINDROP = 12,
}

// Bootloader/IAP specific
export const IAP_COMMAND_GROUP = 0x5A;
export const CMD_ENTER_IAP = 0xA0;

export const PACKET_LENGTH = 65; // Includes Report ID

export const USAGE_PAGE_KEYBOARD = 0xFF00;
export const USAGE_KEYBOARD = 0x0002;
export const USAGE_BOOTLOADER = 0x0001;

// Device identifiers
export const MK1300_VID = 0x36AE;
export const MK1300_PID = 0xFEAD;
export const BOOTLOADER_VID = 0x5566;
export const BOOTLOADER_PID = 0x0009;
