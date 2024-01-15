import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Box, Flex, Button, Heading, Link, Text, Badge, useToast, Skeleton, Divider } from '@chakra-ui/react'
import RadarChart from './../components/RadarChart';
import CryptoJS from 'crypto-js';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { BsWhatsapp, BsTwitter, BsFacebook, BsTelegram, BsShare } from 'react-icons/bs';
import { translate, colorScale, abbreviation } from '../utils/translates';
import { useSession } from 'next-auth/react';


const secretKey = process.env.NEXT_PUBLIC_CRYPT_KEY;

export default function result() {

  const [userName, setUserName] = useState('');
  const [series, setSeries] = useState(null);
  const [rank, setRank] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    try{
      const url = window.location.href;
      const encrypted = url.split('?')[1];
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const splited = decrypted.split('&');
      const userName = splited[0].split('=')[1];
      const series = JSON.parse(splited[1].split('=')[1])
      const rank = JSON.parse(splited[2].split('=')[1]);
      setUserName(userName);
      setSeries(series);
      setRank(rank);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }catch(error){
      toast({
        title: 'Erro ao buscar resultado',
        description: 'Não foi possível buscar o resultado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/');
    }
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Resiliência Psicológica no Esporte',
        text: 'Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!',
        url: 'https://rs-sp.vercel.app/',
      })
        .then()
        .catch((error) => toast({
          title: 'Erro ao compartilhar',
          description: 'Não foi possível compartilhar o resultado',
          status: 'error',
          duration: 5000,
          isClosable: true,
        }));
    }
  }

  return (
    <Layout>
      <Box px={['5', '20', '20']} mt='2' h={['', '80vh']} display='flex' alignItems='center' flexDirection='column' justifyContent='center'>
        <Skeleton isLoaded={isLoaded}>
          <Heading fontWeight='bold' textAlign='center'>Resumo da resiliência psicológica no esporte de {userName}</Heading>
          <Flex direction={['column', 'row']} justifyContent={['center', 'between']}>
            <Box w={['100vw', '40vw']} mt='5'>
              {
                series &&
                <RadarChart
                  series={series}
                />
              }
            </Box>
            {
              rank &&
              <Box px='2' my='2' w={['100vw', '50vw']} display='flex' flexDirection='column' justifyContent='center' textAlign={['center', 'start']}>
                <Text fontWeight='bold' fontSize='3xl'>Nível de resilência</Text>
                {Object.entries(rank).map(([key, value]) => (
                  <Box key={key}>
                    <Text>
                      <strong>{abbreviation[key]}</strong> - {translate[key]} <Badge colorScheme={colorScale[value]}>{value == 'Não classificado' ? series[key] : value}</Badge>
                    </Text>
                  </Box>
                ))}
              </Box>
            }
          </Flex>
          {(session?.user.name && userName == session?.user.name) &&
            <Flex direction={['column', 'row']} gap={['0', '50']} alignItems='center' display='flex' justifyContent='center'>
                <Text fontSize={['md', 'xl']} fontWeight='bold' textAlign='center' mb='0'>Compartilhar resultado</Text>
              <Box display='flex' flexDirection={['row', 'column']} justifyContent='center' m='0'>
                <Flex direction={['row', 'row']}>
                  <Button variant='ghost' colorScheme='green' p='0' fontSize='3xl'><Link href='whatsapp://send?text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsWhatsapp /></Link></Button>
                  <Button variant='ghost' colorScheme='cyan' p='0' fontSize='3xl'><Link href='https://telegram.me/share/url?url=https://rs-sp.vercel.app/&text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!'><BsTelegram /></Link></Button>
                  <Button variant='ghost' colorScheme='twitter' p='0' fontSize='3xl'><Link href='https://twitter.com/intent/tweet?url=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsTwitter /></Link></Button>
                  <Button variant='ghost' colorScheme='messenger' p='0' fontSize='3xl'><Link href='https://www.facebook.com/sharer/sharer.php?u=https://rs-sp.vercel.app/'><BsFacebook /></Link></Button>
                  <Button onClick={handleShare} variant='ghost' colorScheme='white' p='0' fontSize='3xl'><BsShare /></Button>
                </Flex>
              </Box>
              <Button onClick={() => {
                router.push('/profile');
              }} colorScheme='teal'>Acessar meu perfil</Button>
            </Flex>
          }
          {!session?.user.name && <Button onClick={() => {
            router.push('/');
          }} colorScheme='teal'>Fazer o teste</Button>}
        </Skeleton>
      </Box>
      <Footer />
    </Layout>
  )
}
