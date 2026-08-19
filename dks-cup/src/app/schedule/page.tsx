import Link from "next/link";

type ScheduledMatch = { pitch: string; group: string; teams: string };
type MatchSlot = { time: string; matches: ScheduledMatch[] };

const matchSlots: MatchSlot[] = [
  { time: "10:00–10:15", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "DKS – MPEC Olsztyn" }, { pitch: "Boisko B", group: "Grupa B", teams: "Straż Pożarna – MICHELIN" }] },
  { time: "10:20–10:35", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "EGGER – Urząd Marszałkowski" }, { pitch: "Boisko B", group: "Grupa B", teams: "Nutripol – Port Lotniczy Wrocław" }] },
  { time: "10:40–10:55", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "DKS – Indykpol" }, { pitch: "Boisko B", group: "Grupa B", teams: "MICHELIN – PWiK Olsztyn" }] },
  { time: "11:00–11:15", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "MPEC Olsztyn – EGGER" }, { pitch: "Boisko B", group: "Grupa B", teams: "Straż Pożarna – Nutripol" }] },
  { time: "11:20–11:35", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "Indykpol – Urząd Marszałkowski" }, { pitch: "Boisko B", group: "Grupa B", teams: "PWiK Olsztyn – Port Lotniczy Wrocław" }] },
  { time: "11:40–11:55", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "DKS – EGGER" }, { pitch: "Boisko B", group: "Grupa B", teams: "MICHELIN – Nutripol" }] },
  { time: "12:00–12:15", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "MPEC Olsztyn – Indykpol" }, { pitch: "Boisko B", group: "Grupa B", teams: "Straż Pożarna – PWiK Olsztyn" }] },
  { time: "12:20–12:35", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "DKS – Urząd Marszałkowski" }, { pitch: "Boisko B", group: "Grupa B", teams: "MICHELIN – Port Lotniczy Wrocław" }] },
  { time: "12:40–12:55", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "Indykpol – EGGER" }, { pitch: "Boisko B", group: "Grupa B", teams: "PWiK Olsztyn – Nutripol" }] },
  { time: "13:00–13:15", matches: [{ pitch: "Boisko A", group: "Grupa A", teams: "MPEC Olsztyn – Urząd Marszałkowski" }, { pitch: "Boisko B", group: "Grupa B", teams: "Straż Pożarna – Port Lotniczy Wrocław" }] },
];

const eventItems = [
  { time: "13:15–13:35", title: "Przerwa techniczna", description: "Podliczenie tabel i przygotowanie półfinałów", kind: "break" },
  { time: "13:35–13:50", title: "Półfinał 1", description: "1. miejsce Grupy A – 2. miejsce Grupy B", kind: "match" },
  { time: "13:35–13:50", title: "Półfinał 2", description: "1. miejsce Grupy B – 2. miejsce Grupy A", kind: "match" },
  { time: "od 14:00", title: "Obiad", description: "Dla drużyn, które zakończyły udział. Finaliści i uczestnicy meczu o 3. miejsce po swoich spotkaniach.", kind: "meal" },
  { time: "14:00–14:15", title: "Mecz o 3. miejsce", description: "Przegrany półfinału 1 – przegrany półfinału 2", kind: "match" },
  { time: "14:15–14:25", title: "Przerwa organizacyjna", description: "Przygotowanie boiska do finału", kind: "break" },
  { time: "14:25–14:40", title: "Finał", description: "Zwycięzca półfinału 1 – zwycięzca półfinału 2", kind: "final" },
  { time: "14:40–15:10", title: "Obiad finalistów", description: "Obiad dla drużyn kończących fazę finałową", kind: "meal" },
  { time: "15:10–15:40", title: "Dekoracja", description: "Puchary, medale, statuetki i nagrody", kind: "ceremony" },
  { time: "15:40–16:00", title: "Zdjęcia i zakończenie", description: "Networking i strefa partnerów", kind: "ceremony" },
];

export default function EventSchedulePage() {
  return <main className="event-schedule-page">
    <header className="event-schedule-hero">
      <Link href="/" aria-label="Powrót do DKS CUP"><span className="event-back-arrow" /></Link>
      <div><span>DKS CUP 2026</span><h1>Harmonogram wydarzenia</h1></div>
      <dl>
        <div><dt>Data</dt><dd>28 sierpnia 2026</dd></div>
        <div><dt>Miejsce</dt><dd>Olsztyn, Dajtki, ul. Żytnia 71</dd></div>
        <div><dt>Format</dt><dd>2 grupy po 5 drużyn · mecze 15 minut</dd></div>
      </dl>
    </header>

    <section className="event-schedule-section" aria-labelledby="group-stage-title">
      <div className="event-section-heading"><span>10:00–13:15</span><h2 id="group-stage-title">Faza grupowa</h2><p>Po każdym meczu przewidziano 5 minut przerwy organizacyjnej.</p></div>
      <div className="event-match-slots">
        {matchSlots.map((slot, index) => <div className="event-slot-wrap" key={slot.time}>
          <article className="event-match-slot">
            <time>{slot.time}</time>
            <div>{slot.matches.map(match => <div className="event-match-row" key={match.pitch}>
              <span>{match.pitch}</span><small>{match.group}</small><strong>{match.teams}</strong>
            </div>)}</div>
          </article>
          {index < matchSlots.length - 1 && <div className="event-break"><span>{slot.time.slice(-5)}–{matchSlots[index + 1].time.slice(0,5)}</span><p>Przerwa organizacyjna</p></div>}
        </div>)}
      </div>
    </section>

    <section className="event-schedule-section event-finals" aria-labelledby="final-stage-title">
      <div className="event-section-heading"><span>13:15–16:00</span><h2 id="final-stage-title">Faza finałowa i wydarzenia</h2><p>Pełny program obejmuje również przerwy, obiad, dekorację i zakończenie.</p></div>
      <div className="event-timeline">
        {eventItems.map((item, index) => <article className={`event-timeline-item event-timeline-item--${item.kind}`} key={`${item.time}-${item.title}`}>
          <div className="event-timeline-marker"><i />{index < eventItems.length - 1 && <span />}</div>
          <time>{item.time}</time><div><h3>{item.title}</h3><p>{item.description}</p></div>
        </article>)}
      </div>
    </section>

    <aside className="event-organizational-info">
      <h2>Informacje organizacyjne</h2>
      <div><article><h3>Boiska</h3><p>Boisko A — górna połowa. Boisko B — dolna połowa.</p></article><article><h3>Obiad</h3><p>Wydawanie od 14:00. Drużyny fazy finałowej otrzymają obiad po swoich spotkaniach.</p></article><article><h3>Dekoracja</h3><p>Po obiedzie: puchary, medale, statuetki i nagrody.</p></article></div>
    </aside>
    <Link className="event-schedule-return" href="/">Powrót do turnieju</Link>
  </main>;
}
