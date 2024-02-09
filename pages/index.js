import { useColorModeValue, Box, Flex, Card, Text, Grid, GridItem, Button} from '@chakra-ui/react';
import { QuestionIcon, CheckIcon, StarIcon, ArrowForwardIcon, ChatIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout';
import { useRouter } from 'next/navigation';
import  Footer from '../components/Footer';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {

  const router = useRouter();
  const {data: session } = useSession();
  const bgColor = useColorModeValue('#F7F7F7', '#1A202C');

  return (
    <>
    <Layout>
      <Box bgColor={bgColor}>
        <Flex justifyContent='center' alignItems='center'>
          <Flex flexDirection='column'>
            <Card className='p-5 d-flex flex-column justify-content-center mt-3' h='40vh'>
              <Text fontSize='3xl' as='h1' textAlign='center'>Escala de Resiliência no Esporte - RS-Sp</Text>
            </Card>
            <Grid templateColumns={['repeat(1)', 'repeat(1)' ,'repeat(4, 1fr)']} templateRows={['','','repeat(1, 1fr)']} gap={'6'} mt='4' px={['5','10','20']} h='100%'>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='5' justifyContent='center' h='100%'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex><QuestionIcon fontSize='5xl' color='teal.300' /></Flex>
                    <Text as='h2' fontSize='xl' textAlign='center' mt='3'>O teste consiste em 15 perguntas.</Text>
                  </Flex>
                </Card>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='5' justifyContent='center' h='100%'>
                  <Flex as='h2'  alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex justify='center'><CheckIcon fontSize='5xl' color='teal.300'/></Flex>
                    <Text fontSize='xl' textAlign='center' mt='3'>Você deve responder as perguntas em uma escala de 1 a 5 pontos.</Text>
                  </Flex>
                </Card>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='5' justifyContent='center' h='100%'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex justify='center'><ChatIcon fontSize='5xl' color='teal.300'/></Flex>
                    <Text as='h2'  fontSize='xl' textAlign='center' mt='3'>Você deve responder as perguntas considerando como se sente atualmente.</Text>
                  </Flex>
                </Card>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='5' justifyContent='center' h='100%'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex justify='center'><StarIcon fontSize='5xl' color='teal.300'/></Flex>
                    <Text fontSize='xl' as='h2' textAlign='center' mt='3'>Ao final, você terá resultados do seu nível de resiliência no esporte.</Text>
                  </Flex>
                </Card>
              </GridItem>
            </Grid>
            <Flex justify='center' my='8'>
              <Button onClick={() => {
                  if(!session?.user){
                    signIn('google', { callbackUrl: '/questions' })
                  }else{
                    router.push('/questions')
                  }
              }}
              colorScheme='teal'>Iniciar <ArrowForwardIcon /></Button>
            </Flex>
          </Flex >
        </Flex>
      </Box>
    </Layout>
      <Footer/>
    </>
  )
};
