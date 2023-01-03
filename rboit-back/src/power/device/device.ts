export interface Device<T> {
    readonly name: string;
    readonly type: 'power' | 'temperature';
    readonly history: T[];

    getReading(): Promise<T>;
}
