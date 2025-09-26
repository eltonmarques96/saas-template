import React from "react";

import Header from "@/components/Dashboard/Header";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/Dashboard/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Navbar variant="inset" />
            <SidebarInset>
              <Header />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
                    <div>{children}</div>
                  </div>
                </div>
              </div>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
