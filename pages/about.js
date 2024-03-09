import React, { useEffect, useState } from 'react'
import Layout from './../components/Layout';
import { Card, Text, useToast } from '@chakra-ui/react';
import Footer from '../components/Footer';

export default function about() {

  const [about, setAbout] = useState('')
  const toast = useToast();

  useEffect(() => {
    const getAbout = async () => {
      await fetch('/api/settings/about', {
        method: 'GET',
      }).then((res) => res.json())
        .then((data) => {
          setAbout(data.text)
        }
        ).catch((error) => {
          toast({
            title: error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        })
    }
    getAbout()
  }, [])


  return (
    <Layout>
      {
        about 
        && <Card p={5} mx={[4,20]} my={[4,5]} px='8' boxShadow="lg" bg="white" borderRadius="md">
          <span fontSize="md" dangerouslySetInnerHTML={{ __html: about }}></span>
        </Card> 
      }
      <Footer />
    </Layout>
  )
}
