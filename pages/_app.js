import 'bootstrap/dist/css/bootstrap.min.css';
import theme from '../styles/theme';
import Head from 'next/head';

import { ChakraProvider, extendTheme, CSSReset } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { AuthProvider } from '../contexts/AuthContext';

const myTheme = extendTheme(theme)

const GlobalStyle = ({ children }) => (
  <>
    <Head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
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

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={myTheme}>
      <AuthProvider>
        <GlobalStyle />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}