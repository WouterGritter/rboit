import {BehaviorSubject} from "rxjs";

export function getLocalStorageItem<T>(key: string): T | undefined {
  const value = JSON.parse(localStorage.getItem(key) as string) as T | undefined | null;
  if (value === null || value === undefined) {
    return undefined;
  } else {
    return value;
  }
}

export function getLocalStorageItemOrDefault<T>(key: string, defaultValue: T): T {
  const value = getLocalStorageItem<T>(key);
  if (value !== undefined) {
    return value;
  } else {
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export class BoundBehaviorSubject<T> extends BehaviorSubject<T> {
  constructor(key: string, defaultValue: T) {
    super(getLocalStorageItemOrDefault(key, defaultValue));

    this.subscribe(value => {
      setLocalStorageItem(key, value);
    })
  }
}
