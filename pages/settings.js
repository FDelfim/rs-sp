import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Escala from '../components/settings/Escala';
import { useToast } from '@chakra-ui/react';
import Report from '../components/settings/Report';
import { useSession } from 'next-auth/react';
import Terms from '../components/settings/Terms';
import About from '../components/settings/About';

export default function Answers() {

  const toast = useToast();
  const router = useRouter();
  const [configPage, setConfigPage] = useState('Escala');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && session && session.user.role != 'admin') {
      toast({
        title: 'Sem permissão',
        description: 'Você não tem permissão para acessar esta página',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/')
    }
  }, [status])

  return (
    <>
      {status === 'loading' ?
        <>Loading</> :
        <Layout>
          <Sidebar configPage={configPage} setConfigPage={setConfigPage}>
            {configPage == 'Escala' &&
              <Escala />
            }
            {configPage == 'Relatórios' &&
              <Report />
            }
            {
              configPage == 'Termos de uso' &&
              <Terms/>
            }
            {
              configPage == 'Sobre' &&
              <About/>
            }
          </Sidebar>
        </Layout>
      }
    </>
  )
}
