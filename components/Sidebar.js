'use client'

import React from 'react'
import { IconButton, Box, CloseButton, Flex, Icon, useColorModeValue, Text, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import { FiFileText, FiTrendingUp, FiMenu, FiInfo, FiUserCheck } from 'react-icons/fi'

const LinkItems = [
  { name: 'Escala', icon: FiTrendingUp },
  { name: 'Relatórios', icon: FiFileText },
  { name: 'Termos de uso', icon: FiUserCheck},
  { name: 'Sobre', icon: FiInfo}
]

export default function Sidebar({ configPage, setConfigPage, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('#FFFFFF', '#1A202C');

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent configPage={configPage} setConfigPage={setConfigPage} onClose={() => onClose} bgColor={bgColor}  display={{ base: 'none', md: 'block' }} boxShadow={'md'} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
        <DrawerContent>
          <SidebarContent configPage={configPage} setConfigPage={setConfigPage} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Box>
  )
}

const SidebarContent = ({ configPage, setConfigPage, onClose, ...rest }) => {
  return (
    <Box bg={useColorModeValue('white', 'gray.900')} 
     w={{ base: 'full', md: 60 }} pos="fixed" h="full" {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl">Configurações</Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem configPage={configPage} onClick={() => {setConfigPage(link.name); onClose();}} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ configPage, icon, children, ...rest }) => {
  const isActive = configPage == children;
  return (
    <Box as="a" style={{ textDecoration: 'none' }}  _focus={{ boxShadow: 'none' }}>
      <Flex my='2' align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" color={isActive && 'white'} bgColor={isActive && 'teal.500'} _hover={{bg: 'teal.500', color: 'white'}}{...rest}>
        {icon && (
          <Icon mr="4" fontSize="16" _groupHover={{ color: 'white' }} as={icon}/>
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8">
        Configurações
      </Text>
    </Flex>
  )
}