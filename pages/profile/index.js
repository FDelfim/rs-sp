import {
  Flex, Text, Avatar, Box, Divider, Alert, AlertIcon, Skeleton, useToast, Accordion, Slide, Button,
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Grid, GridItem, useDisclosure, Link
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { BsWhatsapp, BsTwitter, BsFacebook, BsTelegram, BsLinkedin, BsShare } from 'react-icons/bs';
import { translate, reverseTranslate, colorScale } from '../../utils/translates';
import Layout from '../../components/Layout';
import RadarChart from '../../components/RadarChart';
import useAuth from '../../hooks/useAuth';
import CryptoJS from 'crypto-js';

import { getAmateurSampleData, getQuestionnaireData, getScaleData, getUserAnswersData, getUserData, updateAmateurSampleData, updateUserData } from './_controllers/ProfileController';
import amateurRating from '../../utils/amateurRating';

const secretKey = process.env.NEXT_PUBLIC_CRYPT_KEY;

const rankProfessionalUser = async (dimensionSums, scale) => {
  let userRankings = {};
    userRankings = {};
    for (const dimension in dimensionSums) {
      const value = dimensionSums[dimension];
      const dimensionScale = scale[dimension];
      if (value >= parseFloat(dimensionScale.extremelyHigh)) {
        userRankings[dimension] = 'Extremamente Alto';
      } else if (value <= parseFloat(dimensionScale.high) && value > parseFloat(dimensionScale.moderate)) {
        userRankings[dimension] = 'Alto';
      } else if (value <= parseFloat(dimensionScale.moderate) && value > parseFloat(dimensionScale.low)) {
        userRankings[dimension] = 'Moderado';
      } else if (value <= parseFloat(dimensionScale.low) && value > parseFloat(dimensionScale.extremelyLow)) {
        userRankings[dimension] = 'Baixo';
      } else if (value <= parseFloat(dimensionScale.extremelyLow)) {
        userRankings[dimension] = 'Extremamente Baixo';
      } else {
        userRankings[dimension] = 'Não classificado';
      }
    }
    const sortedKeys = Object.keys(userRankings).sort();
    const sortedUserRankings = {};
    for (const key of sortedKeys) {
      sortedUserRankings[key] = userRankings[key];
    }
    return sortedUserRankings;
}

const getDimensionSums = (dimensions, answers, questionnaire) => {
  const dimensionSums = {};
  const dimensionCounts = {};

  dimensions.map((dimension) => {
    dimensionSums[dimension] = 0;	
    const dimensionTranslate = translate[dimension];
    dimensionCounts[dimension] = questionnaire.filter(q => q.dimension === dimensionTranslate).length;
  });

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
  return dimensionSums;
};


export default function Profile() {

  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: info, onToggle: onInfo } = useDisclosure();

  const [answers, setAnswers] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [series, setSeries] = useState(null);
  const [userRank, setUserRank] = useState({})

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Resiliência Psicológica no Esporte',
        text: 'Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!',
        url: 'https://rs-sp.vercel.app/',
      })
        .catch((error) => toast({
          title: 'Erro ao compartilhar!',
          description: 'Tente novamente mais tarde',
          status: 'error',
          duration: 5000,
          isClosable: true
        }));
    }
  }

  const getData = async () => {

    try{
      const userInfoData = await getUserData(user.uid);
  
      if (userInfoData) {
        const userAnswersData = await getUserAnswersData(user.uid);
        setAnswers(userAnswersData);
        if (userInfoData.isAthlete && userAnswersData) {
          const querionnaireData = await getQuestionnaireData(userAnswersData.questionnaire);
          if (userInfoData.athleteLevel === 'Profissional') {
            const scaleData = await getScaleData('professionalScale')
            const dimensionSumsData = getDimensionSums(Object.keys(scaleData), userAnswersData, querionnaireData);
            const userRankData = await rankProfessionalUser(dimensionSumsData, scaleData)   
            setUserRank(userRankData)   
            setSeries(dimensionSumsData)
          }else if(userInfoData.athleteLevel == 'Amador'){
            const sampleData = await getAmateurSampleData();
            const dimensionSumsData = getDimensionSums(Object.keys(sampleData), userAnswersData, querionnaireData);
            const [ userRankData, newSampleData ] = await amateurRating(dimensionSumsData, sampleData, userInfoData.isClassified ?? false);
            setUserRank(userRankData)
            setSeries(dimensionSumsData)
            if(!user.isClassified){
              const updatedUserData = { ...userInfoData, isClassified: true };
              await updateUserData(updatedUserData);
              await updateAmateurSampleData(newSampleData);
            }
          }
        }else if(userAnswersData){
          const questionnaireData = await getQuestionnaireData(userAnswersData.questionnaire);
          const dimensions = [...new Set(questionnaireData.map(item => reverseTranslate[item.dimension]))];
          const dimensionSumsData = getDimensionSums(dimensions, userAnswersData, questionnaireData);
          const rank = {};
          Object.keys(dimensionSumsData).forEach((key) => {
            rank[key] = dimensionSumsData[key];
          })
          setUserRank(rank)
          setSeries(dimensionSumsData)
        }
      }
      setUserInfo(userInfoData)
      setIsLoaded(true)
    }catch(error){
      toast({
        title: error.message,
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 5000,
        isClosable: true
      
      })
    }
  };

  useEffect(() => {
    if (user && !isLoaded) {
      getData();
    }
  }, [user?.uid]);

  return (
    <>
      <Layout>
        <Flex mx={['4', '25', '30']} mt={['4', '4', '10']} flexDirection={['column', 'column', 'row']}>
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
                          { userInfo ?
                          <Box>
                            <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Data de Nascimento:</strong> {new Date(userInfo?.birthDate?.seconds * 1000).toLocaleDateString()}</Text>
                            <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Naturalidade:</strong> {userInfo?.birthCity}</Text>
                            <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>E-mail:</strong> {userInfo?.email}</Text>
                            <Flex gap='10px' justifyContent='center' p='2'>
                              <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.isAthlete ? 'teal' : 'yellow'}>{userInfo?.isAthlete ? 'Atleta' : 'Não atleta'}</Badge> </Text>
                              <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.practicesSport ? 'teal' : 'yellow'}>{userInfo?.practicesSport ? 'Pratica esporte' : 'Não pratica esporte'}</Badge> </Text>
                              <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.athleteLevel === 'Profissional' ? 'teal' : 'yellow'}>{userInfo?.athleteLevel}</Badge></Text>
                            </Flex>
                          </Box>
                          :
                          <Text fontSize={['sm', 'md']} m='0' textAlign='center' fontWeight='500'>Não há dados cadastrados</Text>
                          }
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
                          {
                            userRank && userInfo.isAthlete &&
                            <Flex>
                              {Object.entries(userRank).map(([key, value]) => (
                                key === 'total' &&
                                <Box key={key}>
                                  <Badge colorScheme={colorScale[value]}>Nível de resiliência {translate[key]}: {value}</Badge>
                                </Box>
                              ))}
                            </Flex>
                          }
                          <Button colorScheme='teal' onClick={() => {
                            const seriesString = JSON.stringify(series);
                            let text = `name=${user?.name}&serie=${seriesString}`;
                            if (userRank) {
                              text += `&rank=${JSON.stringify(userRank)}`
                            }
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
                              <Text><strong>EE</strong> - Experiência Esportivas | <strong>ASF</strong> - Apoio Social Familiar | <strong>RPC</strong> - Recursos Pessoais e Competências | <strong>ESPI</strong> - Espiritualidade | <strong>ASE</strong> - Apoio Social Esportivo</Text>
                            </Box>
                          </Slide>
                        </GridItem>
                      </Grid>
                    }
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