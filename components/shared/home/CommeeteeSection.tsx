"use client";

import { useGetManagementsQuery } from "@/redux/features/management/managementApi";
import Image from "next/image";

import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

// ===================== Skeleton =====================
const CommitteeCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-xl bg-muted" />
      <div className="p-6 text-center -mt-12 relative z-10 space-y-2">
        <div className="h-5 w-32 mx-auto bg-muted rounded" />
        <div className="h-4 w-24 mx-auto bg-muted rounded" />
        <div className="h-3 w-36 mx-auto bg-muted rounded" />
      </div>
    </div>
  );
};

// ===================== Component =====================
export default function CommeeteeSection() {
  const { t } = useTranslation();

  const { data: committeeMembers, isLoading } = useGetManagementsQuery({
    page: 1,
    limit: 4,
  });

  // ===================== Tenure Formatter =====================
  const formatTenure = (member: any) => {
    if (!member?.startAt) return "";

    const start = format(new Date(member.startAt), "MMM d, yyyy");

    if (member.isActive) {
      return `${start} → Present`;
    }

    if (member.endAt) {
      const end = format(new Date(member.endAt), "MMM d, yyyy");
      return `${start} → ${end}`;
    }

    return start;
  };

  return (
    <section id="team" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
            {t("team.title")}
          </h2>
          <p className="text-sm md:text-base text-foreground/60 italic">
            {t("team.desc")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-border bg-background/50 backdrop-blur-sm"
                >
                  <CommitteeCardSkeleton />
                </Card>
              ))
            : committeeMembers?.data?.map((member: any, index: number) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-muted">
                    {member?.userId?.avatar ? (
                      <Image
                        src={member.userId.avatar}
                        alt={member?.userId?.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                        <Users size={64} className="text-foreground/10" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center -mt-12 relative z-10">
                    <h3 className="font-bold text-xl mb-1">
                      {member?.userId?.name}
                    </h3>

                    <p className="text-primary text-sm font-medium uppercase tracking-tighter">
                      {t(member?.position)}
                    </p>

                    {/* Tenure */}
                    <p
                      className={`text-[11px] font-semibold mt-1 ${
                        member.isActive
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTenure(member)}
                    </p>
                  </div>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
