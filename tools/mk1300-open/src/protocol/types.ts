export type RgbColor = {
    r: number;
    g: number;
    b: number;
};

export type KeyIndex = number;
export type ProfileId = number;
export type SleepTimer = number;

export enum RgbEffect {
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
    RAINDROP = 12
}

export type DeviceConfig = {
    firmwareVersion?: string;
    layout?: number;
    activeProfile?: number;
    sleepTimer?: number;
};

export type KeyMapping = {
    index: KeyIndex;
    layer: number;
    type: number;
    code1: number;
    code2: number;
    code3: number;
};
