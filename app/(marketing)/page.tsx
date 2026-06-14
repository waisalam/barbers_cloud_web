import { Hero } from "@/components/sections/hero";
import { ScrollShowcase } from "@/components/sections/scroll-showcase";
import { ForShopsPreview } from "@/components/sections/for-shops-preview";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { PricingCards } from "@/components/sections/pricing-cards";
import { DownloadCta } from "@/components/sections/download-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollShowcase />
      <ForShopsPreview />
      <FeaturesGrid />
      <PricingCards />
      <DownloadCta />
    </>
  );
}
