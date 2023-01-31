export abstract class Service {
    abstract start(): void | Promise<any>;
}
