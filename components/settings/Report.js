import { Box, Card, Flex, FormLabel, Heading, Input, InputLeftAddon, Text, useColorModeValue, InputGroup, FormControl, Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import {Select} from 'chakra-react-select'
import { getJsonReport } from '../../controllers/ReportController'

const formatToReport = (userAnswers) => {
    const formattedAnswers = {
        user: userAnswers[0].user,
        answers: userAnswers[0].answers[0]
    };

    return { ...formattedAnswers.user, ...formattedAnswers.answers };
}

export default function Report() {

    const [inicio, setInicio] = useState();
    const [fim, setFim] = useState();
    const [tipo, setTipo] = useState();

    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        let tipos = [];

        if (tipo.length == 0) {
            toast({
                title: 'Erro',
                description: 'Selecione pelo menos um tipo de atleta.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        tipo.map((t) => {
            tipos.push(t.value);
        });

        const inicioTimestamp = new Date(inicio).getTime();
        const fimTimestamp = new Date(fim).getTime();

        if (inicioTimestamp > fimTimestamp) {
            toast({
                title: 'Erro',
                description: 'A data de início deve ser anterior à data de fim.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const data = {
            inicio: inicioTimestamp,
            fim: fimTimestamp,
            tipo: tipos
        };

        getJsonReport(data)
            .then((res) => {
                const formatted = res.map((r) => {
                    return {
                        ...r.user,
                        ...r.answers[0]
                    };
                });

            })
            .catch((err) => {
            console.log(err);
        });

    }

    return (
        <Box m={['2']}>
            <Box bgColor={'teal.500'} color={'#fff'} p='5' borderRadius={'md'} boxShadow={'sm'}>
                <Flex alignItems='center'>
                    <FiFileText size={'35'} /><Text my='0' fontSize={'2xl'} ps='2'>Relatórios</Text>
                </Flex>
            </Box>
            <Card mt='3' mx={['', '', '10%']} p='4' variant='elevated'>
                <Text fontSize='xl' mb='0' fontWeight='bold'>Relatório de respostas</Text>
                <form onSubmit={handleSubmit}>
                    <FormControl mt='4' isRequired>
                        <FormLabel>Período:</FormLabel>
                        <Flex>
                            <InputGroup>
                                <InputLeftAddon children="De" />
                                <Input type='date' onChange={(e) => {setInicio(e.target.value)}} />
                                <InputLeftAddon children="Até" />
                                <Input type='date' onChange={(e) => {setFim(e.target.value)}} />
                            </InputGroup>
                        </Flex>
                    </FormControl>
                    <FormControl mt='4' isRequired>
                        <FormLabel>Tipo de atleta</FormLabel>
                        <Select placeholder='Selecione pelo menos uma opção...'
                            options={[{ value: 'Profissional', label: 'Profissional' },
                            { value: 'Amador', label: 'Amador' },
                            { value: 'noAthlete', label: 'Não atleta' }]}
                            isMulti={true}
                            onChange={(e) => {setTipo(e)}}
                        />
                    </FormControl>
                    <Button mt='3' type="submit" w='100%' colorScheme='teal' size='sm'>Gerar relatório</Button>
                </form>
            </Card>
        </Box>
    )
}
