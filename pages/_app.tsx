import NextNProgress from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import PageLoader from '@/components/tools/PageLoader';
import { FunctionProvider } from '@/context/FunctionContext';
import { AuthProvider } from '@/context/AuthContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="next-head-count" content="5" />
        <meta name='author' content="Moinak Majumdar" />
        <meta name='description' content='Custom Url shortener app, save and share your short url.' />
        <meta name='keywords' content='Next js, node js, firebase, mongodb, security, privacy, proxy' />
        <meta name="color-scheme" content="light" />
      </Head>
      <NextNProgress color="#6366f1" height={3} showOnShallow={true} />
      <PageLoader>
        <AuthProvider>
          <FunctionProvider>
            <Component {...pageProps} />
          </FunctionProvider>
        </AuthProvider>
      </PageLoader>
      <ToastContainer newestOnTop={true} autoClose={3000} pauseOnHover />
    </>
  )
}
