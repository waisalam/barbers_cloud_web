import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top 5 Haircuts Trending in 2025",
    date: "June 15, 2025",
    excerpt:
      "Discover the hottest styles taking over barbershops this year. From modern fades to classic twists, we've got you covered.",
    slug: "#",
  },
  {
    id: 2,
    title: "How to Prep for Your First Barber Visit",
    date: "June 10, 2025",
    excerpt:
      "Nervous about your first professional cut? Here's everything you need to know before stepping into the chair.",
    slug: "#",
  },
  {
    id: 3,
    title: "Why BarbersCloud Is Changing the Game",
    date: "June 5, 2025",
    excerpt:
      "See how instant booking and live barber maps are reshaping the grooming experience, much like ride-hailing did for transport.",
    slug: "#",
  },
  {
    id: 4,
    title: "The Best Beard Oils for Summer",
    date: "June 1, 2025",
    excerpt:
      "Keep your beard soft and manageable during the hot months. We review top-rated oils that won't let you down.",
    slug: "#",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Insights, tips, and trends from the world of barbers and grooming.
          </p>
        </div>
      </section>

      {/* Blog Posts List */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          {mockPosts.map((post) => (
            <article key={post.id} className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-foreground">
                {post.title}
              </h3>
              <time className="mt-1 text-sm text-muted-foreground">
                {post.date}
              </time>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <Link
                href={post.slug}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Read More
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}