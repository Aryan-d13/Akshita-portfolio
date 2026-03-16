import Rail from "@/components/Rail";
import BlogPostContent from "@/components/BlogPostContent";

export function generateMetadata({ params }) {
    const slug = params.slug;
    const title = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return {
        title: `${title} | Journal — Akshita Agrawal`,
        description: `Read "${title}" on Akshita Agrawal's journal.`,
    };
}

export default function BlogPostPage({ params }) {
    return (
        <div className="page">
            <Rail />
            <main className="main-content" id="main-content">
                <BlogPostContent slug={params.slug} />
            </main>
        </div>
    );
}
