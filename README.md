# MK1300v2 Web Software

Welcome to the MK1300v2 Keyboard Software repository! This is a comprehensive Electron-based application that manages and configures the MK1300v2 mechanical keyboard.

## How the Keyboard Works

The MK1300v2 keyboard utilizes a modern WebHID architecture to interface directly with this Electron desktop application. Instead of relying on traditional, OS-specific USB drivers which can be clunky or restrictive, the software reads and writes HID (Human Interface Device) reports securely and efficiently to manage the state of the keyboard.

### Communication Flow:
1. **Device Connection:** The Electron main process intercepts the `select-hid-device` event. It verifies the keyboard's Vendor ID (VID) and Product ID (PID) to securely grant WebHID permission.
2. **Frontend Interface:** The renderer (built in `build/index.html`) visually maps the keys, lighting effects, and macros. It translates your clicks and customizations into HID byte commands.
3. **Hardware Storage:** When you hit "Apply" or "Save", the software sends these custom reports directly into the keyboard's onboard memory. This allows your configurations (macros, RGB patterns, keymaps) to persist even if you plug the keyboard into a different computer without the software installed.

---

## Configuration: `keymap.json`

A core feature of the MK1300v2 is its fully programmable keymap structure. The layout and configurations can be exported and imported using a standard JSON format (`keymap.json`).

### Structure of `keymap.json`
An example `keymap.json` is provided in the repository. Here is a breakdown of its primary components:

* **`vendorId` / `productId`:** Identifies the specific hardware revision.
* **`layers`:** The keyboard supports multiple functional layers (e.g., Base Layer, FN Layer). 
  * Each layer contains a 2D array (`keys`) mapping to physical switches.
  * `"TRNS"` (Transparent) signifies that the key will fall back to the function defined in the layer directly underneath it.
* **`macros`:** A list of automated sequences. You can record down/up key events and assign them an ID. These IDs can then be mapped to any physical key on any layer.
* **`lighting`:** Controls the hardware RGB controller (modes like `RGB_WAVE`, static colors, brightness, and effect speeds).

---

## Getting Started & Building the App

This app can be compiled as a standalone desktop application for Linux, macOS, and Windows. 

### Prerequisites
* Node.js (v16 or higher recommended)
* npm 

### Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/coqfu/mk1300v2-web-software.git
cd mk1300v2-web-software
npm install
```

### Building the Application
We use `electron-builder` to package the app into distributable formats (`.zip`, installers, etc.) for various operating systems.

To compile for all platforms (Linux, macOS, Windows) at once:
```bash
npm run build:all
```
Once the build process completes, check the `dist/` folder for the compiled applications and zip files.

### Development
To run the software locally in a development environment:
```bash
NODE_ENV=development npm start
```

## License
This project is open-source and licensed under the MIT License. See the `LICENSE` file for details.
