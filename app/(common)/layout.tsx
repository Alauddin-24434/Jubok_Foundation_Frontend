import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./coomnSiedbar";
import Navbar from "@/components/shared/Navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="md:hidden lg:hidden block ">
          <AppSidebar />
 
    </div>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />

        <main >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
