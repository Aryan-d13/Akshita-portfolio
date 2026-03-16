import Rail from "@/components/Rail";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="page">
      <Rail />
      <main className="main-content" id="main-content">
        <HomeContent />
      </main>
    </div>
  );
}
