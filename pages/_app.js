import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react"
import Head from "next/head";

export default function App({Component, pageProps: { session, ...pageProps }}) 
{
  return (
    <SessionProvider session={session}>
      <Head>
        <title>TeknoKalkal-Admin</title>
        <meta name="description" content="My app description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}