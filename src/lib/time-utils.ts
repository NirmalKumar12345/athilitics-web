export function convertTo24Hour(hour: number, minute: string, ampm: string): string {
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

export function getTimeFromISO(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export function toISODateTime(date: string, time: string): string {
  if (!date || !time) return '';
  const [year, month, day] = date.split('-');
  const [hour = '00', minute = '00'] = time.split(':');
  const dt = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  return dt.toISOString();
}

export function parseTo24Hour(time: string): string {
  if (!time) return '';
  if (/^\d{2}:\d{2}$/.test(time)) return time;
  const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (match) {
    const hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampm = match[3].toUpperCase();
    return convertTo24Hour(hour, minute, ampm);
  }
  if (time.includes('T')) {
    const date = new Date(time);
    if (isNaN(date.getTime())) return '';
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
  return time;
}
