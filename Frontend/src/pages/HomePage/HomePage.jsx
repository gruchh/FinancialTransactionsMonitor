import CTASection from "../../components/Homepage/CTASection.jsx";
import Features from "../../components/Homepage/Features";
import Footer from "../../components/Homepage/Footer.jsx";
import HeroSection from "../../components/Homepage/HeroSection";
import Navigation from "../../components/Homepage/Navigation";
import StatsSection from "../../components/Homepage/StatsSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800 overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;