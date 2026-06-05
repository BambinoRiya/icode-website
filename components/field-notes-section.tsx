import { getPublishedArticles } from "@/lib/articles"
import { FieldNotesSectionClient } from "./field-notes-section-client"

export async function FieldNotesSection() {
  const articles = await getPublishedArticles()
  const latestArticles = articles.slice(0, 3)

  return <FieldNotesSectionClient articles={latestArticles} />
}