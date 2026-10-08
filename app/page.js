import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import BrandMarquee from "@/components/BrandMarquee";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import FeaturedCreators from "@/components/FeaturedCreators";
import ComparisonSection from "@/components/ComparisonSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import SignUpCta from "@/components/SignUpCta";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <BrandMarquee />
        <HowItWorksSection />
        <StatsSection />
        <FeaturedCreators />
        <ComparisonSection />
        <TestimonialsSection />
        <FaqSection />
        <SignUpCta />
      </main>
    </>
  );
}
