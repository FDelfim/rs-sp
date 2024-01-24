import React, { useState } from 'react';
import {
  FormControl, Input, FormLabel, Text, useRadioGroup, Flex, RadioGroup, Modal, ModalContent,
  ModalOverlay, ModalBody, Heading, Button, useToast, ModalHeader, ModalFooter, Checkbox, Link, useDisclosure, Select
} from '@chakra-ui/react';
import RadioCard from '../RadioCard';
import { storeUser } from '../../services/userServices';
import TermsModal from './termsModal';

export default function WelcomeModal({ isOpen, setIsOpen, session, update }) {
  const toast = useToast();

  const { onClose } = useDisclosure();

  const [userData, setUserData] = useState({
    birthCity: null,
    currentCity: null,
    birthDate: null,
    modality: null,
    timePratice: null,
    isAthlete: null,
    practicesSport: null,
    competitiveLevel: null,
    athleteLevel: null,
    terms: false
  });
  
  const [showTerms, setShowTerms] = useState(false);

  const { getRadioProps: getAthleteRadioProps } = useRadioGroup({
    name: 'isAthlete',
    onChange: (e) => {
      e === 'Não' ? e = false : e = true;
      setUserData({ ...userData, isAthlete: e, practicesSport: e });
    },
  });

  const { getRadioProps: getSportRadioProps } = useRadioGroup({
    name: 'practicesSport',
    onChange: (e) => {
      e === 'Não' ? e = false : e = true;
      setUserData({ ...userData, practicesSport: e });
      setUserData({ ...userData, athleteLevel: null })
    },
  });

  const { getRadioProps: getCompetitiveLevelRadioProps } = useRadioGroup({
    name: 'competitiveLevel',
    onChange: (e) => {
      setUserData({ ...userData, competitiveLevel: e });
    },
  });

  const { getRadioProps: getAthleteLevelRadioProps } = useRadioGroup({
    name: 'athleteLevel',
    onChange: (e) => {
      setUserData({ ...userData, athleteLevel: e });
    },
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await storeUser({
        ...{...session.user, ...userData
        }}, session.user.userId);
      toast({
        title: 'Sucesso!',
        description: 'Seu cadastro foi realizado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await update();
    } catch (error) {
      toast({
        title: 'Erro!',
        description: error.toString(),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsOpen(false)
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Seja bem vindo!</Heading>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Text>
                Olá {session?.user.name}, gostaríamos de te conhecer um pouco melhor. Por favor, preencha os campos abaixo:
              </Text>
              <FormControl mt="3" isRequired>
                <FormLabel>Naturalidade</FormLabel>
                <Input type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                  setUserData({ ...userData, birthCity: e.target.value })
                }
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormLabel>Cidade atual</FormLabel>
                <Input type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                  setUserData({ ...userData, currentCity: e.target.value })
                }
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormLabel>Data de nascimento</FormLabel>
                <Input type="date" placeholder="e.g. 01/01/2000" onChange={(e) =>
                  setUserData({ ...userData, birthDate: new Date(`${e.target.value}T00:00:00-03:00`) })
                }
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormLabel>Você é atleta?</FormLabel>
                <RadioGroup display="flex" gap="10px">
                  {['Sim', 'Não'].map((value) => {
                    const radio = getAthleteRadioProps({ value });
                    return (
                      <RadioCard key={value} {...radio} x="3" y="2">
                        <Text p="0" m="0" fontSize="md">
                          {value}
                        </Text>
                      </RadioCard>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              {userData.isAthlete != undefined && userData.isAthlete && (
                <>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Qual nível?</FormLabel>
                    <RadioGroup display="flex" gap="10px">
                      {['Profissional', 'Amador'].map((value) => {
                        const radio = getAthleteLevelRadioProps({ value });
                        return (
                          <RadioCard key={value} {...radio} x="3" y="2">
                            <Text p="0" m="0" fontSize="md">
                              {value}
                            </Text>
                          </RadioCard>
                        );
                      }
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Modalidade</FormLabel>
                    <Input
                      type="text"
                      placeholder="e.g. Futebol"
                      onChange={(e) =>
                        setUserData({ ...userData, modality: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Há quanto tempo?</FormLabel>
                    <Select placeholder='Selecione uma opção' onChange={(e) => setUserData({ ...userData, timePratice: e.target.value })}>
                      <option value='Até 06 meses'>Até 6 meses</option>
                      <option value='De 6 meses a 01 ano'>De 6 meses a 1 ano</option>
                      <option value='De 1 a 2 anos'>De 1 a 2 anos</option>
                      <option value='De 3 a 4 anos'>De 3 a 4 anos</option>
                      <option value='De 4 a 5 anos'>De 4 a 5 anos</option>
                      <option value='De 5 a 6 anos'>De 5 a 6 anos</option>
                      <option value='De 6 a 7 anos'>De 6 a 7 anos</option>
                      <option value='De 7 a 8 anos'>De 7 a 8 anos</option>
                      <option value='De 8 a 9 anos'>De 8 a 9 anos</option>
                      <option value='De 9 a 10 anos'>De 9 a 10 anos</option>
                      <option value='Acima de 10 anos'>Acima de 10 anos</option>
                    </Select>
                  </FormControl>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Nível competitivo</FormLabel>
                    <RadioGroup display="flex" justifyContent="center" gap="10px" flexWrap={{ base: "wrap", md: "nowrap" }}>
                      {['Regional', 'Estadual', 'Nacional', 'Internacional'].map((value) => {
                        const radio = getCompetitiveLevelRadioProps({ value });
                        return (
                          <RadioCard key={value} {...radio} x="3" y="2" flexBasis={{ base: "50%", md: "auto" }}>
                            <Text p="0" m="0" fontSize="md">
                              {value}
                            </Text>
                          </RadioCard>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              {userData.isAthlete != undefined && !userData.isAthlete && (
                <>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Pratica algum esporte?</FormLabel>
                    <RadioGroup display="flex" gap="10px">
                      {['Sim', 'Não'].map((value) => {
                        const checkbox = getSportRadioProps({ value });
                        return (
                          <RadioCard key={value} {...checkbox} x="3" y="2">
                            <Text p="0" m="0" fontSize="md">
                              {value}
                            </Text>
                          </RadioCard>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  {userData.practicesSport != undefined && userData.practicesSport && (
                    <FormControl mt="3" isRequired>
                      <FormLabel>Modalidade</FormLabel>
                      <Input
                        type="text"
                        placeholder="e.g. Futebol"
                        onChange={(e) =>
                          setUserData({ ...userData, modality: e.target.value })
                        }
                      />
                    </FormControl>)
                  }
                </>
              )
              }
              <Flex>
                <Checkbox required mt="3" size="lg" colorScheme="teal" isRequired onChange={
                  (e) => setUserData({ ...userData, terms: e.target.checked })
                }>Estou de acordo e aceito os termos de uso</Checkbox>
                <Link ml='1' color='teal' display='flex' justifyContent='end' alignItems='end' onClick={() => { setShowTerms(true); setIsOpen(false) }}>(Clique aqui para acessar!)</Link>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <TermsModal isOpen={showTerms} setIsOpen={setShowTerms} setIsOpenWelcomeModal={setIsOpen} />
    </>
  );
}