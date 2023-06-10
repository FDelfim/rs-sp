import { useColorModeValue, Box, Flex, Card, Text, Grid, GridItem, Button} from '@chakra-ui/react';
import { QuestionIcon, CheckIcon, StarIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import { useRouter } from 'next/navigation';

export default function Home() {

  const { user, signin } = useAuth();
  const router = useRouter();
  const bgColor = useColorModeValue('#F7F7F7', '#1A202C');

  return (
    <Layout>
      <Box bgColor={bgColor}>
        <Flex justifyContent='center' alignItems='center'>
          <Flex flexDirection='column'>
            <Card className='p-5 d-flex flex-column justify-content-center mt-3' h='40vh'>
              <Text fontSize='3xl' textAlign='center'>Teste Gratuito de Resiliência no Esporte</Text>
            </Card>
            <Grid templateColumns={['repeat(1)', 'repeat(1)' ,'repeat(3, 1fr)']} templateRows={['','','repeat(1, 1fr)']} gap={'6'} mt='4' px={['5','10','20']} h='100%'>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='3' justifyContent='center' h='100%'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex><QuestionIcon fontSize='6xl' color='teal.300' /></Flex>
                    <Text fontSize='2xl' textAlign='center' mt='3'>O teste consiste em 15 perguntas</Text>
                  </Flex>
                </Card>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='3' justifyContent='center'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex justify='center'><CheckIcon fontSize='6xl' color='teal.300'/></Flex>
                    <Text fontSize='2xl' textAlign='center' mt='3'>Você deve responder as perguntas em uma escala de 1 a 5 na escala likert</Text>
                  </Flex>
                </Card>
              </GridItem>
              <GridItem rowSpan={1} colSpan={1}>
                <Card p='3' justifyContent='center'>
                  <Flex alignItems='center' flexDirection={['column', 'row']} gap='5'>
                    <Flex justify='center'><StarIcon fontSize='6xl' color='teal.300'/></Flex>
                    <Text fontSize='2xl' textAlign='center' mt='3'>Ao final, você terá resultados enquanto a sua resiliência no esporte</Text>
                  </Flex>
                </Card>
              </GridItem>
            </Grid>
            <Flex justify='center' my='8'>
              <Button onClick={() => {
                if (!user) {
                  signin()
                } else {
                  router.push('/questions')
                }
              }}
              colorScheme='teal'>Iniciar <ArrowForwardIcon /></Button>
            </Flex>
          </Flex >
        </Flex>
      </Box>
    </Layout>
  )
};
