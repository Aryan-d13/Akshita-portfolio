import Rail from "@/components/Rail";
import GalleryContent from "@/components/GalleryContent";

export const metadata = {
    title: "Photography | Akshita Agrawal",
    description: "A curated visual journal — photographs taken by Akshita Agrawal.",
};

export default function GalleryPage() {
    return (
        <div className="page">
            <Rail />
            <main className="main-content" id="main-content">
                <GalleryContent />
            </main>
        </div>
    );
}
