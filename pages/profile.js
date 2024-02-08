import CryptoJS from 'crypto-js';
import {
  Flex, Text, Avatar, Box, Divider, Alert, AlertIcon, Skeleton, useToast, Accordion, Slide, Button,
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Grid, GridItem, useDisclosure, Link
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, InfoIcon, MinusIcon } from '@chakra-ui/icons';
import { BsWhatsapp, BsTwitter, BsFacebook, BsTelegram, BsShare } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { translate, colorScale } from '../utils/translates';
import { userRating, differenceAnswers, updateAmateurSample } from '../Controllers/ProfileController';
import { abbreviation } from '../utils/translates';
import Layout from '../components/Layout';
import RadarChart from '../components/RadarChart';
import Footer from '../components/Footer';
import EditUserModal from '../components/_modals/editUserModal';

const secretKey = process.env.NEXT_PUBLIC_CRYPT_KEY;

export default function Profile() {

  const { data: session, update } = useSession();
  const toast = useToast();
  const { isOpen: info, onToggle: onInfo } = useDisclosure();
  const { isOpen: editUser, onClose: onCloseEditUser, onOpen: onOpenEditUser } = useDisclosure();

  const [answers, setAnswers] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [series, setSeries] = useState(null);
  const [userRank, setUserRank] = useState({})
  const [questionnaireName, setQuestionnaireName] = useState(null);
  const [difference, setDifference] = useState(null);

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

  useEffect(() => {

    async function rateUser() {
      const { userRank, sums, answers, questionnaire, questionnaireName, newSample } = await userRating(session.user);
      if(newSample) updateAmateurSample(newSample, update, session.user)
      const userInfo = session.user;
      setUserInfo(userInfo);
      setAnswers(answers);
      setSeries(sums);
      setUserRank(userRank);
      setQuestionnaireName(questionnaireName);
      if (answers.length > 1 && sums) {
        const difference = differenceAnswers(answers, Object.keys(sums[0]), questionnaire);
        setDifference(difference[0]);
      }
      setIsLoaded(true)
    }

    if (session?.user.lastAnswer) {
      rateUser();
    } else if (session?.user.userId) {
      setIsLoaded(true)
    }
  }, [session?.user]);

  return (
    <>
      <Layout>
        <Flex mx={['3', '25', '30']} mt={['4', '4', '10']} flexDirection={['column', 'column', 'column', 'row' ,'row']}>
          <Flex justifyContent='center'>
            <Box align='center' flexDirection={['column', 'column']} gap='4' p='3' w={['90%', '90%', '80%', '100%','25vw']} minH={['', '','','', '80vh']} me={['', '', '5']}>
              <Skeleton isLoaded={isLoaded}>
                <Avatar mb='2' size='2xl' name={session?.user.name} src={session?.user.image} />
              </Skeleton>
              <Flex flexDirection='column' w='100%' >
                <Skeleton isLoaded={isLoaded}>
                  <Text fontSize={['2xl', '4xl']} p='0' m='0' fontWeight='500' textAlign='center'>{session?.user.name}</Text>
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
                          {userInfo ?
                            <Box>
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Data de Nascimento:</strong> {new Date(userInfo?.birthDate?.seconds * 1000).toLocaleDateString()}</Text>
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Naturalidade:</strong> {userInfo.birthCity}</Text>
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>E-mail:</strong> {userInfo.email}</Text>
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Cidade atual:</strong> {userInfo.currentCity}</Text>
                              <Divider />
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Última resposta:</strong> {new Date(userInfo?.lastAnswer?.seconds * 1000).toLocaleDateString('br')}</Text>
                              <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Próxima repostas:</strong> {new Date(userInfo?.lastAnswer.seconds * 1000 + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
                              <Box>
                                {
                                  userInfo?.isAthlete &&
                                  <>
                                    <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Nível competitvo: </strong><Badge colorScheme={'teal'}>{userInfo?.competitiveLevel }</Badge> </Text>
                                    <Text fontSize={['sm', 'md']} m='0' textAlign='start' fontWeight='500'><strong>Nível de atleta: </strong><Badge colorScheme={userInfo?.athleteLevel === 'Profissional' ? 'teal' : 'yellow'}>{userInfo?.athleteLevel}</Badge></Text>
                                  </>
                                }
                                {
                                  !userInfo?.isAthlete &&
                                  <>
                                    <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={userInfo?.practicesSport ? 'teal' : 'yellow'}>{userInfo?.practicesSport ? 'Pratica esporte' : 'Não pratica esporte'}</Badge> </Text>
                                    <Text fontSize={['sm', 'md']} m='0' fontWeight='500'><Badge colorScheme={'yellow'}>Não atleta</Badge> </Text>
                                  </>
                                }
                              </Box>
                              <Button colorScheme='teal' size='sm' w='100%' onClick={() => { onOpenEditUser() }}>Editar dados</Button>
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
                      <Grid templateColumns={['repeat(1)', 'repeat(1)', 'repeat(1)',  'repeat(1)', 'repeat(4, 2fr)']}>
                        <GridItem colSpan={[3, 3]}>
                          <Flex gap='1' justifyContent={['center', 'start']}>
                            <Text fontSize={['xl', '2xl']} textAlign='center' fontWeight='500' mt='4' m='0'><strong>Resultado Geral da Resiliência Psicológica no Esporte</strong></Text><InfoIcon cursor='pointer' onClick={onInfo} color='teal.500' />
                          </Flex>
                          <RadarChart series={series} />
                        </GridItem>
                        <GridItem colSpan={[3, 3, 3, 3 ,1]} display='flex' flexDirection='column' justifyContent='center' alignItems='center' mb={['0', '5']}>
                          {
                            userRank && userInfo.isAthlete &&
                            <Flex>
                              {Object.entries(userRank).map(([key, value]) => (
                                key === 'total' &&
                                <Box key={key} py='4'>
                                  <Badge colorScheme={colorScale[value]}>Nível de resiliência {translate[key]}: {value}</Badge>
                                </Box>
                              ))}
                            </Flex>
                          }
                          <Button colorScheme='teal' onClick={() => {
                            if (series[1]) {
                              const seriesString = JSON.stringify(series[1]);
                              let text = `name=${session?.user.name}&serie=${seriesString}`;
                              if (userRank) {
                                text += `&rank=${JSON.stringify(userRank)}`
                              }
                              const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
                              window.location.href = `/result?${ciphertext}`;
                            } else {
                              const seriesString = JSON.stringify(series[0]);
                              let text = `name=${session?.user.name}&serie=${seriesString}`;
                              if (userRank) {
                                text += `&rank=${JSON.stringify(userRank)}`
                              }
                              const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
                              window.location.href = `/result?${ciphertext}`;
                            }
                          }} mb='3' href='/result'>Ver resiliência detalhada</Button>
                          <Box display='flex' flexDirection={['row', 'row', 'column']} justifyContent='center' m='0'>
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
                  {
                    answers.length > 1 &&
                    <>
                      <Divider />
                      <Box>
                        <Flex gap='1' justifyContent={['center', 'start']}>
                          <Text fontSize={['xl', '2xl']} fontWeight='500' mt='4' m='0'><strong>Comparação de resultados </strong></Text>
                        </Flex>
                        <Text fontSize={['md', 'lg']} fontWeight='500' mt='4' m='0'><strong>Questionário:</strong> {questionnaireName}</Text>
                        <Text fontSize={['sm', 'md']} textAlign={['center', 'center']} fontWeight='500' mt='4' m='0'>Compração de resultado das duas últimas respostas</Text>
                        <Text fontSize={['xs', 'xs']} textAlign={['center', 'center']}>Calculo realizado: Resposta 01 (mais antiga) - Resposta 02 (mais recente)</Text>
                        <Flex flexDirection={['column', 'column']} justifyContent='start' alignItems={['center', 'start']} gap='2' mt='2'>
                          {
                            difference &&
                            <Grid templateColumns={['repeat(3, 1fr)', 'repeat(3)', 'repeat(6, 1fr)']} w='100%' templateRows={['', '', 'repeat(1, 1fr)']}>
                              {
                                Object.entries(difference).map(([key, value]) => (
                                  <GridItem display='flex' justifyContent='center' rowSpan={1} colSpan={1} key={key}>
                                    <Badge>{abbreviation[key]}: {parseFloat(value).toFixed(1)} {value < 0 ? <ArrowDownIcon color='red' /> : ( value == 0 ? <MinusIcon color='grey'/> :<ArrowUpIcon color='green' />)}</Badge>
                                  </GridItem>
                                ))
                              }
                            </Grid>
                          }
                        </Flex>
                      </Box>

                    </>
                  }
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
        <EditUserModal isOpen={editUser} onClose={onCloseEditUser} user={session?.user} update={update} />
        <Footer />
      </Layout>
    </>
  )
}