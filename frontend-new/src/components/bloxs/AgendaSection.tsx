"use client";

type Speaker = {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  position?: string | null;
};

type AgendaItem = {
  id: number;
  name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  icon?: string | null;
  ikona?: string | null;
  speakers?: Speaker[];
};

type AgendaItemEntry = {
  id: number;
  agenda_id?: AgendaItem | null;
};

type AgendaSectionItem = {
  id: number;
  name?: string | null;
  data?: string | null;
  agenda?: AgendaItemEntry[];
};

function getSpeakerName(speaker: Speaker) {
  if (speaker.fullname?.trim()) return speaker.fullname.trim();

  const fullName = `${speaker.name ?? ""} ${speaker.lastname ?? ""}`.trim();
  return fullName || "Prelegent";
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "";

  const startValue = start?.slice(0, 5);
  const endValue = end?.slice(0, 5);

  if (startValue && endValue) return `${startValue} - ${endValue}`;
  return startValue || endValue || "";
}

function formatDuration(start?: string | null, end?: string | null) {
  if (!start || !end) return "";

  const [sh = "0", sm = "0"] = start.split(":");
  const [eh = "0", em = "0"] = end.split(":");

  const startMin = Number(sh) * 60 + Number(sm);
  const endMin = Number(eh) * 60 + Number(em);

  const diff = endMin - startMin;
  if (diff <= 0) return "";

  return `(${diff} minut)`;
}

function formatDate(date?: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function normalizeMaterialIconName(value?: string | null) {
  if (!value?.trim()) return null;

  return value
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
}

function getAgendaIcon(item?: AgendaItem | null) {
  return (
    normalizeMaterialIconName(item?.ikona) ||
    normalizeMaterialIconName(item?.icon) ||
    null
  );
}

export default function AgendaSection({ item }: { item: AgendaSectionItem }) {
  const agenda = Array.isArray(item.agenda) ? item.agenda : [];

  if (agenda.length === 0) return null;

  return (
    <section className="py-12 md:py-20 py-18 px-4 sm:px-6 lg:px-8 xl:px-28">
      <div className="flex flex-col gap-12">
        <h2 className="text-3xl font-semibold text-Text-headings md:text-4xl">
          {item.name?.trim() || "Agenda"}
        </h2>

        <div className="flex flex-col">
          {item.data && (
            <div className="flex items-end gap-6 py-6 md:pl-32">
              <div className="text-3xl font-bold text-Text-body md:text-4xl">
                {formatDate(item.data)}
              </div>
              <div className="h-px flex-1 bg-[#000000]" /></div>
          )}

          {agenda.map((entry) => {
            const agendaItem = entry.agenda_id;
            if (!agendaItem) return null;

            const speakers = Array.isArray(agendaItem.speakers)
              ? agendaItem.speakers
              : [];

            const mainSpeaker = speakers[0];
            const iconName = getAgendaIcon(agendaItem);

            const timeRange = formatTimeRange(
              agendaItem.start_date,
              agendaItem.end_date
            );

            const duration = formatDuration(
              agendaItem.start_date,
              agendaItem.end_date
            );

            return (
              <div key={entry.id}>
                <div className="md:gap-10 md:pl-32 md:pr-8">
                  <div className="flex items-center gap-10 py-8 border-b border-[#99A1AF]">
                    <div className="flex h-[110px] w-[110px] shrink-0 items-center justify-center">
                      {iconName ? (
                        <span
                          className="material-symbols-outlined text-icon-[  #99A1AF]"
                          style={{
                            fontSize: "110px",
                            lineHeight: 1,
                            fontVariationSettings:
                              '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48',
                          }}
                          aria-hidden="true"
                        >
                          {iconName}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="text-3xl font-semibold leading-10 text-Text-body">
                        {timeRange}
                        {duration ? ` ${duration}` : ""}
                      </div>

                      <div className="text-3xl leading-10 text-Text-body">
                        {agendaItem.name}
                      </div>

                      {mainSpeaker ? (
                        <div className="text-3xl leading-10 text-Text-body">
                          {getSpeakerName(mainSpeaker)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}