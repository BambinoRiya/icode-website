import { getArticleBySlug, getPublishedArticles } from "@/lib/articles"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const articles = await getPublishedArticles()

  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: `${article.title} | iCODE Abakwa`,
    description: article.description,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const allArticles = await getPublishedArticles()
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const articleHTML = article.body_content
    ? generateHTML(
        typeof article.body_content === "string"
          ? JSON.parse(article.body_content)
          : article.body_content,
        [StarterKit]
      )
    : ""

  const formattedReadTime = article.read_time?.replace(" read", "") || ""

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <article>
        {/* Split Hero */}
        <section className="grid min-h-[720px] lg:grid-cols-2">
          {/* Left editorial panel */}
          <div className="flex items-center px-8 pt-28 pb-16 sm:px-12 lg:px-20">
            <div className="max-w-[700px]">
              <p className="mb-10 font-mono text-sm text-[#e53888]">
                field_note{" "}
                <span className="text-zinc-500">--category</span>{" "}
                {article.category?.toLowerCase().replaceAll(" ", "_")}{" "}
                <span className="text-zinc-500">--read_time</span>{" "}
                {formattedReadTime}
                <span className="ml-1 inline-block h-4 w-3 animate-pulse bg-[#e53888]" />
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#e53888]">
                  {article.category}
                </span>
                <span className="text-sm text-zinc-500">•</span>
                <span className="text-sm text-zinc-500">{article.date}</span>
                <span className="text-sm text-zinc-500">•</span>
                <span className="text-sm text-zinc-500">
                  {article.read_time}
                </span>
              </div>

              <h1 className="mb-6 max-w-none text-5xl font-black leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
                {article.title}
                <span className="text-[#e53888]">.</span>
              </h1>

              <p className="mb-10 max-w-md text-lg leading-8 text-zinc-600">
                {article.description}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e53888]/15 font-mono text-sm font-bold text-[#e53888]">
                  iC
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Written by</p>
                  <p className="font-semibold text-zinc-950">iCODE Abakwa</p>
                  <p className="text-xs text-zinc-500">
                    Field Notes from the lab
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right image panel */}
          <div className="relative min-h-[460px] lg:min-h-[720px]">
            {article.featured_image_url && (
              <Image
                src={article.featured_image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            )}

            <div className="absolute inset-0 bg-[#e53888]/25 mix-blend-multiply" />
          </div>
        </section>

        {/* Article Content */}
          <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div
              className="
                prose prose-lg max-w-4xl
                prose-p:text-[22px] prose-p:leading-9 prose-p:text-zinc-700
                prose-p:leading-10
                prose-headings:text-zinc-950 prose-headings:tracking-tight
                prose-a:text-[#e53888]
                prose-strong:text-zinc-950
                prose-blockquote:border-l-[#e53888]
                prose-blockquote:bg-[#e53888]/5
                prose-blockquote:px-6 prose-blockquote:py-2
                prose-blockquote:text-zinc-950
                prose-blockquote:not-italic
                prose-img:rounded-2xl
              "
              dangerouslySetInnerHTML={{ __html: articleHTML }}
            />
          </section>
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-zinc-200">
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-950">
                  More Field Notes
                </h2>

                <Link
                  href="/field-notes"
                  className="flex items-center gap-1 text-sm text-[#e53888] hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/field-notes/${related.slug}`}
                    className="group"
                  >
                    <div className="relative mb-4 h-48 overflow-hidden rounded-xl">
                      <Image
                        src={
                          related.featured_image_url ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                        }
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#e53888]/0 transition-colors group-hover:bg-[#e53888]/20" />
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#e53888]">
                      {related.category}
                    </p>

                    <h3 className="mb-2 line-clamp-2 font-bold text-zinc-950 transition-colors group-hover:text-[#e53888]">
                      {related.title}
                    </h3>

                    <p className="text-xs text-zinc-500">
                      {related.date} • {related.read_time}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  )
}