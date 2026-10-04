import PageShell from "@/components/ui/page-shell";
import Hero from "@/components/home/hero";
import StatsBar from "@/components/home/stats-bar";
import ResearchAreas from "@/components/home/research-areas";
import Announcements from "@/components/home/announcements";
import Approach from "@/components/home/approach";
import ProfessorsSection from "@/components/home/professors-section";
import RecruitmentBanner from "@/components/home/recruitment-banner";
import LatestNews from "@/components/home/latest-news";
import FAQSection from "@/components/home/faq-section";
import Newsletter from "@/components/home/newsletter";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <StatsBar />
      <ResearchAreas />
      <Announcements />
      <Approach />
      <ProfessorsSection />
      <RecruitmentBanner />
      <LatestNews />
      <FAQSection />
      <Newsletter />
    </PageShell>
  );
}
