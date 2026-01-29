"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link, Users } from "lucide-react";
import { useTranslation } from "react-i18next"

export default function AboutUsSection() {
    const { t } = useTranslation();
    return (
        <section
        id="about"
        className="container mx-auto py-12 px-4 md:px-8 md:py-24 border-t border-border/50"
      >
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
                <h4 className="font-bold text-sm md:text-base mb-1">
                  {t("about.membersCount")}
                </h4>
                <p className="text-xs text-foreground/60">
                  {t("about.membersDesc")}
                </p>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-2 md:mb-3">
                  <ArrowRight className="text-secondary rotate-[-45deg] w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">
                  {t("about.projectsCount")}
                </h4>
                <p className="text-xs text-foreground/60">
                  {t("about.projectsDesc")}
                </p>
              </div>
            </div>
            <Link href="/about" className="inline-block mt-2 md:mt-4">
              <Button
                variant="link"
                className="p-0 text-primary h-auto text-base md:text-lg gap-2"
              >
                {t("about.visionLink")}{" "}
                <ArrowRight size={16} className="md:w-[18px]" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
              <div className="text-9xl grayscale opacity-20">🌾🐟🏢</div>
            </div>
            <div className="absolute -bottom-6 -left-6 p-8 bg-background rounded-2xl shadow-2xl border border-border max-w-[200px]">
              <p className="text-3xl font-bold text-primary">
                {t("about.transparency")}
              </p>
              <p className="text-sm text-foreground/60">
                {t("about.transparencyDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}