import {
  Flex, Text, Avatar, Box, Divider, Alert, AlertIcon, Skeleton, useToast, Accordion, Slide, Button,
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Grid, GridItem, useDisclosure, Link
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import RadarChart from '../components/RadarChart';
import useAuth from '../hooks/useAuth';
import { InfoIcon } from '@chakra-ui/icons';
import { BsWhatsapp, BsTwitter, BsFacebook, BsTelegram, BsLinkedin, BsShare } from 'react-icons/bs';
import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_CRYPT_KEY;

const translate = {
  'spirituality': 'Espiritualidade',
  'personalResources': 'Recursos Pessoais e Competências',
  'familySocialSupport': 'Apoio Social Familiar',
  'sportSocialSupport': 'Apoio Social Esportivo',
  'sportExperiences': 'Experiências Esportivas',
}

const reverseTranslate = {
  'Espiritualidade': 'spirituality',
  'Recursos Pessoais e Competências': 'personalResources',
  'Apoio Social Familiar': 'familySocialSupport',
  'Apoio Social Esportivo': 'sportSocialSupport',
  'Experiências Esportivas': 'sportExperiences',
}

export default function Profile() {

  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: info, onToggle: onInfo } = useDisclosure();

  const [answers, setAnswers] = useState(null);
  const [lastQuestionnaire, setLastQuestionnaire] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [scale, setScale] = useState(null);
  const [series, setSeries] = useState(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Resiliência Psicológica no Esporte',
        text: 'Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!',
        url: 'https://rs-sp.vercel.app/',
      })
        .catch((error) => console.log('Error sharing', error));
    }
  }
  const showToastError = () => {
    toast({
      title: 'Erro ao buscar dados!',
      description: 'Tente novamente mais tarde',
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };
  
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (response.status !== 200) {
      showToastError();
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return response.json();
  };
  
  const getSeries = (scale, answers, questionnaire) => {
    const dimensionSums = {}; 
    const dimensionCounts = {}; 

    for (const dimension in scale) {
      dimensionSums[dimension] = 0;
      const dimensionTranslate = translate[dimension];
      dimensionCounts[dimension] = questionnaire.filter(q => q.dimension === dimensionTranslate).length;
    }

    questionnaire.forEach((question) => {
      const dimension = reverseTranslate[question.dimension];
      const questionIndex = questionnaire.indexOf(question);
      const answerKey = `question_${questionIndex + 1}`;

      if (answers[answerKey]) {
        const answerValue = parseInt(answers[answerKey]);
        dimensionSums[dimension] += answerValue;
      }
    });

    dimensionSums['total'] = Object.values(dimensionSums).reduce((a, b) => a + b) / (Object.values(dimensionSums).length - 1);
    setSeries(dimensionSums);
    return dimensionSums;
  };


  const fetchScale = async (level) => {
    try {
      const data = await fetchJson(`/api/settings/scale?id=${level}`);
      setScale(data.scale);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchQuestionnaire = async (questionnaireId) => {
    try {
      const data = await fetchJson(`/api/questionnaires/get-questionnaire?id=${questionnaireId}`);
      setLastQuestionnaire(data.questionnaire);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchUserAnswers = async () => {
    try {
      const data = await fetchJson(`/api/user/get-user-answers?id=${user?.uid}`);
      setAnswers(data.answers);
      const questionnaire = await fetchQuestionnaire(data.answers.questionnaire);
      return {questionnaire: questionnaire, answers: data};
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const data = await fetchJson(`/api/user-data?id=${user.uid}`);
      setUserInfo(data.user);
      const scaleId = data.user.atheleteLevel === 'Profissional' ? 'professionalScale' : 'amateurScale';
      const scale = await fetchScale(scaleId);
      return scale;
    } catch (error) {
      console.error(error);
    }
  };
  
  const getData = async () => {
    const scaleFetch = await fetchUserData();
    const questionnaireFetch = await fetchUserAnswers();
    getSeries(scaleFetch, questionnaireFetch.answers.answers, questionnaireFetch.questionnaire.answers)
  };
  
  useEffect(() => {
    if (user && !isLoaded) {
      getData();
    }
  }, [user?.uid]);
  
  return (
    <>
      <Layout>
        <Flex mx={['4', '4', '40']} mt={['4', '4', '10']} flexDirection={['column', 'column', 'row']}>
          <Flex justifyContent='center'>
            <Box align='center' flexDirection={['column', 'column']} gap='4' p='3' w={['90%', '90%', '25vw']} minH={['', '', '80vh']} me={['', '', '5']}>
              <Skeleton isLoaded={isLoaded}>
                <Avatar size='2xl' name={user?.name} src={user?.photoUrl} />
              </Skeleton>
              <Flex flexDirection='column' w='100%' >
                <Skeleton isLoaded={isLoaded}>
                  <Text fontSize={['2xl', '4xl']} p='0' m='0' fontWeight='500' textAlign='center'>{user?.name}</Text>
                </Skeleton>
                <Skeleton isLoaded={isLoaded}>
                  <Box>
                    <Accordion w='100%' my='2' allowMultiple>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'><strong>Dados pessoais</strong></Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb='2'>
                          {/* <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Data de nascimento:</strong> { userInfo?.birthDate.toDate().toLocaleDateString('pt-BR') }</Text> */}
                          <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Naturalidade:</strong> {userInfo?.birthCity}</Text>
                          <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>E-mail:</strong> {userInfo?.email}</Text>
                          <Flex gap='10px' justifyContent='center' p='2'>
                            <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.isAthlete ? 'teal' : 'yellow'}>{userInfo?.isAthlete ? 'Atleta' : 'Não atleta'}</Badge> </Text>
                            <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.practicesSport ? 'teal' : 'yellow'}>{userInfo?.practicesSport ? 'Pratica esporte' : 'Não pratica esporte'}</Badge> </Text>
                            <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.atheleteLevel === 'Profissional' ? 'teal' : 'yellow'}>{userInfo?.atheleteLevel}</Badge></Text>
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Skeleton>
              </Flex>
            </Box>
            <Divider orientation='vertical' />
          </Flex>
          <Flex flexDirection='column' p={['2', '4']} w='100%' h='100%'>
            {
              answers ?
                <Skeleton isLoaded={isLoaded} h='100%'>
                  <Box>
                    {series && isLoaded &&
                      <Grid templateColumns={['repeat(1)', 'repeat(1)', 'repeat(3, 1fr)']}>
                        <GridItem colSpan={[3, 2]}>
                          <Flex gap='1' justifyContent={['center', 'start']}>
                            <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' m='0'><strong>Resumo da sua resiliência </strong></Text><InfoIcon cursor='pointer' onClick={onInfo} color='teal.500' />
                          </Flex>
                          <RadarChart series={series} />
                        </GridItem>
                        <GridItem colSpan={[3, 1]} display='flex' flexDirection='column' justifyContent='end' alignItems='center' mb={['0', '10']}>
                          <Button colorScheme='teal' onClick={() => {
                            const seriesString = series.join('-');
                            const userName = userInfo.name;
                            const text = `userName=${userName}&series=${seriesString}`;
                            const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
                            window.location.href = `/result?${ciphertext}`;
                          }} mb='3' href='/result'>Ver resiliência detalhada</Button>
                          <Box display='flex' flexDirection={['row', 'column']} justifyContent='center' m='0'>
                            <Text fontSize={['md', 'xl']} fontWeight='bold' textAlign='center'>Compartilhar resultado</Text>
                            <Box display='flex'>
                              <Button variant='ghost' colorScheme='green' p='0' fontSize='3xl'><Link href='whatsapp://send?text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsWhatsapp /></Link></Button>
                              <Button variant='ghost' colorScheme='cyan' p='0' fontSize='3xl'><Link href='https://telegram.me/share/url?url=https://rs-sp.vercel.app/&text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!'><BsTelegram /></Link></Button>
                              <Button variant='ghost' colorScheme='twitter' p='0' fontSize='3xl'><Link href='https://twitter.com/intent/tweet?url=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsTwitter /></Link></Button>
                              <Button variant='ghost' colorScheme='messenger' p='0' fontSize='3xl'><Link href='https://www.facebook.com/sharer/sharer.php?u=https://rs-sp.vercel.app/'><BsFacebook /></Link></Button>
                              <Button onClick={handleShare} variant='ghost' colorScheme='white' p='0' fontSize='3xl'><BsShare /></Button>
                            </Box>
                          </Box>
                          <Slide direction='bottom' in={info} style={{ zIndex: 10 }}>
                            <Box p='4' color='white' mt='4' bg='teal' shadow='md' textAlign='center'>
                              <Text><strong>ES</strong> - Experiência Esportivas | <strong>ASF</strong> - Apoio Social Familiar | <strong>RPC</strong> - Recursos Pessoais e Competências | <strong>ESPI</strong> - Espiritualidade | <strong>ASE</strong> - Apoio Social Esportivo</Text>
                            </Box>
                          </Slide>
                        </GridItem>
                      </Grid>
                    }
                  </Box>
                  <Box>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Último questionário respondido</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{lastQuestionnaire?.name}</Text>
                    <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' textAlign={['center', 'start']} m='0'><strong>Data da útima resposta</strong></Text>
                    <Text textAlign={['center', 'start']} fontSize={['md', 'xl']}>{
                      // answers[0]?.created_at.toDate().toLocaleDateString('pt-BR')
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
        {

        }
      </Layout>
    </>
  )
}