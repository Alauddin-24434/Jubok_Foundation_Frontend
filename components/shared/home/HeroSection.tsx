"use client";

import { Button } from "@/components/ui/button";
import { useGetBannersQuery } from "@/redux/features/banner/bannerApi";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
   
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: bannersData = [] } = useGetBannersQuery({});

  const banners = bannersData ?? [];

  // ---------------- AUTO SLIDE ----------------
  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    if (!banners.length) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (!banners.length) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (!banners.length) return null;

    

    
  return (
    <section className="relative w-full overflow-hidden
      h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] mt-14"
    >
      {banners.map((banner: any, index: number) => (
        <div
          key={banner._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* Background Image */}
          <Image
            src={banner.image || "/placeholder-banner.jpg"}
            alt={banner.title || "Banner"}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center px-4">
            <div className="text-center max-w-3xl">
              <h1 className="
                text-white font-bold leading-tight
                text-2xl sm:text-3xl md:text-5xl lg:text-6xl
                mb-3 md:mb-6
              ">
                {banner.title}
              </h1>

              <p className="
                text-gray-200
                text-sm sm:text-base md:text-lg lg:text-xl
                mb-5 md:mb-8
                leading-relaxed
              ">
                {banner.description}
              </p>

              <Link
                href={
                  banner.projectRef
                    ? `/projects/${banner.projectRef._id || banner.projectRef}`
                    : "/projects"
                }
                className="inline-flex"
              >
                <Button
                  className="
                    rounded-full gap-2
                    px-6 py-2 md:px-8 md:py-3
                    text-sm md:text-base
                  "
                >
                  {t("hero.getStarted")}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows (hide on small devices) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30
          p-2 rounded-full bg-background/60 hover:bg-background/80
          border border-border transition"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30
          p-2 rounded-full bg-background/60 hover:bg-background/80
          border border-border transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all rounded-full
              ${index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
