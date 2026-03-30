import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";
import { getJobBySlug, getJobSlugs } from "@/lib/jobs";
import TopSectionHeader from "@/components/TopSectionHeader";

type JobPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatLocation(region?: string | null, city?: string | null) {
  if (region && city) return `${region}, ${city}`;
  if (region) return region;
  if (city) return city;
  return "Brak lokalizacji";
}

export async function generateStaticParams() {
  const slugs = await getJobSlugs();

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Oferta pracy | DKS",
    };
  }

  return {
    title: `${job.position} | Kariera | DKS`,
    description:
      job.short_description ??
      `Oferta pracy: ${job.position}. Lokalizacja: ${formatLocation(
        job.region,
        job.city
      )}.`,
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Breadcrumb />

      <TopSectionHeader
        title={job.position}
        subtitle={formatLocation(job.region, job.city)}
        description={job.short_description ?? ""}
        img="/static/homepage/Header.webp"
      />

      <section className="px-9 py-10 md:px-10 md:py-16 lg:px-28 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10 items-start">
          
          {/* LEWA */}
          <div
            className="min-w-0"
            dangerouslySetInnerHTML={{ __html: job.description ?? "" }}
          />

          {/* PRAWA */}
          <aside className="min-w-0">
            <div
              className="bg-[#D1D5DC] p-8 lg:p-10"
              dangerouslySetInnerHTML={{ __html: job.aside ?? "" }}
            />
          </aside>

        </div>
      </section>
    </>
  );
}