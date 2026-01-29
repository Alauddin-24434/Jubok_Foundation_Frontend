import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ArrowRight, Users, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import CommeeteeSection from "@/components/shared/home/CommeeteeSection";
import HeroSection from "@/components/shared/home/HeroSection";
import ContactUsSection from "@/components/shared/home/ContactUsSection";
import FaqSection from "@/components/shared/home/FaqSection";
import ProjectsSection from "@/components/shared/home/ProjectSection";
import AboutUsSection from "@/components/shared/home/AboutUseSection";

export default function LandingPage() {

  return (
    <div>
      {/* Hero Carousel */}
      <HeroSection />

      {/* PROJECTS */}
      <ProjectsSection />

      {/* ABOUT US */}
      <AboutUsSection/>

      {/* TEAM */}
      <CommeeteeSection />

      {/* CONTACT US */}
      <ContactUsSection />

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}
