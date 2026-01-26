"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              {t("brand.name")}
            </Link>
            <p className="text-foreground/60 leading-relaxed max-w-xs">
              {t("contact.desc")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-primary">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.agriculture")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.fishFarming")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.realEstate")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.allOpps")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-primary">
              {t("footer.support")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.faqs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  {t("footer.supportCenter")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-primary">
              {t("common.contact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={20} />
                <span className="text-foreground/60">{t("contact.addressValue")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <span className="text-foreground/60">+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <span className="text-foreground/60">support@alhamdulillah.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            {t("brand.copyright")}
          </p>
          <div className="flex gap-6 text-sm text-foreground/50">
            <Link href="/privacy" className="hover:text-primary">{t("common.privacyPolicy")}</Link>
            <Link href="/terms" className="hover:text-primary">{t("common.termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
