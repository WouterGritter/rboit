export interface PowerDevice {
    readonly name: string;
    readonly history: PowerReading[];

    getReading(): Promise<PowerReading>;
}

export declare type PowerReading = {
    date: Date;
    voltage?: number;
    amperage?: number;
    power?: number;
}
