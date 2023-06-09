import Link from 'next/link';
import { Flex, Icon, useColorMode, useColorModeValue, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, Heading } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import useAuth from '../hooks/useAuth';
import withAuthModal from './Auth';
import { useRouter } from 'next/router';

export function Nav({ openAuthModal }) {

  const router = useRouter();

  const { user, signout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('#FFFFFF', '#1A202C');
  const color = useColorModeValue('#1A202C', '#EDEEEE');
  const borderColor = useColorModeValue('#DDD', '#27272A');

  return (
    <>
      <Flex bgColor={bgColor} color={color} borderBottom={`1px solid ${borderColor})`} w='full' position='fixed' zIndex={99999}>
        <Flex alignItems='center' justifyContent='space-between' w='full' maxW='1200px' margin='0 auto' h='60px' px={[4, 8]}>
          <Flex alignItems="center" justifyContent='space-between' gap={3}>
            <Heading size="md" mr={4} mt='2' display={['none', 'block']}>
              <Link href='/'>Resiliência no Esporte</Link>
            </Heading>
            <Link className={router.pathname == "/" ? 'nav-link active' : 'nav-link'} href='/'>Início <span className='sr-only'></span></Link>
            <Link className={router.pathname == "/questions" ? 'nav-link active' : 'nav-link'} href='questions'>Questionário</Link>
            <Link className={router.pathname == "/about" ? 'nav-link active' : 'nav-link'} href='about'>Sobre</Link>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            {user ? (
              <Menu>
                <MenuButton
                  as={Avatar}
                  mr={6}
                  name={user.name}
                  src={user.photoUrl}
                  size="sm"
                />
                <MenuList>
                  <MenuItem onClick={() => router.push('/profile')}>Perfil</MenuItem>
                  <MenuItem onClick={() => signout()}>Sair</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button mr={6} onClick={() => openAuthModal()}>
                Entrar
              </Button>
            )}
            {colorMode === 'light' ? (
              <MoonIcon w={6} h={6} onClick={toggleColorMode} />
            ) : (
              <SunIcon w={6} h={6} onClick={toggleColorMode} />
            )}
          </Flex>
        </Flex >
      </Flex >
    </>
  );
}

export default withAuthModal(Nav);