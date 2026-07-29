import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Platforms from "@/components/Platforms";
import FeatureCards from "@/components/FeatureCards";
import Testimonials from "@/components/Testimonials";
import Privacy from "@/components/Privacy";
import DesktopApp from "@/components/DesktopApp";
import Pricing from "@/components/Pricing";
import ExtraFeatures from "@/components/ExtraFeatures";
import FAQ from "@/components/FAQ";
import CreatorCTA from "@/components/CreatorCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Platforms />
        <FeatureCards />
        <Testimonials />
        <Privacy />
        <DesktopApp />
        <Pricing />
        <ExtraFeatures />
        <FAQ />
        <CreatorCTA />
      </main>
      <Footer />
    </>
  );
}
