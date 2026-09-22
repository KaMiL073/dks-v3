import { createHash } from 'node:crypto';

function escapeCalendarText(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;').replace(/,/g, '\\,');
}

// RFC 5545 limits content lines to 75 octets, including the continuation space.
function foldCalendarLine(line) {
  let result = '';
  let length = 0;
  for (const character of line) {
    const size = Buffer.byteLength(character, 'utf8');
    if (length + size > 75) {
      result += '\r\n ';
      length = 1;
    }
    result += character;
    length += size;
  }
  return result;
}

function calendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

function createCalendarInvitation(event, recipient) {
  const start = calendarDate(event.start_date);
  if (!start) return null;
  const end = calendarDate(event.end_date) || new Date(start);
  if (end < start) end.setTime(start.getTime());
  // Directus stores an inclusive last day; iCalendar DTEND is exclusive.
  end.setUTCDate(end.getUTCDate() + 1);
  const formatDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '');
  const email = String(recipient).trim();
  if (!/^[^\s<>:;,]+@[^\s<>:;,]+$/.test(email)) return null;
  const uid = createHash('sha256').update(`${event.id ?? event.slug}:${email.toLowerCase()}`).digest('hex');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DKS//Event registration//PL',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}@dks.pl`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${formatDate(start)}`,
    `DTEND;VALUE=DATE:${formatDate(end)}`,
    `SUMMARY:${escapeCalendarText(event.name)}`,
    ...(event.location ? [`LOCATION:${escapeCalendarText(event.location)}`] : []),
    ...(event.slug ? [`URL:https://www.dks.pl/wydarzenia/${encodeURIComponent(event.slug)}`] : []),
    'ORGANIZER;CN=DKS:mailto:www@dks.com.pl',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE:mailto:${email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return { filename: 'zaproszenie.ics', method: 'REQUEST', content: `${lines.map(foldCalendarLine).join('\r\n')}\r\n` };
}

export default ({ action }, { services, env }) => {
  const { MailService } = services;

  action('events.items.create', async (meta, { schema }) => {
    try {
      const token = env.SERVICE_USER_TOKEN || process.env.SERVICE_USER_TOKEN;
      if (!token) {
        console.warn('Missing SERVICE_USER_TOKEN');
        return;
      }

      async function readItems(path) {
        const response = await fetch(`http://directus:8055${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Event mail lookup failed: HTTP ${response.status}`);
        }
        return (await response.json()).data;
      }

      let formData = meta.payload || {};
      if ((!formData.email || !formData.event) && meta.key) {
        formData = (await readItems(`/items/events/${encodeURIComponent(meta.key)}`)) || formData;
      }
      if (!formData.email) {
        console.warn('Missing recipient email for event registration', meta.key);
        return;
      }
      const slug = String(formData.event || '').split('#')[0];
      if (!slug) {
        console.warn('Missing event slug for event registration', meta.key);
        return;
      }

      const query = new URLSearchParams({
        'filter[slug][_eq]': slug,
        limit: '1',
      });
      const events = await readItems(`/items/events_create?${query}`);
      const eventData = events?.[0];
      if (!eventData) {
        console.warn(`Event not found for slug: ${slug}`);
        return;
      }

      const mailService = new MailService({ schema });
      const icalEvent = createCalendarInvitation(eventData, formData.email);
      if (!icalEvent) console.warn('Event calendar invitation omitted: missing/invalid date or recipient', eventData.id);
      await mailService.send({
        from: 'www@dks.com.pl',
        subject: eventData.name,
        to: formData.email,
        ...(icalEvent ? { icalEvent } : {}),
        template: {
          name: 'event',
          data: { data: { ...formData, eventData } },
        },
      });
      console.log('Event email sent for registration', meta.key);
    } catch (error) {
      console.error('events.items.create mail hook error:', error);
    }
  });
};
