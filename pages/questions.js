import useAuth from '../hooks/useAuth';
import withAuthModal from '../components/Auth';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, setDoc, doc, getDoc } from 'firebase/firestore';
import { Flex, Modal, ModalBody, ModalContent, Heading, ModalOverlay, Button, 
         FormControl, Input, FormLabel, Text, Box, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Stack, Checkbox, Radio, RadioGroup } from '@chakra-ui/react';
import Head from 'next/head';
import Question from '../components/Question';
import { useRouter } from 'next/router';
import { Form } from 'react-bootstrap';

export function Questions() {

  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [ userInfo, setUserInfo ] = useState({birthDate: '', birthCity: '', modality: '', timePratice: '', competitiveLevel: ''});
  const [result, setResult] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const router = useRouter();

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const userRef = collection(db, 'users');
      const querySnapshot = await getDocs(userRef);
      const usersData = [];
      for (const doc of querySnapshot.docs) {
        const user = doc.data();
        user.uid = doc.id;
        usersData.push(user);
      }
      const userExists = usersData.find((user) => user.id === user?.uid);
      if (!userExists) {
        await setDoc(doc(db, 'users', `${user?.uid}`), {
          name: user?.name,
          email: user?.email,
          
        });
      } else {
        return (
          alert('Usuário cadastrado!')
        )
      }
    } catch (error) {
      console.error('Erro ao cadastar usuário:', error);
    }
  }

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const questionnairesRef = collection(db, 'questionnaires');
        const querySnapshot = await getDocs(questionnairesRef);
        const questionnairesData = [];
      
        for (const doc of querySnapshot.docs) {
          const questionnaire = doc.data();
          questionnaire.id = doc.id;
      
          if (questionnaire.id === '1') {
            const questionsSnapshot = await getDocs(
              query(collection(db, `questionnaires/${doc.id}/questions`))
            );
            questionnaire.questions = questionsSnapshot.docs.map((questionDoc) => questionDoc.data());
            questionnairesData.push(questionnaire);
          }
        }
        setQuestionnaires(questionnairesData);
      } catch (error) {
        console.error('Erro ao buscar questionários:', error);
      }
    };

    const infouser = async () => {
      try {
        const userRef = collection(db, 'users');
        const querySnapshot = await getDocs(userRef);
        return querySnapshot.docs.find((doc) => doc.id === user?.uid);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }

    infouser()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error('Erro ao buscar usuários:', error);
    });

    fetchQuestionnaires();
  }, []);

  const appendOption = (value, index) => {
    const questionExists = answers.find((answer) => answer.question === currentQuestion + 1);
    if (!questionExists) {
      setAnswers([...answers, {question: currentQuestion, answer: value}]);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentQuestion].answer = value;
      setAnswers(newAnswers);
    }
  }

  const redirectResult = () => {
    async function saveAnswers() {
      try {
        const userRef = doc(db, 'users', user?.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const answersRef = collection(db, 'users', user?.uid, 'answers');
          const answersQuerySnapshot = await getDocs(answersRef);
          if (answersQuerySnapshot.empty) {
            const data = answers.reduce((acc, answer) => {
              const fieldName = `question_${answer.question+1}`;
              return {
                ...acc,
                [fieldName]: answer.answer,
              };
            }, {});
            data.created_at = new Date();
            data.questionnaire = questionnaires[0].id;
            const docRef = doc(answersRef);
            await setDoc(docRef, data);
          }else{
            alert('Você já respondeu esse questionário!')
          }
        }
      } catch (error) {
        console.error('Erro ao salvar respostas:', error);
      }
    }
    saveAnswers();
    router.push('/profile')
  }

  return (
    <>
    <Layout>
        <Head>
          <script
              dangerouslySetInnerHTML={{
                __html: `
                  if(!document.cookie || !document.cookie.includes('rs-sp')) {
                    window.location.href = "/"
                  }
                `
              }}
          />
        </Head>
      {
        !result ?
        <Box p='2' mx={[4, 8]} >
          {questionnaires.map((questionnaire) => (
          <Box key={'questionnaire-' + questionnaire.id} display='flex' flexDirection={'column'} minH='85vh' justifyContent='space-between'>
            <Box mt='2' minH='30vh' display='flex' flexDirection='column' justifyContent='space-betwwen'>
              <Text fontSize={['2xl','5xl']} textAlign='center' fontWeight='bold' color='teal.500' textTransform='uppercase'>{questionnaire.name}</Text>
              <Text px={['5', '10']} fontSize={['lg', '2xl', '3xl']} textAlign='center'>
                Responda as questões objetivamente com o grau de certeza que você possui sobre as questões descritas abaixo, sendo
                <strong> 1 ponto (absolutamente não concordo) e 5 pontos (absolutamente concordo).</strong>
              </Text>
            </Box> 
            <Flex justify='center' direction='column'>
              {questionnaire.questions.map((question, index) => (
                <Question 
                key={'question-' + question.question} 
                question={question} index={index} 
                questionnaire={questionnaire} 
                setCurrentQuestion={setCurrentQuestion} 
                currentQuestion={currentQuestion}
                appendOption={appendOption}
                answers={answers}
                setResult={setResult}
                />
              ))}
            </Flex>
          </Box>
          ))
          }
        </Box >
        :
        <Box p='2' mx={[4, 8]} >
          <Flex direction='column' justify='center' align='center' h='85vh'>
            <Heading size='lg' textAlign='center'>
              Obrigado por responder o questionário!
            </Heading>
            <Text textAlign='center'>Agora que você já respondeu o questionário, clique no botão abaixo para ver o resultado.</Text>
            <Button onClick={redirectResult} colorScheme='teal'>Ver resultado</Button>
          </Flex>
        </Box>
      }
    </Layout >
    {/* MODAL SECTION */}
    <Modal isOpen={show} onClose={handleClose} size='xl'>
      <ModalOverlay />
      <ModalContent p='3'>
        <ModalBody>
          <Flex direction='column' justify='center' gap={4}>
            <Heading size='md' textAlign='center'>
              Seja bem vindo!
            </Heading>
            <Form onSubmit={handleConfirm}>
              <Flex direction='column' justify='center' gap={4}>
                <Text textAlign='start'>Olá {user?.name}, gostariámos de te conhecer um pouco melhor. Por favor, preencha os campos abaixo:</Text>
                <FormControl isRequired>
                  <FormLabel>Natualidade</FormLabel>
                  <Input type='text' placeholder='e.g. São Paulo' onChange={(event) => {setUserInfo({
                        ...userInfo,
                        birthCity: event.target.value
                      })
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Data de nascimento</FormLabel>
                  <Input type='date' onChange={(event) => {setUserInfo({
                        ...userInfo,
                        birthDate: event.target.value
                      })
                    }} 
                  />
                </FormControl>
                <FormControl alignItems='center' isRequired>
                  <FormLabel>
                    Você é atleta?
                  </FormLabel>
                  <RadioGroup gap='3' name='athlete'>
                    <Button colorScheme='teal' size='sm' variant={userInfo.athlete == true ? 'solid' : 'outline'} onClick={() => { setUserInfo({...userInfo, athlete: true}) }} >Sim</Button>
                    <Button colorScheme='teal' size='sm' variant={userInfo.athlete == false ? 'solid' : 'outline'} onClick={() => { setUserInfo({...userInfo, athlete: false}) }} >Não</Button>
                  </RadioGroup>
                </FormControl>
                {
                  (userInfo.athlete !== undefined ? 
                    userInfo.athlete === true ? 
                    <>
                      <FormControl isRequired>
                        <FormLabel>Qual modalidade?</FormLabel>
                        <Input type='text' placeholder='e.g. Atletismo' onChange={(event) => {setUserInfo({
                              ...userInfo,
                              sport: event.target.value
                            })
                          }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Há Quanto Tempo você pratica esta modalidade? (em anos)</FormLabel>
                        <NumberInput step={1} defaultValue={0} min={0}>
                          <NumberInputField onChange={(event) => {setUserInfo({
                                ...userInfo,
                                sportTime: event.target.value
                              })
                            }}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Qual seu nível competitivo?</FormLabel>
                        <Stack spacing={[1,5]} direction={['column', 'row']}>
                            <Checkbox value='Regional' colorScheme='green' size='lg'>Regional</Checkbox>
                            <Checkbox value='Estadual' colorScheme='green' size='lg'>Estadual</Checkbox>
                            <Checkbox value='Nacional' colorScheme='green' size='lg'>Nacional</Checkbox>
                            <Checkbox value='Internacional' colorScheme='green' size='lg'>Internacional</Checkbox>
                        </Stack>
                      </FormControl>
                    </>
                    :
                      <FormControl isRequired>
                        <FormLabel>Pratica algum esporte amador?</FormLabel>
                        <Flex gap='3'>
                          <Button colorScheme='teal' size='sm' variant={userInfo.amateur == true ? 'solid' : 'outline'} onClick={() => { setUserInfo({...userInfo, amateur: true}) }} >Sim</Button>
                          <Button colorScheme='teal' size='sm' variant={userInfo.amateur == false ? 'solid' : 'outline'} onClick={() => { setUserInfo({...userInfo, amateur: false}) }} >Não</Button>
                        </Flex>
                      </FormControl>
                  :
                  <></>)
                }
                <Button mt={4} colorScheme='whatsapp' type='submit'>Confirmar</Button>
              </Flex>
            </Form>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
}

export default withAuthModal(Questions);