export function getDaysFromDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

export function truncateTime(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
}

export function parseUTCDate(date: Date): Date {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
    ));
}

export function diffInDays(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime();
    return Math.round(diff / 1000 / 60 / 60 / 24);
}
