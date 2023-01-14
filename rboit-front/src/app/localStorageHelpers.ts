import {Subject} from "rxjs";

export function bindToLocalStorage<T>(subject: Subject<T>, key: string): void {
  const value = JSON.parse(localStorage.getItem(key) as string) as T;
  if (value !== null && value !== undefined) {
    subject.next(value);
  }

  subject.subscribe(value => {
    localStorage.setItem(key, JSON.stringify(value));
  });
}
