import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import NavBar from './Nav';
import Head from 'next/head';

function Layout({ children }) {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  return (
    <>
      <Head>
        <title>Resiliência Psicológica no Esporte</title>
      </Head>
      <Box bgColor={bgColor} minH='100vh' m='0'>
        <NavBar />
        <Flex flexDirection='column' w='100%' h='100%' pt='62px'>
          {children}
        </Flex>
      </Box>
    </>
  );
}

export default Layout;