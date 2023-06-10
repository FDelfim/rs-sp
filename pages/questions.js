import useAuth from '../hooks/useAuth';
import withAuthModal from '../components/Auth';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, setDoc, doc } from 'firebase/firestore';
import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, Heading, ModalOverlay, Button, 
         FormControl, Input, FormLabel, Text, Box, Card, Switch, Divider, Grid, GridItem, Spacer, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import Question from '../components/Question';
import { useRouter } from 'next/router';

export function Questions() {

  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
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
        const userExists = querySnapshot.docs.find((doc) => doc.id === user?.uid);
        if (!userExists) {
          console.log('Usuário não cadastrado!');
          return (
            handleShow()
          )
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }
    infouser();
    fetchQuestionnaires();
  }, []);

  const appendOption = (value, index) => {
    const answerIndex = answers.findIndex((answer) => answer.question === index+1);
    if (answerIndex === -1) {
      setAnswers([...answers, {question: index+1, answer: value}]);
    } else {
      const newAnswers = [...answers];
      newAnswers[answerIndex].answer = value;
      setAnswers(newAnswers);
    }
  }

  const redirectResult = () => {
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
          <Box key={'questionnaire-' + questionnaire.id} display='flex' flexDirection={'column'} h='85vh' justifyContent='space-between'>
            <Text fontSize={['xl','4xl']} textAlign='center' textTransform='uppercase'>{questionnaire.name}</Text>
            <Text px={['5', '10']} fontSize={['sm', '2xl', '3xl']} textAlign='center'>
              Responda as questões objetivamente com o grau de certeza que você possui sobre as questões descritas abaixo, sendo
              <strong> 1 ponto (absolutamente não concordo) e 5 pontos (absolutamente concordo).</strong>
            </Text>
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
    <Modal isOpen={show} onClose={handleClose} size='xl' >
      <ModalOverlay />
      <ModalContent p='3'>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction='column' justify='center' gap={4}>
            <Heading size='lg' textAlign='center'>
              Seja bem vindo!
            </Heading>
            <FormControl>
              <Text textAlign='start'>Olá {user?.name}, gostariámos de te conhecer um pouco melhor. Por favor, preencha os campos abaixo:</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Nome Completo</FormLabel>
              <Input placeholder='e.g. João da Silva' />
            </FormControl>
            <FormControl>
              <FormLabel>Data de nascimento</FormLabel>
              <Input type='date' placeholder='e.g. João da Silva' />
            </FormControl>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='email-alerts' mb='0'>
                Você é atleta de alto rendimento?
              </FormLabel>
              <Switch id='email-alerts' />
            </FormControl>
            <Divider />
            <Button onClick={handleConfirm} mt={4} colorScheme='whatsapp'>
              Confirmar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
}

export default withAuthModal(Questions);