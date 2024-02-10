import withAuthModal from '../components/Auth';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import Question from '../components/Question';
import WelcomeModal from '../components/_modals/welcomeModal';
import { db } from '../lib/firebase';
import { collection, getDocs, query, setDoc, doc, getDoc } from 'firebase/firestore';
import { Flex, Heading, Button, Text, Box, useToast, Slide, useDisclosure, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getUserAnswers, storeUser } from '../services/userServices';

export function Questions() {
  const toast = useToast();
  const { data: session, status, update } = useSession();

  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nextAnswer, setNextAnswer] = useState(false);
  const [saveAnswers, setSaveAnswers] = useState(false);

  const { isOpen: info, onToggle: onInfo } = useDisclosure();

  const router = useRouter();

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
            questionnaire.questions = questionsSnapshot.docs.map((questionDoc) => ({
              ...questionDoc.data(),
              id: questionDoc.id
            }));
            questionnaire.questions.sort((a, b) => a.id - b.id);
            questionnairesData.push(questionnaire);
          }
        }
        setQuestionnaires(questionnairesData);
      } catch (error) {
        toast({
          title: 'Erro ao buscar questionários',
          description: 'Não foi possível buscar os questionários',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    };
    fetchQuestionnaires();
    if(status === 'loading') setIsLoading(true);
    else setIsLoading(false);

    if (!(session?.user.terms)) {
      setIsOpen(true);
    } else {
      setIsOpen(false)
      if (session?.user.lastAnswer) {
        getUserAnswers(session.user.userId).then((answers) => {
          if (answers.length > 0) {
            setResult(true);
          }
          const nextAnswer = (new Date(session.user?.lastAnswer?.seconds * 1000 + 90 * 24 * 60 * 60 * 1000))
          setNextAnswer(nextAnswer);
          if(nextAnswer < new Date()){
            setResult(false);
          }
        }
        )
      }
    }
  }, [status])

  useEffect(() => { 
    async function storeAnswers() {
      try {
        const userRef = doc(db, 'users', session.user.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const answersRef = collection(db, 'users', session.user.userId, 'answers');
          const answersQuerySnapshot = await getDocs(answersRef);
          await storeUser({ ...session.user, 'lastAnswer': new Date() }, session.user.userId);
          await update()
          if (answersQuerySnapshot) {
            const data = answers.reduce((acc, answer) => {
              const fieldName = `question_${answer.question + 1}`;
              return {
                ...acc,
                [fieldName]: answer.answer,
              };
            }, {});
            data.created_at = new Date();
            data.questionnaire = questionnaires[0].id;
            const docRef = doc(answersRef);
            await setDoc(docRef, data);
            let docAnswer = await getDoc(docRef);
            const currentUserRef = collection(db, 'users', session.user.userId, 'answers', docAnswer.id, 'user');
            await setDoc(doc(currentUserRef), session.user);
          }
        }
      } catch (error) {
        toast({
          title: 'Erro ao salvar respostas',
          description: 'Não foi possível salvar as respostas',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    
    if(saveAnswers){
      storeAnswers();
    }
  }, [saveAnswers])

  const appendOption = (value, index) => {
    const questionExists = answers.find((answer) => answer.question === currentQuestion + 1);
    if (!questionExists) {
      setAnswers([...answers, { question: currentQuestion, answer: value }]);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentQuestion].answer = value;
      setAnswers(newAnswers);
    }
  }

  const redirectResult = () => {
    router.push('/profile');
  };

  return (
    <>
      <Layout>
        {isLoading ?
          <Flex h='90vh' justifyContent='center' alignItems='center'>
            <Spinner size='xl' />
          </Flex>
          :
          (!result ?
            <Box p='2' mx={[4, 8]} >
              {questionnaires.map((questionnaire) => (
                <Box key={'questionnaire-' + questionnaire.id} display='flex' flexDirection={'column'} minH='85vh' justifyContent='space-between'>
                  <Box mt='2' minH='30vh' display='flex' flexDirection='column' justifyContent='space-betwwen'>
                    <Text fontSize={['2xl', '3xl', '5xl']} textAlign='center' fontWeight='bold' color='teal.500' textTransform='uppercase'>{questionnaire.name}</Text>
                    <Text px={['5', '10']} fontSize={['lg', 'xl', '2xl']} textAlign='center'>
                      Responda as questões objetivamente com o grau de certeza que você possui sobre as questões descritas abaixo, sendo
                      <strong> 1 ponto (absolutamente não concordo) e 5 pontos (absolutamente concordo).</strong>
                    </Text>
                    <Box display='flex' justifyContent='center'>
                      <Button colorScheme='teal' onClick={onInfo}>{info ? 'Esconder' : 'Clique aqui para mais informações!'}</Button>
                    </Box>
                    <Slide direction='bottom' in={info} style={{ zIndex: 10 }}>
                      <Box p='4' color='white' mt='4' bg='teal' shadow='md' textAlign='center'>
                        1: absolutamente não concordo, 2: não concordo, 3: indiferente, 4: concordo, e 5: absolutamente eu concordo
                      </Box>
                    </Slide>
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
                        setSaveAnswers={setSaveAnswers}
                      />
                    ))}
                  </Flex>
                </Box>
              ))
              }
              <WelcomeModal isOpen={isOpen} setIsOpen={setIsOpen} session={session} update={update} />
            </Box >
            :
            <Box p='2' mx={[4, 8]} >
              <Flex direction='column' justify='center' align='center' h='85vh'>
                <Heading size='lg' textAlign='center'>
                  Obrigado por responder o questionário!
                </Heading>
                {
                  nextAnswer &&
                  <>
                    <Text textAlign='center'>
                      Você poderá responder novamente em {nextAnswer.toLocaleDateString()}
                    </Text> 
                  </>
                }
                <Text textAlign='center'>Agora que você já respondeu o questionário, clique no botão abaixo para ver o resultado.</Text>
                <Button onClick={redirectResult} colorScheme='teal'>Ver resultado</Button>
              </Flex>
            </Box>)
        }
      </Layout>
    </>
  );
}

export default withAuthModal(Questions);
