import Footer from '@/components/footer';
import Aboutus from '@/components/landing/aboutus';
import Clubs from '@/components/landing/clubs';
import DataDrivenInsights from '@/components/landing/data-driven-insights';
import FAQS from '@/components/landing/faq';
import Generator from '@/components/landing/generator';
import GraphAI from '@/components/landing/graph-ai';
import Home from '@/components/landing/home';
import SocialNetworks from '@/components/landing/social-network';

export default function Page() {
  return (
    <div className="bg-black w-full">
      <div className="h-screen">
        <Home />
      </div>
      <Aboutus />
      <SocialNetworks />
      <DataDrivenInsights />
      <GraphAI />
      <Clubs />
      <Generator />
      <FAQS />
      <Footer bg="bg-black" />
    </div>
  );
}
