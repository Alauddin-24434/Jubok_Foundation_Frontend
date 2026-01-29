"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  logout,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";
import { PublicNotificationBell } from "./notificationBell";

export default function Navbar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  const changeLang = (lang: "en" | "bn") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <nav className="fixed top-0 z-50 w-full h-16 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3">

          {/* MOBILE SIDEBAR TRIGGER */}
          <div className="md:hidden">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
          </div>

          {/* LOGO */}
          {/* <Link
            href="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {t("brand.name")}
          </Link> */}
        </div>

        {/* ================= DESKTOP NAV ================= */}
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

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center gap-2">

          <PublicNotificationBell />

          {/* THEME */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* LANGUAGE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLang("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLang("bn")}>
                বাংলা
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AUTH */}
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="outline">
                  {t("common.dashboard")}
                </Button>
              </Link>

              <Button
                onClick={() => dispatch(logout())}
                className="bg-primary text-primary-foreground"
              >
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <Link href="/login" >
              <Button variant="outline" className="hidden md:block lg:block">
                {t("common.login")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
