import Rail from "@/components/Rail";
import BlogListContent from "@/components/BlogListContent";

export const metadata = {
    title: "Journal | Akshita Agrawal",
    description: "Personal writing and reflections by Akshita Agrawal.",
};

export default function BlogPage() {
    return (
        <div className="page">
            <Rail />
            <main className="main-content" id="main-content">
                <BlogListContent />
            </main>
        </div>
    );
}
