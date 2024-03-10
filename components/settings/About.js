import { Box, Button, Flex, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function About() {
    const bgColor = useColorModeValue('white', 'gray.800');
    const toast = useToast();
    const [about, setAbout] = useState('');

    useEffect(() => {
        const getAbout = async () => {
            try {
                const res = await fetch('/api/settings/about', {
                    method: 'GET',
                });
                const data = await res.json();
                setAbout(data.text);
            } catch (err) {
                toast({
                    title: err.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        getAbout();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
            const res = await fetch('/api/settings/about', {
                method: 'POST',
                body: JSON.stringify({ data: about }),
            });
            const data = await res.json();
            if(res.status === 200){
                toast({
                    title: 'Sobre atualizado',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }else{
                toast({
                    title: data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
    };

    return (
        <Box m={['2']}>
            <Box allowMultiple backgroundColor={bgColor} mx={['', '', '10%']} boxShadow={'md'} p='8' borderRadius='10'>
                <Text fontSize={'2xl'} fontWeight='bold'>Sobre</Text>
                <form onSubmit={handleSubmit}>
                    <ReactQuill modules={
                        {
                            toolbar: [
                                [{ 'font': [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image'],
                                ['direction', { 'align': [] }],
                                ['clean']
                            ]
                        }
                    } theme="snow" value={about} onChange={(e) => setAbout(e)} />
                    <Flex justifyContent='end'>
                        <Button type='submit' mt='3' colorScheme='teal'>Salvar</Button>
                    </Flex>
                </form>
            </Box>
        </Box>
    );
}
