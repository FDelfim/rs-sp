import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import {Box, Flex, Button, Heading, Divider, Link, Text } from '@chakra-ui/react'
import { FaUserCheck } from 'react-icons/fa'
import RadarChart from './../components/RadarChart';
import CryptoJS from 'crypto-js';
import  Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import { Router, useRouter } from 'next/router';
import { BsWhatsapp, BsTwitter, BsFacebook, BsTelegram, BsLinkedin, BsShare } from 'react-icons/bs';

const secretKey = process.env.NEXT_PUBLIC_CRYPT_KEY;

export default function result() {

  const [userName, setUserName] = useState('');
  const [series, setSeries] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const url = window.location.href;
    const encrypted = url.split('?')[1];
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const splited = decrypted.split('&');
    const userName = splited[0].split('=')[1];
    const series = JSON.parse(splited[1].split('=')[1])
    setUserName(userName);
    setSeries(series);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Resiliência Psicológica no Esporte',
        text: 'Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!',
        url: 'https://rs-sp.vercel.app/',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }

  return (
  <Layout>
    <Box px={['5', '20' ,'20']} mt='2' h={['', '80vh']} display='flex' alignItems='center' flexDirection='column' justifyContent='center'>
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
        <Box mt='5' w={['100vw', '50vw']} display='flex' flexDirection='column' justifyContent='center' textAlign={['center', 'start']}>
          {/* <Text fontSize={['md', 'lg']}><strong>ES</strong> - Experiência Esportivas: {series[0]}</Text>
          <Text fontSize={['md', 'lg']}><strong>ASF</strong> - Apoio Social Familiar: {series[1]} </Text>
          <Text fontSize={['md', 'lg']}><strong>RPC</strong> - Recursos Pessoais e Competências: {series[2]} </Text>
          <Text fontSize={['md', 'lg']}><strong>E</strong> - Espiritualidade: {series[3]} </Text>
          <Text fontSize={['md', 'lg']}><strong>ASE</strong> - Apoio Social Esportivo: {series[4]} </Text>
          <Text fontSize={['md', 'lg']}><strong>Resiliência total</strong>: {(series.reduce((a, b) => a + b, 0) / series.length).toFixed(2)}</Text>
          <Text textAlign={['center', 'end']} fontSize={['md', 'lg']} color='gray'>A escala varia entre 0 a 15</Text> */}
        </Box>
      </Flex>
      { (user?.name && userName == user?.name) && 
          <Flex direction={['column', 'row']} gap={['0', '50']} alignItems='center'>
            <Box display='flex' flexDirection={['row', 'column']} justifyContent='center' m='0'>
                <Text fontSize={['md', 'xl']} fontWeight='bold' textAlign='center'>Compartilhar resultado</Text>
                <Flex direction={['row', 'row']}>
                  <Button variant='ghost' colorScheme='green' p='0' fontSize='3xl'><Link href='whatsapp://send?text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsWhatsapp/></Link></Button>
                  <Button variant='ghost' colorScheme='cyan' p='0' fontSize='3xl'><Link href='https://telegram.me/share/url?url=https://rs-sp.vercel.app/&text=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também!'><BsTelegram/></Link></Button>
                  <Button variant='ghost' colorScheme='twitter' p='0' fontSize='3xl'><Link href='https://twitter.com/intent/tweet?url=Consegui ver o resultado da minha resiliência psicológica no esporte neste site, veja a sua também! https://rs-sp.vercel.app/'><BsTwitter/></Link></Button>
                  <Button variant='ghost' colorScheme='messenger' p='0' fontSize='3xl'><Link href='https://www.facebook.com/sharer/sharer.php?u=https://rs-sp.vercel.app/'><BsFacebook/></Link></Button>
                  <Button onClick={handleShare} variant='ghost' colorScheme='white' p='0' fontSize='3xl'><BsShare/></Button>
                </Flex>
            </Box>
            <Button onClick={() => {
              router.push('/profile');
            }} colorScheme='teal'>Acessar meu perfil</Button> 
          </Flex>
      }
      { !user?.name && <Button onClick={() => {
        router.push('/');
      }} colorScheme='teal'>Fazer o teste</Button>}
    </Box>
    <Footer/>
  </Layout>
  )
}
