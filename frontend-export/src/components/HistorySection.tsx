type Milestone = {
  year: string;
  description: string;
  side: "left" | "right";
};

const milestones: Milestone[] = [
  {
    year: "1993",
    description: "start of the DKS company by three family members",
    side: "right",
  },
  {
    year: "1998",
    description:
      "opening new branches to the biggest cities: Warsaw, Katowice, Poznań, Wrocław, Łódź, Kraków, Szczecin, Bydgoszcz, Gdańsk, Rzeszów, Białystok",
    side: "left",
  },
  {
    year: "1999",
    description: "moving company to the new office and warehouse",
    side: "right",
  },
  {
    year: "2012",
    description: "building headquarter in Gdańsk and start of exporting",
    side: "left",
  },
  {
    year: "2016",
    description:
      "building big warehouse for used copiers and expanding of export",
    side: "right",
  },
  {
    year: "2024+",
    description:
      "sending pallets / trucks / containers to the customers in Poland, Europe, Middle East, Asia, Africa, South America",
    side: "left",
  },
];

export default function HistorySection() {
  return (
    <section className="w-full px-6 lg:px-28 py-20 bg-surface-page">
      <h2 className="text-Text-headings text-4xl font-semibold leading-[56px]">
        Our history
      </h2>

      <div className="w-full max-w-6xl mx-auto mt-12">
        {milestones.map((milestone, index) => (
          <div key={milestone.year}>
            <div className="grid grid-cols-[64px_1fr] md:grid-cols-[1fr_80px_1fr] items-center min-h-20">
              <div
                className={`col-start-2 row-start-1 pl-6 md:pl-0 ${
                  milestone.side === "left"
                    ? "md:col-start-1 md:pr-20"
                    : "md:col-start-3 md:pl-20"
                }`}
              >
                <div className="text-Text-headings text-base font-semibold leading-tight">
                  {milestone.year}
                </div>
                <p className="mt-2 text-Text-body text-base font-normal leading-tight">
                  {milestone.description}
                </p>
              </div>

              <div className="col-start-1 row-start-1 md:col-start-2 flex justify-center">
                <div
                  className="w-16 h-16 rounded-full bg-red-600"
                  aria-hidden="true"
                />
              </div>
            </div>

            {index < milestones.length - 1 && (
              <div
                className="grid grid-cols-[64px_1fr] md:grid-cols-[1fr_80px_1fr] h-20"
                aria-hidden="true"
              >
                <div className="col-start-1 md:col-start-2 flex justify-center items-center text-Text-body text-3xl font-normal">
                  ↓
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
