import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import useAuth from '../hooks/useAuth';
import { getUserInfo } from '../services/userServices';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Escala from '../components/settings/Escala';
import { useToast } from '@chakra-ui/react';

export default function Answers() {

  const { user, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const toast = useToast();

  const [configPage, setConfigPage] = useState('Escala');


  const router = useRouter();

  const fetchUsers = () => {
    fetch('/api/get-all-users-data', {
      method: 'POST',
      body: JSON.stringify({ uid: user.uid }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      }
      );
  }

  useEffect(() => {
    if (!loading) {
      getUserInfo(user).then((data) => {
        setUserInfo(data);
        if (data?.isSuperUser) {
          setUserInfo(data);
          setIsLoaded(true);
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
      <Sidebar configPage={configPage} setConfigPage={setConfigPage}>
        {configPage == 'Escala' &&
          <Escala/>
        }
        {configPage == 'Relatórios' &&
          <>Relatórios</>
        }
      </Sidebar>
    </Layout>
  )
}
