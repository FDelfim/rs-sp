import React, { use, useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import useAuth from '../hooks/useAuth';
import { getUserInfo } from './../services/userServices';
import { Box, Card, CardBody, CardFooter, Flex, Heading, Image, Skeleton, Stack, Text, useToast, Button, CardHeader, Avatar, IconButton, Grid, GridItem, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { CheckCircleIcon, DownloadIcon } from '@chakra-ui/icons';

export default function Answers() {

  const { user, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      getUserInfo(user).then((data) => {
        setUserInfo(data);
        if (data?.isSuperUser) {
          setUserInfo(data);
          setIsLoaded(true);
        } else {
          toast({
            title: "Você não possui permissão para acessar esta página!",
            status: "error",
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
            <Grid templateColumns={['repeat(1)', 'repeat(1)' ,'repeat(3, 1fr)']} gap='10px'>
              <GridItem>
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
              <GridItem colSpan={['','2']}>
                <Card h='100%'>
                  <CardBody>
                    <Heading>Importar arquivo:</Heading>
                    <Text>Importar arquivos para alimentar a base de respostas</Text>
                  </CardBody>
                  <Flex justifyContent='center' alignItems='center'>
                    <Image w='50%' src='https://www.lifewire.com/thmb/MgTvmCHCdizBlFT_geQIvNorp9Q=/1920x1326/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cloud-upload-a30f385a928e44e199a62210d578375a.jpg'  alt='Relatórios' />
                  </Flex>
                  <CardFooter>
                    <Input type='file'/>
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
