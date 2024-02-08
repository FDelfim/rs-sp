import 'bootstrap/dist/css/bootstrap.min.css';
import theme from '../styles/theme';
import Head from 'next/head';
import { ChakraProvider, extendTheme, CSSReset } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';


const myTheme = extendTheme(theme)

const GlobalStyle = ({ children }) => (
  <>
    <Head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="RS-Sp - Resiliência Pisicológica no Esporte" />
    </Head>
    <CSSReset />
    <Global
      styles={css`
        html {
          scroll-behavior: smooth;
        }

        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}
    />
    {children}
  </>
);

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ChakraProvider theme={myTheme}>
      <SessionProvider session={session}>
        <GlobalStyle />
        <Component {...pageProps} />
        <Analytics />
      </SessionProvider>
    </ChakraProvider>
  )
}