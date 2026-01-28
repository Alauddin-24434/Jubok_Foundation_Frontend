"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Languages, Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function Navbar() {
  const user = useSelector(selectCurrentUser);
  console.log("user", user);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          {t("brand.name")}
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-primary transition">
            {t("common.home")}
          </Link>
          <Link href="/projects" className="hover:text-primary transition">
            {t("common.projects")}
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            {t("common.about")}
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            {t("common.contact")}
          </Link>
        </div>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  i18n.changeLanguage("en");
                  localStorage.setItem("lang", "en");
                }}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  i18n.changeLanguage("bn");
                  localStorage.setItem("lang", "bn");
                }}
              >
                বাংলা
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="cursor-pointer">
                  {t("common.dashboard")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground "
                >
                  {t("common.logout")}
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer">
                {t("common.login")}
              </Button>
            </Link>
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-6 space-y-4">
          <Link href="#home" onClick={() => setMobileOpen(false)}>
            {t("common.home")}
          </Link>
          <Link href="#projects" onClick={() => setMobileOpen(false)}>
            {t("common.projects")}
          </Link>
          <Link href="#about" onClick={() => setMobileOpen(false)}>
            {t("common.about")}
          </Link>
          <Link href="#contact" onClick={() => setMobileOpen(false)}>
            {t("common.contact")}
          </Link>

          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {theme === "dark"
                ? t("common.themeLight")
                : t("common.themeDark")}
            </Button>

            <button
              onClick={() => {
                const next = i18n.language === "en" ? "bn" : "en";
                i18n.changeLanguage(next);
                localStorage.setItem("lang", next);
              }}
              className="rounded-md border px-3 py-1 text-sm transition-colors hover:bg-accent"
            >
              {i18n.language === "en" ? "বাংলা" : "English"}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                {t("common.login")}
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button className="w-full">{t("common.register")}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
