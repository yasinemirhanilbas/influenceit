import { notFound } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import BrandMarquee from "@/components/BrandMarquee";
import GallerySection from "@/components/GallerySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import FeaturedCreators from "@/components/FeaturedCreators";
import OpenBriefsSection from "@/components/OpenBriefsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SignUpCta from "@/components/SignUpCta";
import { isLocale } from "@/locales";

// Home is a short overview. Details live on their own pages.
export default async function HomePage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <HeroSection lang={lang} />
      <BrandMarquee lang={lang} />
      <GallerySection lang={lang} />
      <HowItWorksSection lang={lang} showFullLink />
      <FeaturedCreators lang={lang} />
      <OpenBriefsSection lang={lang} />
      <StatsSection lang={lang} />
      <TestimonialsSection lang={lang} />
      <SignUpCta lang={lang} />
    </>
  );
}
