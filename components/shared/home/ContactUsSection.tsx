"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function ContactUsSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    emailjs.sendForm(
      "service_xxxxxx",
      "template_xxxxxx",
      formRef.current,
      "your_public_key",
    ).then(
      () => {
        toast.success(t("contact.success"));
        formRef.current?.reset();
        setIsSending(false);
      },
      () => {
        toast.error(t("contact.error"));
        setIsSending(false);
      }
    );
  };

  return (
    <section
      id="contact"
      className="w-full border-t border-border/50
        py-16 sm:py-20 md:py-24"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            {t("contact.title")}
          </h2>
          <p className="text-sm sm:text-base text-foreground/60">
            {t("contact.desc")}
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-10 md:grid-cols-2 items-start">
          {/* Form */}
          <Card className="p-6 sm:p-8 bg-background/60 backdrop-blur
            border-border shadow-xl">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {t("contact.name")}
                </label>
                <Input
                  name="user_name"
                  placeholder={t("contact.name")}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {t("contact.emailLabel")}
                </label>
                <Input
                  name="user_email"
                  type="email"
                  placeholder={t("contact.emailLabel")}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {t("contact.message")}
                </label>
                <Textarea
                  name="message"
                  placeholder={t("contact.message")}
                  required
                  className="min-h-[110px] sm:min-h-[130px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSending}
                className="w-full h-11 sm:h-12 gap-2 text-sm sm:text-base font-semibold"
              >
                {isSending ? t("contact.sending") : t("contact.button")}
                <Send size={16} />
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-10 pt-8 border-t border-border
              grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <InfoItem
                icon={<MapPin size={18} />}
                label={t("contact.addressLabel")}
                value={t("contact.addressValue")}
              />
              <InfoItem
                icon={<Phone size={18} />}
                label={t("contact.phoneLabel")}
                value="+880 1234 567 890"
              />
              <InfoItem
                icon={<Mail size={18} />}
                label={t("contact.emailLabel")}
                value="info@alhamdulillah.com"
              />
            </div>
          </Card>

          {/* Map */}
          <div className="
            rounded-2xl overflow-hidden shadow-2xl border border-border
            h-[300px] sm:h-[400px] md:h-full md:min-h-[520px]
          ">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116833.95338883515!2d90.3372879857908!3d23.780620666016733"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Small Component ---------------- */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="h-9 w-9 rounded-lg bg-primary/10
        flex items-center justify-center text-primary mx-auto mb-2">
        {icon}
      </div>
      <p className="text-xs font-bold uppercase">{label}</p>
      <p className="text-[11px] text-foreground/60 mt-1">{value}</p>
    </div>
  );
}
