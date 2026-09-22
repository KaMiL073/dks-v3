export type CalendarDetails = {
  id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};

function dateOnly(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

// Interpret CMS wall-clock times in Poland regardless of the visitor's timezone.
function warsawTime(day: string, time: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time)) return null;
  const local = `${day}T${time.slice(0, 5)}:00`;
  const target = Date.parse(`${local}Z`);
  let timestamp = target;
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  for (let i = 0; i < 3; i++) {
    const wall = formatter.format(new Date(timestamp)).replace(' ', 'T');
    const delta = target - Date.parse(`${wall}Z`);
    if (delta === 0) return new Date(timestamp);
    timestamp += delta;
  }
  return null; // Nonexistent time during the spring DST transition.
}

const compact = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
function fold(line: string) {
  let result = '', size = 0;
  for (const char of line) {
    const bytes = new TextEncoder().encode(char).length;
    if (size + bytes > 75) { result += '\r\n '; size = 1; }
    result += char;
    size += bytes;
  }
  return result;
}

export function getCalendarData(details: CalendarDetails) {
  let start = dateOnly(details.start_date);
  let end = details.end_date ? dateOnly(details.end_date) : start && new Date(start);
  if (!start || !end || end < start) return null;
  const allDay = !details.start_time;
  if (allDay) {
    if (details.end_time) return null;
    end.setUTCDate(end.getUTCDate() + 1);
  } else {
    start = warsawTime(details.start_date!, details.start_time!);
    end = details.end_time
      ? warsawTime(details.end_date || details.start_date!, details.end_time)
      : null;
    // A start without an end has no invented duration.
    if (!start || !end || end <= start) return null;
  }
  const startValue = allDay ? compact(start).slice(0, 8) : compact(start);
  const endValue = allDay ? compact(end).slice(0, 8) : compact(end);
  const google = new URL('https://calendar.google.com/calendar/render');
  google.search = new URLSearchParams({ action: 'TEMPLATE', text: details.title,
    dates: `${startValue}/${endValue}`, ctz: 'Europe/Warsaw',
    location: details.location || '', details: details.description || '' }).toString();
  const outlook = new URL('https://outlook.office.com/calendar/deeplink/compose');
  outlook.search = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent',
    subject: details.title, startdt: allDay ? start.toISOString().slice(0, 10) : start.toISOString(),
    enddt: allDay ? end.toISOString().slice(0, 10) : end.toISOString(), allday: String(allDay),
    location: details.location || '', body: details.description || '' }).toString();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DKS//Event calendar//PL',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${encodeURIComponent(details.id)}@dks.pl`,
    `DTSTAMP:${compact(new Date())}`, `DTSTART${allDay ? ';VALUE=DATE' : ''}:${startValue}`,
    `DTEND${allDay ? ';VALUE=DATE' : ''}:${endValue}`, `SUMMARY:${escapeText(details.title)}`,
    `LOCATION:${escapeText(details.location || '')}`, `DESCRIPTION:${escapeText(details.description || '')}`,
    'END:VEVENT', 'END:VCALENDAR'];
  return { google: google.href, outlook: outlook.href, ics: `${lines.map(fold).join('\r\n')}\r\n` };
}

export function formatEventSchedule(details: CalendarDetails) {
  const start = dateOnly(details.start_date);
  if (!start) return '';
  const format = (date: Date) => new Intl.DateTimeFormat('pl-PL', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  const end = dateOnly(details.end_date);
  const first = `${format(start)}${details.start_time ? ` ${details.start_time.slice(0, 5)}` : ''}`;
  if (end && end > start) return `${first} – ${format(end)}${details.end_time ? ` ${details.end_time.slice(0, 5)}` : ''}`;
  return `${first}${details.start_time && details.end_time ? ` – ${details.end_time.slice(0, 5)}` : ''}`;
}
