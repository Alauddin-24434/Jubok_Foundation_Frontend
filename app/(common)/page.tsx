"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetProjectsQuery } from "@/redux/features/project/projectApi";
import { useGetBannersQuery } from "@/redux/features/banner/bannerApi";
import Image from "next/image";
import ProjectCard from "@/components/projects/ProjectCard";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function LandingPage() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { data: projectsData } = useGetProjectsQuery({});
  const { data: bannersData } = useGetBannersQuery({});
  console.log(bannersData)

  // ---------------- INIT ----------------
  useEffect(() => {
    setMounted(true);
  }, []);

  const banners = bannersData || []
 

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
  // ---------------- DATA ----------------


  
  const faqQuestions = t("faq.questions", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  const committeeMembers = [
    {
      name: "Md. Alauddin",
      image: "/images/team1.jpg",
      roleKey: "team.roles.president",
    },
    {
      name: "Abdul Karim",
      image: "/images/team2.jpg",
      roleKey: "team.roles.secretary",
    },
  ];

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    emailjs
      .sendForm(
        "service_xxxxxx", // Replace with your Service ID
        "template_xxxxxx", // Replace with your Template ID
        formRef.current,
        "your_public_key" // Replace with your Public Key
      )
      .then(
        () => {
          toast.success(t("contact.success"));
          formRef.current?.reset();
          setIsSending(false);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          toast.error(t("contact.error"));
          setIsSending(false);
        }
      );
  };

  if (!mounted) return null;

  // ---------------- UI ----------------
  
  return (
    <div >
      {/* Hero Carousel */}
      <section className="relative h-[80vh] overflow-hidden">
        {banners.map((banner: any, index: number) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
               <Image 
                 src={banner.image || "/placeholder-banner.jpg"} 
                 alt={banner.title}
                 fill
                 className="object-cover"
                 priority={index === 0}
               />
               {/* Overlay */}
               <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-6 text-white leading-tight">
                {banner.title}
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
                {banner.description}
              </p>
              <Link href={banner.projectRef ? `/projects/${banner.projectRef._id || banner.projectRef}` : "/projects"}>
                <Button
                  size="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-6 md:px-8 h-10 md:h-12 text-sm md:text-base md:hidden"
                >
                  {t("hero.getStarted")} <ArrowRight size={16} />
                </Button>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-8 hidden md:flex"
                >
                  {t("hero.getStarted")} <ArrowRight size={20} />
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

      {/* PROJECTS */}
      <section id="projects" className="container mx-auto py-12 md:py-24 px-4 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">{t("project.featured")}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projectsData?.data?.slice(0, 4).map((project:any) => (
           <ProjectCard key={project?._id} project={project} />
          ))}
        </div>
        <div className="text-center mt-12">
           <Link href="/projects">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                 {t("project.exploreAll")} <ArrowRight className="ml-2" size={18} />
              </Button>
           </Link>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="container mx-auto py-12 px-4 md:px-8 md:py-24 border-t border-border/50">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
              {t("about.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed">
              {t("about.desc")}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6 pt-2 md:pt-4">
              <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2 md:mb-3">
                  <Users className="text-primary w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">{t("about.membersCount")}</h4>
                <p className="text-xs text-foreground/60">{t("about.membersDesc")}</p>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-2 md:mb-3">
                  <ArrowRight className="text-secondary rotate-[-45deg] w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">{t("about.projectsCount")}</h4>
                <p className="text-xs text-foreground/60">{t("about.projectsDesc")}</p>
              </div>
            </div>
            <Link href="/about" className="inline-block mt-2 md:mt-4">
              <Button variant="link" className="p-0 text-primary h-auto text-base md:text-lg gap-2">
                {t("about.visionLink")} <ArrowRight size={16} className="md:w-[18px]" />
              </Button>
            </Link>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
                <div className="text-9xl grayscale opacity-20">🌾🐟🏢</div>
             </div>
             <div className="absolute -bottom-6 -left-6 p-8 bg-background rounded-2xl shadow-2xl border border-border max-w-[200px]">
                <p className="text-3xl font-bold text-primary">{t("about.transparency")}</p>
                <p className="text-sm text-foreground/60">{t("about.transparencyDesc")}</p>
             </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{t("team.title")}</h2>
            <p className="text-sm md:text-base text-foreground/60 italic">
              {t("team.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {committeeMembers.map((member, index) => (
              <Card key={index} className="group overflow-hidden border-border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Users size={64} className="text-foreground/10" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                </div>
                <div className="p-6 text-center -mt-12 relative z-10">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium uppercase tracking-tighter">
                    {t(member.roleKey)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION / CTA */}
      <section className="container mx-auto py-12 md:py-24">
         <div className="rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary to-accent p-6 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-4 md:space-y-8">
               <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold leading-tight">
                 {t("cta.title")}
               </h2>
               <p className="text-sm sm:text-base md:text-xl text-primary-foreground/80 leading-relaxed">
                 {t("cta.desc")}
               </p>
               <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 md:px-10 h-10 md:h-14 text-sm md:text-lg font-bold">
                       {t("cta.joinInvestor")}
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto px-6 md:px-10 h-10 md:h-14 text-sm md:text-lg font-bold border-2 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10">
                       {t("cta.supportCause")}
                    </Button>
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* CONTACT US */}
      <section id="contact" className="container mx-auto py-24 border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("contact.title")}</h2>
          <p className="text-foreground/60">
            {t("contact.desc")}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="p-8 bg-background/50 backdrop-blur-sm border-border shadow-xl">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("contact.name")}</label>
                <Input name="user_name" placeholder={t("contact.name")} required className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("contact.emailLabel")}</label>
                <Input name="user_email" type="email" placeholder={t("contact.emailLabel")} required className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("contact.message")}</label>
                <Textarea name="message" placeholder={t("contact.message")} required className="min-h-[120px]" />
              </div>
              <Button type="submit" disabled={isSending} className="w-full h-12 text-lg font-bold gap-2">
                {isSending ? t("contact.sending") : t("contact.button")}
                <Send size={18} />
              </Button>
            </form>

            <div className="mt-12 pt-12 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="text-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <MapPin size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase">{t("contact.addressLabel")}</p>
                  <p className="text-[10px] text-foreground/60 mt-1">{t("contact.addressValue")}</p>
               </div>
               <div className="text-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <Phone size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase">{t("contact.phoneLabel")}</p>
                  <p className="text-[10px] text-foreground/60 mt-1">+880 1234 567 890</p>
               </div>
               <div className="text-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <Mail size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase">{t("contact.emailLabel")}</p>
                  <p className="text-[10px] text-foreground/60 mt-1">info@alhamdulillah.com</p>
               </div>
            </div>
          </Card>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-border h-full min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116833.95338883515!2d90.3372879857908!3d23.780620666016733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa5694a31a343f!2sDhaka!5e0!3m2!1sen!2sbd!4v1706167890000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto py-12 md:py-24 border-t border-border/50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">{t("faq.title")}</h2>
        
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {Array.isArray(faqQuestions) && faqQuestions.map((q, i) => (
            <Card
              key={i}
              onClick={() => setExpandedFAQ(i === expandedFAQ ? null : i)}
              className="p-4 md:p-6 cursor-pointer border-border/50 hover:border-primary/30 transition-all bg-background/50"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm md:text-lg pr-4">{q.q}</h3>
                <ChevronDown
                  className={`transition-transform duration-300 w-4 h-4 md:w-6 md:h-6 flex-shrink-0 ${expandedFAQ === i ? "rotate-180" : ""}`}
                />
              </div>
              <div className={`grid transition-all duration-300 ${expandedFAQ === i ? "grid-rows-[1fr] opacity-100 mt-2 md:mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="text-xs md:text-base text-foreground/70 leading-relaxed">{q.a}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
