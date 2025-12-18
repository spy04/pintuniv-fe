import { useEffect, useState } from "react";
import clsx from "clsx";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import MobileNav from "@/components/layout/sidebar/MobileNav";
import RightContainer from "@/components/layout/rightcontainer/RightContainer";

type MainLayoutProps = {
  children: React.ReactNode;
  showRightContainer?: boolean;
};

export default function MainLayout({
  children,
  showRightContainer = true,
}: MainLayoutProps) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar DESKTOP */}
      <Sidebar open={open} setOpen={setOpen} isMobile={isMobile} />

      {/* Main Content */}
      <main
        className={clsx(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          !isMobile && (open ? "ml-64" : "ml-20"),
          isMobile && "pb-16", // ruang buat bottom nav
        )}
      >
        {children}
      </main>

      {/* Right container DESKTOP */}
      {!isMobile && showRightContainer && <RightContainer />}

      {/* Bottom Nav MOBILE */}
      {isMobile && <MobileNav />}
    </div>
  );
}
