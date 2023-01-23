export function formatTime(hours?: number | undefined, minutes?: number | undefined, seconds?: number | undefined): string {
  if (hours === undefined) hours = 0;
  if (minutes === undefined) minutes = 0;
  if (seconds === undefined) seconds = 0;

  return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

export function formatDate(day: number, month: number, year: number): string {
  return String(day).padStart(2, '0') + '-' + String(month).padStart(2, '0') + '-' + String(year).padStart(2, '0');
}

export function formatDatetime(day: number, month: number, year: number, hours?: number | undefined, minutes?: number | undefined, seconds?: number | undefined): string {
  return formatDate(day, month, year) + ' ' + formatTime(hours, minutes, seconds);
}

export function formatTimeFromDate(date: Date): string {
  return formatTime(date.getHours(), date.getMinutes(), date.getSeconds());
}

export function formatDateFromDate(date: Date): string {
  return formatDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
}

export function formatDatetimeFromDate(date: Date): string {
  return formatDatetime(date.getDate(), date.getMonth() + 1, date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds());
}
