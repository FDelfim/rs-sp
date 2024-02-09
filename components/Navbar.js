import Link from 'next/link';
import { Flex, useColorMode, useColorModeValue, Button, Avatar, Divider,
  Menu, MenuButton, MenuList, MenuItem, Heading, useToast } from '@chakra-ui/react';
import { MoonIcon, SunIcon, CheckIcon, SettingsIcon } from '@chakra-ui/icons';
import withAuthModal from './Auth';
import { useRouter } from 'next/router';
import { signOut, signIn, useSession } from 'next-auth/react';

export function Nav({ openAuthModal }) {

  const router = useRouter();
  const {data: session} = useSession();

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('#FFFFFF', '#1A202C');
  const color = useColorModeValue('#1A202C', '#EDEEEE');
  const borderColor = useColorModeValue('#DDD', '#27272A');

  return (
    <>
      <Flex bgColor={bgColor} color={color} borderBottom={`1px solid ${borderColor})`} w='full' position='fixed' zIndex={99999} boxShadow={'md'}>
        <Flex alignItems='center' justifyContent='space-between' w='full' maxW='1200px' margin='0 auto' h='60px' px={[4, 8]}>
          <Flex alignItems="center" justifyContent='space-between' gap={3}>
            <Heading size="md" mr={4} mt='2' display={['none', 'none','block']}>
              <Link as='h1' href='/'>Resiliência no Esporte</Link>
            </Heading>
            <Link className={router.pathname == "/" ? 'nav-link active' : 'nav-link'} href='/'>Início <span className='sr-only'></span></Link>
            <Link className={router.pathname == "/questions" ? 'nav-link active' : 'nav-link'} href='questions'>Questionário</Link>
            <Link className={router.pathname == "/about" ? 'nav-link active' : 'nav-link'} href='about'>Sobre</Link>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            {session ? (
                <>
                  <Menu>
                    <MenuButton as={Avatar} mr={6} name={session.user.name} src={session.user.image} size="sm" cursor='pointer'/>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/profile')}>Perfil</MenuItem>
                      <MenuItem onClick={() => signOut()}>Sair</MenuItem>
                      
                      {
                        session.user.role == 'admin' &&
                        <>
                          <Divider orientation='horizontal' p='0' m='0'/>
                          <MenuItem textColor='teal.500' onClick={() => router.push('/settings')}><CheckIcon me='1'/>Área Super Usuário</MenuItem> 
                        </>
                      }
                      </MenuList>
                  </Menu>
                </>
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