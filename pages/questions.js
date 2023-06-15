import useAuth from '../hooks/useAuth';
import withAuthModal from '../components/Auth';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, setDoc, doc, getDoc } from 'firebase/firestore';
import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, Heading, ModalOverlay, Button, 
         FormControl, Input, FormLabel, Text, Box, Switch, Divider } from '@chakra-ui/react';
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
    <Modal isOpen={show} onClose={handleClose} size='xl' >
      <ModalOverlay />
      <ModalContent p='3'>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction='column' justify='center' gap={4}>
            <Heading size='md' textAlign='center'>
              Seja bem vindo!
            </Heading>
            <FormControl>
              <Text textAlign='start'>Olá {user?.name}, gostariámos de te conhecer um pouco melhor. Por favor, preencha os campos abaixo:</Text>
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