import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UserTypeSection from "@/components/UserTypeSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <UserTypeSection />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
