import Rail from "@/components/Rail";
import BlogPostContent from "@/components/BlogPostContent";

export async function generateMetadata({ params }) {
    const slug = (await params).slug;
    const title = slug
        ? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Post";
    return {
        title: `${title} | Journal — Akshita Agrawal`,
        description: `Read "${title}" on Akshita Agrawal's journal.`,
    };
}

export default async function BlogPostPage({ params }) {
    const slug = (await params).slug;
    return (
        <div className="page">
            <Rail />
            <main className="main-content" id="main-content">
                <BlogPostContent slug={slug} />
            </main>
        </div>
    );
}
