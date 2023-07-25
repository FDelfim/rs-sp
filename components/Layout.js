import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import NavBar from './nav';

function Layout({ children }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  return (
    <Box bgColor={bgColor} minH='100vh' m='0'>
      <NavBar />
      <Flex flexDirection='column' w='100%' h='100%' pt='62px'>
        {children}
      </Flex>
    </Box>
  );
}

export default Layout;