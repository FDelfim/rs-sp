import { Card, Flex, Text,  useRadioGroup, Box, Button, Spacer } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import RadioCard from '../components/RadioCard';
import React, {useState} from 'react'

export default function Question(props) {

  const {getRadioProps} = useRadioGroup({
    name: props.index,
    onChange: props.appendOption,
  }) 

  const [next, setNext] = useState(false)
  const options = ['1', '2', '3', '4', '5']

  return (
    <Flex justify='center' key={'questionnaire-' + props.questionnaire.id + 'question-' + props.index} className={props.currentQuestion != props.index ? 'd-none' : ''} minH={['50vh', '']}>
      <Card m='3' p={['8','10']} w={['95vw', '80vw']} justifyContent='center' h='100%'>
      <Flex direction='column' align='between' alignItems='center' gap='5'>
        <Text fontSize={['xl', '2xl']} textAlign='center'> {props.index + 1}. {props.question.question}</Text> 
        <Flex justify='center' w='100%'>
          <Flex gap='2'>
            {options.map((value) => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={value} {...radio} setNext={setNext}>
                  <Text p='0' m='0' fontSize={['', 'xl']}>{value}</Text>
                </RadioCard>
              )
            })}
          </Flex>
        </Flex>
        <Box minW={['100%', '85%']}> 
          <Flex mt='10'>
            <Button colorScheme='teal' isDisabled={props.index === 0 ? true : false} onClick={()=>{props.setCurrentQuestion(props.index-1);}}><ArrowBackIcon/>Anterior</Button>
            <Spacer />
            <Button colorScheme='teal' isDisabled={!next} onClick={()=>{
              props.setCurrentQuestion(props.index+1)
              if(props.index+1 === props.questionnaire.questions.length){
                props.setResult(true)
              }
            }}
            >{props.index+1 === props.questionnaire.questions.length ? 'Finalizar' : 'Próxima' }<ArrowForwardIcon/></Button>
          </Flex>
        </Box>
      </Flex>
    </Card>
  </Flex>
  )
}
