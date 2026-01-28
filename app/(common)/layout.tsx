import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import React from "react";
export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 ">
        <div className="">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
