import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPromotionHeroTitle,
  getPromotionBySlug,
  getPromotionsSlugs,
} from "@/lib/promotions";
import DirectusRenderer from "@/components/bloxs/DirectusRenderer";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";
import ContactSection from "@/app/(marketing)/ContactSection";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const items = await getPromotionsSlugs();

  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);

  if (!promo) {
    return {
      title: "Promocja | DKS",
    };
  }

  const heroTitle = getPromotionHeroTitle(promo);
  const title = promo.seo_title?.trim() || (heroTitle ? `${heroTitle} | DKS` : "Promocja | DKS");
  const description = promo.seo_description?.trim() || "Promocja DKS";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/promocje/${slug}`,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/promocje/${slug}`,
    },
  };
}

export default async function PromotionPage({ params }: PageProps) {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);

  if (!promo) {
    notFound();
  }

  const components = Array.isArray(promo.components_promotions)
    ? promo.components_promotions
    : [];

  return (
    <main>
      <Breadcrumb />

      {components.length > 0 ? (
        <DirectusRenderer components={components as never} />
      ) : (
        <section className="px-6 py-20 lg:px-28">
          <p className="text-lg text-gray-500">
            Brak treści dla tej promocji.
          </p>
        </section>
      )}
      <ContactSection />
    </main>
  );
}
