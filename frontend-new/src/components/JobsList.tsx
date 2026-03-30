import Link from "next/link";
import { getJobs } from "@/lib/jobs";

function formatLocation(region?: string | null, city?: string | null) {
  if (region && city) return `${region}, ${city}`;
  if (region) return region;
  if (city) return city;
  return "Brak lokalizacji";
}

export default async function JobsList() {
  const jobs = await getJobs();

  return (
    <section className="self-stretch bg-surface-page px-6 py-12 md:px-12 xl:px-28 xl:py-20">
      <div className="flex flex-col items-start gap-16">
        <div className="inline-flex w-full flex-wrap items-center justify-start gap-12">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-12 md:min-w-[495px] md:max-w-[710px]">
            <h2 className="text-3xl font-semibold leading-tight text-Text-headings md:text-4xl md:leading-[56px]">
              Oferty pracy
            </h2>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-10">
          {jobs.length === 0 ? (
            <div className="w-full bg-surface-secondary px-6 py-8">
              <p className="text-lg text-Text-body md:text-xl">
                Obecnie nie ma aktywnych ofert pracy.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/kariera/${job.slug}`}
                className="w-full bg-[#D1D5DC] px-6 py-8 transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <article className="flex flex-col items-start gap-6">
                  <h3 className="text-2xl font-semibold leading-9 text-Text-body md:text-3xl md:leading-10">
                    {job.position}
                  </h3>

                  <div className="inline-flex items-center justify-start gap-2.5 self-stretch">
                    <p className="text-lg leading-6 text-Text-body md:text-xl">
                      <span className="font-semibold">Region: </span>
                      <span className="font-normal">
                        {formatLocation(job.region, job.city)}
                      </span>
                    </p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}