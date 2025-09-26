import { AuthProvider } from "@/contexts/AuthContext";
import { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import "../styles/global.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	const queryClient = new QueryClient();

	return getLayout(
		<>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<Component {...pageProps} />
					<Toaster position="top-right" />
				</QueryClientProvider>
			</AuthProvider>
		</>
	);
}
