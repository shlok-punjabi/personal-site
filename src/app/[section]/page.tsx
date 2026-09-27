import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entryForSection, home } from "@/content/home";

export const dynamicParams = false;

export function generateStaticParams() {
  return home.entries.map((entry) => ({
    section: entry.href.slice(1),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const entry = entryForSection(section);
  if (!entry) return {};
  return { title: entry.label };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const entry = entryForSection(section);
  if (!entry) notFound();

  return (
    <article className="article">
      <p className="dest-copy">{entry.response}</p>
      <p className="dest-note">{entry.note}</p>
      <ul className="dest-list">
        {entry.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
