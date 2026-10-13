import { notFound } from "next/navigation";
import { getSurvey } from "@/lib/surveys";
import SurveyForm from "@/components/surveys/SurveyForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ankieta", robots: { index: false, follow: false } };

export default async function SurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const survey = await getSurvey(slug);
  if (!survey) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#E4002B]">Ankieta DKS</p>
      <h1 className="mb-5 text-3xl font-bold sm:text-4xl">{survey.title}</h1>
      {survey.description && <p className="mb-6 whitespace-pre-wrap text-neutral-700">{survey.description}</p>}
      <p className="mb-8 rounded-lg bg-neutral-100 p-4 text-sm">
        {survey.mode === "anonymous" ? "Ta ankieta nie zbiera danych kontaktowych. Nie podawaj ich w odpowiedziach otwartych." : "Ta ankieta zawiera pola kontaktowe."}
        {" "}Pola oznaczone * są wymagane.
      </p>
      {survey.questions.length ? <SurveyForm survey={survey} /> : <p>Ankieta nie jest jeszcze gotowa do wypełnienia.</p>}
    </main>
  );
}
