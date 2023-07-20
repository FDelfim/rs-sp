import React, { useState } from 'react';
import {
  FormControl, Input, FormLabel, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,  NumberDecrementStepper, useRadioGroup,
   Flex, RadioGroup, Modal, ModalContent, ModalOverlay, ModalBody, ModalCloseButton,  Heading, Divider, Button, useToast } from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';
import RadioCard from '../RadioCard';
import { storeUser } from '../../services/userServices';

export default function WelcomeModal({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const toast = useToast();

  const [userData, setUserData] = useState({
  });

  const { getRadioProps: getAthleteRadioProps } = useRadioGroup({
    name: 'isAthlete',
    onChange: (e) => {
      e === 'Não' ? e = false : e = true;
      setUserData({ ...userData, isAthlete: e, practicesSport: true });
    },
  });

  const { getRadioProps: getSportRadioProps } = useRadioGroup({
    name: 'practicesSport',
    onChange: (e) => {
      e === 'Não' ? e = false : e = true;
      var sport = e ? '' : null;
      setUserData({ ...userData, practicesSport: e,  modality: sport });
    },
  });

  const { getRadioProps: getCompetitiveLevelRadioProps } = useRadioGroup({
    name: 'competitiveLevel',
    onChange: (e) => {
      setUserData({ ...userData, competitiveLevel: e });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserData({ ...userData, name: user.name, email: user.email, id: user.uid });
    try {
      await storeUser(userData, user.uid);
      toast({
        title: 'Sucesso!',
        description: 'Seu cadastro foi realizado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Ocorreu um erro ao realizar seu cadastro!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsOpen(false)
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Heading>Seja bem vindo!</Heading>
          <Divider />
          <Text>
            Olá {user?.name}, gostaríamos de te conhecer um pouco melhor. Por favor, preencha os campos abaixo:
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl mt="3" isRequired>
              <FormLabel>Naturalidade</FormLabel>
              <Input type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                  setUserData({ ...userData, birthCity: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormLabel>Data de nascimento</FormLabel>
              <Input type="date" placeholder="e.g. 01/01/2000" onChange={(e) =>
               setUserData({ ...userData, birthDate: new Date(e.target.value) })
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
              {userData.isAthlete != undefined && userData.isAthlete && (
                <>
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
                    <NumberInput step={1} defaultValue={0} min={0}>
                      <NumberInputField
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            timePractice: e.target.value,
                          })
                        }
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl mt="3" isRequired>
                    <FormLabel>Nível competitivo</FormLabel>
                    <RadioGroup display="flex" justifyContent="center" gap="10px">
                      {['Regional', 'Estadual', 'Nacional', 'Internacional'].map(
                        (value) => {
                          const radio = getCompetitiveLevelRadioProps({
                            value,
                          });
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
                </>
              )}
              {userData.isAthlete != undefined && !userData.isAthlete && (
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
              )}
              { userData.practicesSport != undefined && userData.practicesSport && (
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
                )
              }
            </FormControl>
            <Flex justifyContent="end" my="3">
              <Button mt="3" colorScheme="teal" type="submit">
                Salvar
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}