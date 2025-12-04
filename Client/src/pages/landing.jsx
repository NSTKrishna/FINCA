import Navigation from "../component/layout/navbar";
import { Hero } from "../component/layout/hero";
import { Problem } from "../component/layout/problem";
import { Features } from "../component/layout/features";
import { HowItWorks } from "../component/layout/works";
import { CTA } from "../component/layout/cta";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}

export default LandingPage;
