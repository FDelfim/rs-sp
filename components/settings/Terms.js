import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { getQuerionnaireTerm } from '../../services/questionnairesServices';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Terms() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const toast = useToast();

    const [term, setTerm] = useState('');

    useEffect(() => {
        const getTerm = async () => {
            try {
                const data = await getQuerionnaireTerm(1);
                setTerm(data);
            } catch (err) {
                toast({
                    title: err,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }

        getTerm();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/settings/terms', {
            method: 'POST',
            body: JSON.stringify({ id: 1, data: term }),
        });
        const data = await response.json();
        if (response.status !== 200) {
            toast({
                title: 'Erro ao salvar termos de uso',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: data.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <Box m={['2']}>
            <Box defaultIndex={[0]} allowMultiple backgroundColor={bgColor} mx={['', '', '10%']} boxShadow={'md'} p='8' borderRadius='10'>
                <Text fontSize={'2xl'} fontWeight='bold'>Termos de uso</Text>
                <form onSubmit={handleSubmit}>
                    <ReactQuill theme="snow" codeview='true' value={term} onChange={(e) => { setTerm(e) }} />
                    <Flex justifyContent='end'>
                        <Button type='submit' mt='3' colorScheme='teal'>Salvar</Button>
                    </Flex>
                </form>
            </Box>
        </Box>
    )
}
