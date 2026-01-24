"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Moon,
  Sun,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const translations = {
  en: {
    brand: "Alhamdulillah Foundation",
    home: "Home",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    signUp: "Sign Up",
    bannerTitle1: "Collaborative Wealth Building",
    bannerDesc1:
      "Join 50+ members managing investment projects together with complete transparency",
    bannerTitle2: "Secure Investment Management",
    bannerDesc2:
      "Track every transaction with blockchain-backed security and real-time auditing",
    bannerTitle3: "Grow Your Community",
    bannerDesc3:
      "From agriculture to real estate, unlock opportunities that transform lives",
    featuredProjects: "Featured Projects",
    joinProject: "Join Project",
    raised: "Raised",
    target: "Target",
    members: "Members",
    faq: "Frequently Asked Questions",
    copyright: "© 2026 Alhamdulillah Foundation. All rights reserved.",
    lastUpdated: "Last updated",
    contactTitle: "Contact Us",
    contactDesc:
      "Building prosperous communities through collaborative investment.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressValue: "Dhaka, Bangladesh",
    contactButton: "Contact Us",
    teamTitle: "Management Committee",
    teamDesc:
      "Meet the people responsible for managing and supervising our projects",
    designationPresident: "President",
    designationSecretary: "General Secretary",
    designationTreasurer: "Treasurer",
    designationMember: "Executive Member",

    questions: [
      {
        q: "What is Alhamdulillah Foundation?",
        a: "We are a collaborative investment platform that helps communities pool resources and manage projects transparently with complete financial tracking.",
      },
      {
        q: "How do I join a project?",
        a: 'Browse available projects, review their details, and click "Join Project" to express interest. Our admin team will review and approve your request.',
      },
      {
        q: "Is my investment secure?",
        a: "Yes, we use blockchain-backed security, real-time auditing, and SSLCommerz payment gateway to ensure all transactions are safe and transparent.",
      },
      {
        q: "What types of projects are available?",
        a: "We manage various projects including agriculture, aquaculture, real estate development, and livestock farming initiatives.",
      },
      {
        q: "How are profits distributed?",
        a: "Profits are distributed based on individual investment amounts and project terms. All distributions are tracked and transparent in your dashboard.",
      },
      {
        q: "Can I withdraw my investment?",
        a: "Withdrawals depend on project terms and current status. Active projects typically allow withdrawals after project completion or milestone achievements.",
      },
    ],
  },
  bn: {
    brand: "আলহামদুলিল্লাহ ফাউন্ডেশন",
    home: "হোম",
    projects: "প্রকল্প",
    about: "সম্পর্কে",
    contact: "যোগাযোগ",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",
    bannerTitle1: "সহযোগী সম্পদ নির্মাণ",
    teamTitle: "পরিচালনা কমিটি",
    teamDesc:
      "আমাদের প্রকল্প পরিচালনা ও তত্ত্বাবধানে নিয়োজিত দায়িত্বশীল ব্যক্তিবর্গ",
    designationPresident: "সভাপতি",
    designationSecretary: "সাধারণ সম্পাদক",
    designationTreasurer: "কোষাধ্যক্ষ",
    designationMember: "কার্যনির্বাহী সদস্য",

    bannerDesc1:
      "৫০+ সদস্যদের সাথে যোগ দিন এবং সম্পূর্ণ স্বচ্ছতার সাথে বিনিয়োগ প্রকল্প পরিচালনা করুন",
    bannerTitle2: "নিরাপদ বিনিয়োগ ব্যবস্থাপনা",
    bannerDesc2:
      "ব্লকচেইন-সমর্থিত নিরাপত্তা এবং রিয়েল-টাইম অডিটিং সহ প্রতিটি লেনদেন ট্র্যাক করুন",
    bannerTitle3: "আপনার সম্প্রদায় বৃদ্ধি করুন",
    bannerDesc3:
      "কৃষি থেকে রিয়েল এস্টেট পর্যন্ত, জীবন পরিবর্তনকারী সুযোগ আনলক করুন",
    featuredProjects: "বৈশিষ্ট্যযুক্ত প্রকল্প",
    joinProject: "প্রকল্পে যোগ দিন",
    raised: "সংগৃহীত",
    target: "লক্ষ্য",
    contactTitle: "যোগাযোগ করুন",
    contactDesc: "সহযোগী বিনিয়োগের মাধ্যমে সমৃদ্ধ সম্প্রদায় গড়ে তোলা।",
    addressLabel: "ঠিকানা",
    phoneLabel: "ফোন",
    emailLabel: "ইমেইল",
    addressValue: "ঢাকা, বাংলাদেশ",
    contactButton: "যোগাযোগ করুন",

    members: "সদস্য",
    faq: "সাধারণ প্রশ্ন",
    copyright: "© ২০२৬ আলহামদুলিল্লাহ ফাউন্ডেশন। সর্বাধিকার সংরক্ষিত।",
    lastUpdated: "শেষ আপডেট",

    questions: [
      {
        q: "আলহামদুলিল্লাহ ফাউন্ডেশন কি?",
        a: "আমরা একটি সহযোগী বিনিয়োগ প্ল্যাটফর্ম যা সম্প্রদায়গুলিকে সম্পদ একত্রিত করতে এবং সম্পূর্ণ আর্থিক ট্র্যাকিং সহ প্রকল্প পরিচালনা করতে সহায়তা করে।",
      },
      {
        q: "আমি কীভাবে একটি প্রকল্পে যোগ দেব?",
        a: 'উপলব্ধ প্রকল্পগুলি ব্রাউজ করুন, তাদের বিবরণ পর্যালোচনা করুন এবং আগ্রহ প্রকাশ করতে "প্রকল্পে যোগ দিন" ক্লিক করুন। আমাদের প্রশাসক দল আপনার অনুরোধ পর্যালোচনা এবং অনুমোদন করবে।',
      },
      {
        q: "আমার বিনিয়োগ কি নিরাপদ?",
        a: "হ্যাঁ, আমরা ব্লকচেইন-সমর্থিত নিরাপত্তা, রিয়েল-টাইম অডিটিং এবং SSLCommerz পেমেন্ট গেটওয়ে ব্যবহার করি যাতে সমস্ত লেনদেন নিরাপদ এবং স্বচ্ছ থাকে।",
      },
      {
        q: "কোন ধরনের প্রকল্প উপলব্ধ?",
        a: "আমরা কৃষি, জলজ চাষ, রিয়েল এস্টেট উন্নয়ন এবং পশুপালন উদ্যোগ সহ বিভিন্ন প্রকল্প পরিচালনা করি।",
      },
      {
        q: "লাভ কীভাবে বিতরণ করা হয়?",
        a: "লাভ ব্যক্তিগত বিনিয়োগ পরিমাণ এবং প্রকল্পের শর্তাবলী উপর ভিত্তি করে বিতরণ করা হয়। সমস্ত বিতরণ আপনার ড্যাশবোর্ডে ট্র্যাক এবং স্বচ্ছ।",
      },
      {
        q: "আমি কি আমার বিনিয়োগ প্রত্যাহার করতে পারি?",
        a: "প্রত্যাহার প্রকল্পের শর্তাবলী এবং বর্তমান অবস্থার উপর নির্ভর করে। সক্রিয় প্রকল্পগুলি সাধারণত প্রকল্প সম্পন্ন বা মাইলফলক অর্জনের পরে প্রত্যাহার করতে দেয়।",
      },
    ],
  },
};
const committeeMembers = [
  {
    name: "Md. Alauddin",
    roleKey: "designationPresident",
    image: "/team/president.jpg",
  },
  {
    name: "Abdul Karim",
    roleKey: "designationSecretary",
    image: "/team/secretary.jpg",
  },
  {
    name: "Saiful Islam",
    roleKey: "designationTreasurer",
    image: "/team/treasurer.jpg",
  },
  {
    name: "Nur Mohammad",
    roleKey: "designationMember",
    image: "/team/member.jpg",
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const t = translations[language];

  const banners = [
    {
      title: t.bannerTitle1,
      description: t.bannerDesc1,
      bgClass: "from-emerald-500/15 via-emerald-600/10 to-slate-900",
    },
    {
      title: t.bannerTitle2,
      description: t.bannerDesc2,
      bgClass: "from-amber-500/15 via-amber-600/10 to-slate-900",
    },
    {
      title: t.bannerTitle3,
      description: t.bannerDesc3,
      bgClass: "from-blue-500/15 via-blue-600/10 to-slate-900",
    },
  ]; // Initial load (theme + language)
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const savedLang = localStorage.getItem("lang") as "en" | "bn" | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const projects = [
    {
      name: "Fish Farming Initiative",
      category: "Aquaculture",
      target: 500000,
      raised: 425000,
      members: 12,
      status: "Active",
      icon: "🐟",
    },
    {
      name: "Urban Agriculture Hub",
      category: "Agriculture",
      target: 300000,
      raised: 280000,
      members: 8,
      status: "Active",
      icon: "🌾",
    },
    {
      name: "Real Estate Development",
      category: "Property",
      target: 1000000,
      raised: 650000,
      members: 15,
      status: "Active",
      icon: "🏠",
    },
    {
      name: "Poultry Farm Expansion",
      category: "Livestock",
      target: 250000,
      raised: 195000,
      members: 6,
      status: "Active",
      icon: "🌱",
    },
  ];

  const lastUpdateDate = new Date().toLocaleDateString(
    language === "en" ? "en-US" : "bn-BD",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} scroll-smooth`}>
      <div className="bg-background text-foreground">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.brand.split(" ")[0]}
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#" className="hover:text-primary transition">
                {t.home}
              </Link>
              <Link href="#projects" className="hover:text-primary transition">
                {t.projects}
              </Link>
              <Link href="#faq" className="hover:text-primary transition">
                {t.faq}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                {isDarkMode ? "🌤 Light" : "🌙 Dark"}
              </button>

              <button
                onClick={() => {
                  const newLang = language === "en" ? "bn" : "en";
                  setLanguage(newLang);
                  localStorage.setItem("lang", newLang);
                }}
                className="rounded-md border px-3 py-1 text-sm"
              >
                {language === "en" ? "বাংলা" : "English"}
              </button>

              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  {t.signIn}
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t.signUp}
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Carousel */}
        <section className="mt-20 relative h-96 overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b ${banner.bgClass}`}
              />
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
                  {banner.description}
                </p>
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    Get Started <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 hover:bg-background/80 transition border border-border text-foreground hover:text-primary"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/60 hover:bg-background/80 transition border border-border text-foreground hover:text-primary"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition ${
                  index === currentSlide
                    ? "bg-primary w-8"
                    : "bg-foreground/30 hover:bg-foreground/50 w-2"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" className="py-20 px-4 container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">
            {t.featuredProjects}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden"
              >
                <div className="relative h-40 bg-gradient-to-br from-primary/40 to-primary/10 overflow-hidden">
                  <div className="absolute inset-0 opacity-60 flex items-center justify-center">
                    <div className="text-6xl">{project.icon}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  <span className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                    {project.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition">
                      {project.name}
                    </h3>
                    <p className="text-sm text-foreground/50">
                      {project.category}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground/70">{t.raised}</span>
                        <span className="text-primary font-semibold">
                          ৳{(project.raised / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                          style={{
                            width: `${(project.raised / project.target) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-foreground/50 mt-1">
                        {t.target}: ৳{(project.target / 1000).toFixed(0)}K
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-secondary" />
                      <span className="text-foreground/70">
                        {project.members} {t.members}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {t.joinProject}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary">
              {t.faq}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.questions.map((item, index) => {
                const isOpen = expandedFAQ === index;

                return (
                  <Card
                    key={index}
                    onClick={() => setExpandedFAQ(isOpen ? null : index)}
                    className={`
              cursor-pointer border border-border
              bg-card/60 backdrop-blur
              hover:border-primary/50 hover:shadow-md
              transition-all duration-300
            `}
                  >
                    <div className="p-6">
                      {/* Question */}
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-base md:text-lg font-semibold text-foreground">
                          {item.q}
                        </h3>

                        <ChevronDown
                          size={22}
                          className={`
                    text-primary shrink-0
                    transition-transform duration-300
                    ${isOpen ? "rotate-180" : ""}
                  `}
                        />
                      </div>

                      {/* Answer */}
                      <div
                        className={`
                  grid transition-all duration-300 ease-in-out
                  ${isOpen ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"}
                `}
                      >
                        <p className="overflow-hidden text-sm md:text-base text-foreground/70 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        {/* Management Committee Section */}
        <section id="committee" className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-4">
              {t.teamTitle}
            </h2>

            <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-12">
              {t.teamDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {committeeMembers.map((member, index) => (
                <Card
                  key={index}
                  className="bg-card/60 border-border hover:border-primary/50 transition-all duration-300 text-center overflow-hidden"
                >
                  <div className="p-6">
                    <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border border-border">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>

                    <p className="text-sm text-primary mt-1">
                      {String(t[member.roleKey as keyof typeof t])}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary">
              {t.contactTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              {/* Contact Info */}
              <Card className="bg-card/60 border-border p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {t.brand}
                  </h3>
                  <p className="text-foreground/70 text-sm">{t.contactDesc}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <p className="text-foreground/70">
                    📍{" "}
                    <span className="font-medium text-foreground">
                      {t.addressLabel}:
                    </span>{" "}
                    {t.addressValue}
                  </p>

                  <p className="text-foreground/70">
                    📞{" "}
                    <span className="font-medium text-foreground">
                      {t.phoneLabel}:
                    </span>{" "}
                    +880 1700-000000
                  </p>

                  <p className="text-foreground/70">
                    📧{" "}
                    <span className="font-medium text-foreground">
                      {t.emailLabel}:
                    </span>{" "}
                    info@alhamdulillah.com
                  </p>
                </div>

                <div className="pt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {t.contactButton}
                  </Button>
                </div>
              </Card>

              {/* Google Map */}
              <Card className="overflow-hidden border-border bg-card/60">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed"
                  className="w-full h-[350px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background/80 border-t border-border py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">
                  {t.brand}
                </h3>
                <p className="text-foreground/60">
                  Building prosperous communities through collaborative
                  investment.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-4">{t.home}</h4>
                <ul className="space-y-2 text-foreground/60 text-sm">
                  <li>
                    <Link href="#" className="hover:text-primary transition">
                      {t.projects}
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="hover:text-primary transition">
                      {t.faq}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition">
                      {t.about}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-4">{t.contact}</h4>
                <p className="text-foreground/60 text-sm">
                  Email: info@alhamdulillah.com
                </p>
                <p className="text-foreground/60 text-sm">
                  Phone: +880 1700-000000
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between text-sm text-foreground/50">
                <p>{t.copyright}</p>
                <p>
                  {t.lastUpdated}: {lastUpdateDate}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
