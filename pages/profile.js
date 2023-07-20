import { Flex, Text, Avatar, Box, Divider, Alert, AlertIcon, Skeleton, useToast } from '@chakra-ui/react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import RadarChart from '../components/RadarChart';
import { getUser, getUserAnswers } from '../services/userServices';

export default function Profile() {

  const { user } = useAuth();
  const toast = useToast();
  const [answers, setAnswers] = useState([]);
  const [lastQuestionnaire, setLastQuestionnaire] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [series, setSeries] = useState(null);
  const es = ['question_7', 'question_10' , 'question_13'];
  const asf = ['question_4', 'question_6', 'question_15'];
  const rpc = ['question_1', 'question_9', 'question_11'];
  const e = ['question_2', 'question_5', 'question_12'];
  const ase = ['question_3', 'question_8', 'question_14'];

  const getSeries = async (answers) => {
    if(answers.length == 0) return;
    const fields = [es, asf, rpc, e, ase];
    const med = [0, 0, 0, 0, 0];
    fields.forEach((value, index) => {
      value.forEach((question) => {
        med[index] += parseInt(answers[0][question])
      }
      );
    });
    return med;
  };

  async function getAnswers() {
    try{
      const userData = await getUser(user?.uid);
      setUserInfo(userData);
      const answersRef = collection(db, 'users', `${user?.uid}`, 'answers');
      const answersSnapshot = await getDocs(answersRef);
      const answersData = [];
      for (const doc of answersSnapshot.docs) {
        const answer = doc.data();
        answersData.push(answer);
      }
      setAnswers(answersData);
      return answersData;
    }catch(error){
      toast({
        title: 'Erro ao bucar dados!',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  async function getQuestionnaires(){
    try{
      const answersRef = collection(db, 'users', `${user?.uid}`, 'answers');
      const answersSnapshot = await getDocs(answersRef);
      const answersData = [];
      for (const doc of answersSnapshot.docs) {
        const answer = doc.data();
        answersData.push(answer);
      }
      setAnswers(answersData);
      const questionnaireId = answersData[0]?.questionnaire;
      const questionnaireRef = doc(db, 'questionnaires', `${questionnaireId}`);
      const questionnaireSnap = await getDoc(questionnaireRef);
      const questionnaireData = questionnaireSnap.data();
      setLastQuestionnaire(questionnaireData);
      return questionnaireId;
    }catch(error){
      toast({
        title: 'Erro ao bucar dados!',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    user?.uid &&
    getQuestionnaires().then(() => {
      getAnswers().then((answers) => {
        getSeries(answers).then((userRs) => {
          setSeries(userRs);
          setIsLoaded(true);
        })
      })
    });

  }, [user?.uid])

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
                  <Text fontSize={['md', 'md']} fontWeight='500' textAlign='center'>Data de nascimento { userInfo?.birthDate.toDate().toLocaleDateString('pt-BR') }</Text>
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
                    {series && isLoaded ? <RadarChart series={series} /> : <></> }
                  </Box>
                  <Box>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Último questionário respondido</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{lastQuestionnaire?.name}</Text>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Data da útima resposta</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{
                      answers[0]?.created_at.toDate().toLocaleDateString('pt-BR')
                    }</Text>
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