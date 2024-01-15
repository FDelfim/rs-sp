import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useAuth from '../hooks/useAuth';
import { getUserInfo } from '../services/userServices';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Escala from '../components/settings/Escala';
import { useToast } from '@chakra-ui/react';
import Report from '../components/settings/Report';

export default function Answers() {

  // const { user, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  // const [userInfo, setUserInfo] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const [configPage, setConfigPage] = useState('Escala');




  return (
    <Layout>
      <Sidebar configPage={configPage} setConfigPage={setConfigPage}>
        {configPage == 'Escala' &&
          <Escala/>
        }
        {configPage == 'Relatórios' &&
          <Report/>
        }
      </Sidebar>
    </Layout>
  )
}
