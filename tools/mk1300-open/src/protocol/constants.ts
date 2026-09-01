export const REPORT_ID = 0x00;
export const COMMAND_GROUP = 0x06;

export const CMD_GET_CONFIG = 0x05;
export const CMD_READ_KEYMAP = 0x08;
export const CMD_FACTORY_RESET = 0x0F;
export const CMD_SET_KEY_MAPPING = 0x10;
export const CMD_SET_RGB_MAP = 0x12;
export const CMD_READ_RGB_MAP = 0x13;
export const CMD_SET_KEY_RGB = 0x14;
export const CMD_SWITCH_PROFILE = 0xFB;
export const CMD_SET_SLEEP = 0xFC;

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
