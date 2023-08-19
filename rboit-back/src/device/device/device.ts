export declare type DeviceType = 'power' | 'temperature';

export interface Device<T extends DeviceReading> {
    readonly name: string;
    readonly type: DeviceType;
    readonly history: T[];

    getReading(): Promise<T>;
    isReady(): boolean;
    waitForReady(): Promise<string>;
}

export declare type DeviceReading = {
    date: Date;
}
