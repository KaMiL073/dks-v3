"use client";

import { formatEventSchedule, getCalendarData, type CalendarDetails } from "@/lib/eventCalendar";

export type EventLocationItem = {
  id: number;
  location?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};
export type CalendarEvent = { id: number; name: string; slug: string; location: string | null; start_date: string | null; end_date: string | null };

export default function EventLocationSection({ item, event }: { item: EventLocationItem; event?: CalendarEvent }) {
  const details: CalendarDetails = {
    ...item,
    id: `event-${event?.id ?? 'custom'}-location-${item.id}`,
    title: event?.name || item.location || 'Wydarzenie DKS',
    location: item.location?.trim() || event?.location?.trim(),
    start_date: item.start_date || event?.start_date,
    end_date: item.end_date || (item.start_date ? item.start_date : event?.end_date),
  };
  const schedule = formatEventSchedule(details);
  const calendar = getCalendarData(details);
  const buttonClass = "inline-flex w-full items-center justify-center rounded-lg bg-[var(--surface-action,#e60028)] p-4 text-center text-lg font-semibold leading-7 text-[var(--Text-on-action,#ffffff)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:w-auto 2xl:text-2xl";
  function downloadCalendar() {
    if (!calendar) return;
    const url = URL.createObjectURL(new Blob([calendar.ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wydarzenie-dks.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (!details.location && !schedule && !item.description) return null;
  return (
    <section aria-label="Lokalizacja i termin wydarzenia" className="overflow-hidden bg-[#D1D5DC] px-4 py-12 text-[var(--Text-body,#20292f)] sm:px-6 lg:px-8 xl:px-28 xl:py-20">
      <div className="mx-auto flex max-w-[1694px] flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-8 xl:gap-12">
          <div className="flex flex-col gap-6">
            {details.location && <h2 className="break-words text-2xl font-semibold leading-snug md:text-3xl 2xl:text-4xl 2xl:leading-[56px]">{details.location}</h2>}
            {schedule && <p className="text-2xl font-semibold leading-snug md:text-3xl 2xl:text-4xl 2xl:leading-[56px]">{schedule}</p>}
          </div>
          {item.description && <p className="whitespace-pre-line text-xl leading-8 2xl:text-3xl 2xl:leading-10">{item.description}</p>}
          {calendar && <div className="flex flex-wrap items-start gap-4 2xl:gap-12">
            <a className={buttonClass} href={calendar.google} target="_blank" rel="noopener noreferrer">Google Calendar</a>
            <a className={buttonClass} href={calendar.outlook} target="_blank" rel="noopener noreferrer">Microsoft Outlook</a>
            <button className={buttonClass} onClick={downloadCalendar} type="button">Apple Calendar</button>
          </div>}
        </div>
        {details.location && <div className="relative min-h-80 w-full min-w-0 flex-1 self-stretch lg:min-h-96">
          <iframe
            title={`Mapa lokalizacji wydarzenia: ${details.location}`}
            src={`https://www.google.com/maps?${new URLSearchParams({ q: details.location, output: 'embed', hl: 'pl', z: '15' })}`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>}
      </div>
    </section>
  );
}
