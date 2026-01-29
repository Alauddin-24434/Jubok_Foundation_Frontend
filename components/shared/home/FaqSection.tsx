"use client";

import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { t } = useTranslation();

  const faqQuestions = t("faq.questions", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  return (
    <section
      id="faq"
      className=" px-4 py-12 md:py-24 border-t border-border/50"
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
        {t("faq.title")}
      </h2>

      {/* FAQ Grid */}
      <div
        className="
          container mx-auto
          grid grid-cols-1 md:grid-cols-2
          gap-4 md:gap-6
        "
      >
        {Array.isArray(faqQuestions) &&
          faqQuestions.map((q, i) => (
            <Card
              key={i}
              onClick={() => setExpandedFAQ(i === expandedFAQ ? null : i)}
              className="
                p-4 md:p-6 cursor-pointer
                border-border/50 hover:border-primary/30
                transition-all duration-300
                bg-background/50 backdrop-blur-sm
              "
            >
              {/* Question */}
              <div className="flex justify-between items-center gap-3">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                  {q.q}
                </h3>

                <ChevronDown
                  className={`
                    w-4 h-4 md:w-5 md:h-5 flex-shrink-0
                    transition-transform duration-300
                    ${expandedFAQ === i ? "rotate-180 text-primary" : ""}
                  `}
                />
              </div>

              {/* Answer */}
              <div
                className={`
                  grid transition-all duration-300 ease-in-out
                  ${
                    expandedFAQ === i
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm md:text-base text-foreground/70 leading-relaxed">
                    {q.a}
                  </p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
}
