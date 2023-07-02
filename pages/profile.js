import { Flex, Text, Avatar, Box, Divider, Alert, AlertIcon, Skeleton } from '@chakra-ui/react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import RadarChart from '../components/RadarChart';

export default function Profile() {

  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [lastQuestionnaire, setLastQuestionnaire] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const data2br = (date) => {
    const data = new Date(date);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
  }

  useEffect(() => {
    async function getAnswers() {
      try{
        const userRef = doc(db, 'users', `${user?.uid}`);
        const userSnap = await getDoc(userRef);
        const answersRef = collection(db, 'users', `${user?.uid}`, 'answers');
        const answersSnapshot = await getDocs(answersRef);
        const answersData = [];
        for (const doc of answersSnapshot.docs) {
          const answer = doc.data();
          answer.id = doc.id;
          answersData.push(answer);
        }
        setAnswers(answersData);
        const questionnaireId = answersData[0]?.questionnaire;
        const questionnaireRef = doc(db, 'questionnaires', `${questionnaireId}`);
        const questionnaireSnap = await getDoc(questionnaireRef);
        const questionnaireData = questionnaireSnap.data();
        setLastQuestionnaire(questionnaireData?.name);
      }catch(error){
        console.log(error);
      }
      setIsLoaded(true);
    }

    getAnswers();
  }, [user])

  return (
    <>
      <Layout>
        <Flex mx={['4', '40']} mt={['4', '10']} flexDirection={['column', 'row']}>
          <Flex>
            <Flex align='center' flexDirection={['row', 'column']} gap='4' p='3' minW={['', '20vw']} minH={['', '80vh']} me={['', '5']}>
              <Skeleton isLoaded={isLoaded}>
                <Avatar size='2xl' name={user?.name} src={user?.photoUrl} />
              </Skeleton>
              <Flex flexDirection='column' >
                <Skeleton isLoaded={isLoaded}>
                  <Text fontSize={['2xl', '4xl']} p='0' m='0' fontWeight='500' textAlign='center'>{user?.name}</Text>
                </Skeleton>
                <Skeleton isLoaded={isLoaded}>
                  <Text fontSize={['md', 'md']} fontWeight='500' textAlign='center'>Data de nascimento: 00/00/0000</Text>
                </Skeleton>
              </Flex>
            </Flex>
            <Divider orientation='vertical' />
          </Flex>
          <Flex flexDirection='column' p={['2', '4']} w='100%' h='100%'>
            {
              answers.length > 0 ?
                <Skeleton isLoaded={isLoaded} h='100%'>
                  <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Resumo da sua resiliência</strong></Text>
                  <Box w={['100%','50%']} display={['','grid']}>
                    <RadarChart />  
                  </Box>
                  <Box>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Último questionário respondido</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{lastQuestionnaire}</Text>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Data da útima resposta</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{data2br(Date(answers[0]?.created_at))}</Text>
                  </Box>
                </Skeleton>
                :
                <Skeleton isLoaded={isLoaded} h='100%'>
                  <Box flexDirection='row' justifyContent='center' alignContent='center' w='100%' my='5'>
                    <Alert variant='left-accent' height='125px' flexDirection='column' justifyContent='center' alignContent='center' gap='2'>
                      <AlertIcon boxSize='40px' />
                      <Text textAlign='center'>Você ainda não respondeu nenhum questionário</Text>
                    </Alert>
                  </Box>
                </Skeleton>
            }
          </Flex>
        </Flex>
      </Layout>
    </>
  )
}