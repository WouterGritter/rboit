export class LerpedNumber {

  private _value: number | undefined;
  private _target: number | undefined;

  private readonly lerpFactor: number;
  private readonly cutoff: number;

  private intervalId: any | undefined = undefined;

  constructor(lerpFactor: number, cutoff: number) {
    this._value = undefined;
    this._target = undefined;
    this.lerpFactor = lerpFactor;
    this.cutoff = cutoff;
  }

  public get value(): number {
    return this._value ?? 0;
  }

  public set value(value: number) {
    if (this._value === undefined || this.hasReachedTarget(value)) {
      this._value = value;
      this._target = value;
      this.stopUpdateInterval();
    } else {
      this._target = value;
      this.startUpdateInterval();
    }
  }

  private update(): void {
    if (this._value === undefined || this._target === undefined) {
      throw new Error();
    }

    this._value = this._value + (this._target - this._value) * this.lerpFactor;

    if (this.hasReachedTarget()) {
      this._value = this._target;
      this.stopUpdateInterval();
    }
  }

  private startUpdateInterval(): void {
    if (this.intervalId !== undefined) {
      return;
    }

    this.intervalId = setInterval(
      () => this.update(),
      1000 / 30
    );
  }

  private stopUpdateInterval(): void {
    if (this.intervalId === undefined) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  private hasReachedTarget(actualTarget?: number): boolean {
    if (actualTarget === undefined) actualTarget = this._target;
    return Math.abs((this._value ?? 0) - (actualTarget ?? 0)) < this.cutoff;
  }
}
