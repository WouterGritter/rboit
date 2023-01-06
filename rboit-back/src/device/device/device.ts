export declare type DeviceType = 'power' | 'temperature';

export interface Device<T> {
    readonly name: string;
    readonly type: DeviceType;
    readonly history: T[];

    getReading(): Promise<T>;
}
