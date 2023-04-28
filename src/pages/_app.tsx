import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useState } from "react"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import NextNProgress from "nextjs-progressbar"

export default function App({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())
	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<NextNProgress color="#a445ed" height={4} />
				<Component {...pageProps} />
			</Hydrate>
		</QueryClientProvider>
	)
}
