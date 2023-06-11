import { Flex, Text, Avatar } from '@chakra-ui/react';
import Layout from '../components/Layout';
import useAuth  from '../hooks/useAuth';

export default function Profile(){

  const { user } = useAuth();

  return(
    <>
      <Layout>
        <Flex mx={['4', '40']} mt={['4', '10']} align='center' flexDirection={['column', 'row']} gap='4' >
          <Avatar size='2xl' name={user?.name} src={user?.photoUrl} />
          <Text fontSize={['2xl', '4xl']} fontWeight='500'>{user?.name}</Text>
        </Flex>
      </Layout>
    </>
  )
}