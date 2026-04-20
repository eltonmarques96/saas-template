import { AuthProvider } from "@/contexts/AuthContext";
import { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "../styles/global.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { messages, locale, ...restPageProps } = pageProps as {
    messages?: Record<string, unknown>;
    locale?: string;
    [key: string]: unknown;
  };

  return (
    <NextIntlClientProvider
      locale={locale ?? "pt"}
      messages={messages ?? {}}
      timeZone="America/Sao_Paulo"
    >
      <div className={`${playfair.variable} ${inter.variable}`}>
        {getLayout(
          <AuthProvider>
            <Component {...restPageProps} />
          </AuthProvider>
        )}
      </div>
    </NextIntlClientProvider>
  );
}
