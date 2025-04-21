import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import type { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  title: "SAAS Template",
  description: "AdminLTE UI in Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* Optional: Additional meta or favicon */}</head>
      <body className="hold-transition sidebar-mini layout-fixed">
        <p></p>
        <div className="wrapper">{children}</div>
        <Script src="/jquery.js" strategy="beforeInteractive" />
        <Script src="/bootstrap.bundle.js" strategy="beforeInteractive" />
        <Script src="/adminlte.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
