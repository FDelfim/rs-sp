import { Flex, Spacer, Text } from '@chakra-ui/react';
import Layout from '../components/Layout';
import useAuth  from '../hooks/useAuth';
import { Avatar } from '@chakra-ui/react'
import Head from 'next/head';

export default function Profile(){

  const { user, signout } = useAuth();

  return(
    <>
      <Layout>

        <Flex mx={['4', '40']} mt={['4', '10']} align='center' gap='4'>
          <Avatar size='2xl' name={user?.name} src={user?.photoUrl} />
          <Text fontSize={['2xl', '4xl']} fontWeight='bold'>{user?.name}</Text>
        </Flex>
      </Layout>
    </>
  )
}