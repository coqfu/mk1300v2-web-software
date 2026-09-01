"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOTLOADER_PID = exports.BOOTLOADER_VID = exports.MK1300_PID = exports.MK1300_VID = exports.USAGE_BOOTLOADER = exports.USAGE_KEYBOARD = exports.USAGE_PAGE_KEYBOARD = exports.PACKET_LENGTH = exports.CMD_ENTER_IAP = exports.IAP_COMMAND_GROUP = exports.CMD_SET_SLEEP = exports.CMD_SWITCH_PROFILE = exports.CMD_SET_KEY_RGB = exports.CMD_READ_RGB_MAP = exports.CMD_SET_RGB_MAP = exports.CMD_SET_KEY_MAPPING = exports.CMD_FACTORY_RESET = exports.CMD_READ_KEYMAP = exports.CMD_GET_CONFIG = exports.COMMAND_GROUP = exports.REPORT_ID = void 0;
exports.REPORT_ID = 0x00;
exports.COMMAND_GROUP = 0x06;
exports.CMD_GET_CONFIG = 0x05;
exports.CMD_READ_KEYMAP = 0x08;
exports.CMD_FACTORY_RESET = 0x0F;
exports.CMD_SET_KEY_MAPPING = 0x10;
exports.CMD_SET_RGB_MAP = 0x12;
exports.CMD_READ_RGB_MAP = 0x13;
exports.CMD_SET_KEY_RGB = 0x14;
exports.CMD_SWITCH_PROFILE = 0xFB;
exports.CMD_SET_SLEEP = 0xFC;
// Bootloader/IAP specific
exports.IAP_COMMAND_GROUP = 0x5A;
exports.CMD_ENTER_IAP = 0xA0;
exports.PACKET_LENGTH = 65; // Includes Report ID
exports.USAGE_PAGE_KEYBOARD = 0xFF00;
exports.USAGE_KEYBOARD = 0x0002;
exports.USAGE_BOOTLOADER = 0x0001;
// Device identifiers
exports.MK1300_VID = 0x36AE;
exports.MK1300_PID = 0xFEAD;
exports.BOOTLOADER_VID = 0x5566;
exports.BOOTLOADER_PID = 0x0009;
//# sourceMappingURL=constants.js.map