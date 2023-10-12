import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useAuth from '../hooks/useAuth';
import { getUserInfo } from './../services/userServices';
import { Box, Card, CardBody, CardFooter, Flex, Heading, Image, Skeleton, Text, useToast, Button, Grid, GridItem, Input, useMultiStyleConfig } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DownloadIcon } from '@chakra-ui/icons';
import { getAllUsersAnswers } from './../services/userServices';

export default function Answers() {

  const { user, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const styles = useMultiStyleConfig('Button', { variant: 'outline' });

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      getUserInfo(user).then((data) => {
        setUserInfo(data);
        if (data?.isSuperUser) {
          setUserInfo(data);
          setIsLoaded(true);
          getAllUsersAnswers().then((result) => {
            console.log(result)
          })
        } else {
          toast({
            title: 'Você não possui permissão para acessar esta página!',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          router.push('/');
        }
      }
      );
    }
  }, [loading]);


  return (
    <Layout>
      <Skeleton isLoaded={isLoaded}>
        {userInfo?.isSuperUser &&
          <Box mx={['2', '10']} h={['', '90vh']} display='flex' alignItems='center'>
            <Grid templateColumns={['repeat(1)', 'repeat(1)' ,'repeat(5, 1fr)']} w='100%' gap='10px'>
              <GridItem colSpan={['', '2']}>
                <Card maxW='md' h='100%'>
                  <CardBody>
                    <Heading>Relatório de respostas</Heading>
                    <Text>
                      Baixar o relatório contendo todas as respostas, de todos os usuários, bem como os dados pessoais dos mesmos.
                    </Text>
                  </CardBody>
                  <Image objectFit='cover' src='https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/relatorio.jpg'  alt='Relatórios' />
                  <CardFooter justify='space-between' flexWrap='wrap' sx={{'& > button': { minW: '136px', }, }}>
                    <Button flex='1' colorScheme='teal' variant='ghost' leftIcon={<DownloadIcon/>}>Download</Button>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem colSpan={['','3']}>
                <Card h='100%'>
                  <CardBody>
                    <Heading>Importar arquivo</Heading>
                    <Text>Importar arquivos para alimentar a base de respostas</Text>
                  </CardBody>
                  <Flex justifyContent='center' alignItems='center'>
                    <Image w='45%' src='https://cdn-icons-png.flaticon.com/512/564/564793.png'  alt='Relatórios' />
                  </Flex>
                  <CardFooter>
                  <Input
                    disabled
                    type='file'
                    sx={{
                      '::file-selector-button': {
                        border: 'none',
                        outline: 'none',
                        ...styles,
                      },
                    }}
                    />
                  </CardFooter>
                </Card>
              </GridItem>
            </Grid>
          </Box>
        }
      </Skeleton>
    </Layout>
  )
}
