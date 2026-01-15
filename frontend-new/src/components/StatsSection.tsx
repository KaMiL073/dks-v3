type StatItem = {
  value: string;
  label: string;
};

const stats: StatItem[] = [
  {
    value: "30+",
    label: "lat na rynku",
  },
  {
    value: "5,5 tys.",
    label: "obsługiwanych firm",
  },
  {
    value: "12",
    label: "oddziałów w całej Polsce",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full px-6 lg:px-28 py-20 flex justify-center">
      <div className="w-full max-w-7xl flex flex-wrap justify-between gap-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-6 flex-1 min-w-[220px]"
          >
            <div className="text-center text-red-600 text-6xl font-semibold leading-[64px]">
              {stat.value}
            </div>

            <div className="text-center text-Text-headings text-4xl font-normal leading-[48px]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}