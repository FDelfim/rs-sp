import { Button, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, RadioGroup, Select, Text, useRadioGroup, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { updateUser } from '../../services/userServices'
import RadioCard from '../RadioCard';

export default function EditUserModal({ isOpen, onClose, user, update }) {

    const [userData, setUserData] = useState({});
    const [birthDate, setBirthDate] = useState(null);

    const { setValue: setAthleteValue, getRadioProps: getAthleteRadioProps } = useRadioGroup({
        name: 'isAthlete',
        onChange: (e) => {
            e === 'Não' ? e = false : e = true;
            if (e) {
                setUserData({ ...userData, isAthlete: e, practicesSport: e });
            } else {
                setUserData({ ...userData, isAthlete: e, practicesSport: null, athleteLevel: null, competitiveLevel: null, modality: null, timePratice: null })
            }
        },
    });

    const { setValue: setSportValue, getRadioProps: getSportRadioProps } = useRadioGroup({
        name: 'practicesSport',
        onChange: (e) => {
            e === 'Não' ? e = false : e = true;
            setUserData({ ...userData, practicesSport: e, athleteLevel: null });
        },
    });

    const { setValue: setCompetitveLevelValue, getRadioProps: getCompetitiveLevelRadioProps } = useRadioGroup({
        name: 'competitiveLevel',
        onChange: (e) => {
            setUserData({ ...userData, competitiveLevel: e });
        },
    });

    const { setValue: setAthleteLevelValue, getRadioProps: getAthleteLevelRadioProps } = useRadioGroup({
        name: 'athleteLevel',
        onChange: (e) => {
            setUserData({ ...userData, athleteLevel: e });
        },
    });

    const toast = useToast();

    useEffect(() => {
        if (user?.birthDate?.seconds) {
            setBirthDate(new Date(user.birthDate.seconds * 1000).toISOString().split('T')[0]);
            setUserData({ ...user });
        }
    }, [user])

    useEffect(() => {
        setAthleteValue(userData.isAthlete ? 'Sim' : 'Não');
        setSportValue(userData.practicesSport ? 'Sim' : 'Não');
        setCompetitveLevelValue(userData.competitiveLevel);
        setAthleteLevelValue(userData.athleteLevel);
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userData);
            await update();
            toast({
                title: 'Dados atualizados com sucesso!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: 'Erro ao atualizar dados!',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
            <ModalOverlay />
            <ModalContent p={['2']}>
                <ModalCloseButton />
                <ModalHeader>
                    <Heading>Editar dados</Heading>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl id="name" isRequired>
                            <FormLabel>Nome</FormLabel>
                            <Input value={userData?.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} type="text" placeholder="Nome" />
                        </FormControl>
                        <FormControl mt="3" isRequired>
                            <FormLabel>Data de nascimento</FormLabel>
                            <Input type="date" placeholder="e.g. 01/01/2000" value={birthDate || ''} onChange={(e) => {
                                setBirthDate(e.target.value)
                                setUserData({ ...userData, birthDate: new Date(`${e.target.value}T00:00:00-03:00`) })
                            }} />
                        </FormControl>
                        <FormControl mt="3" isRequired>
                            <FormLabel>Naturalidade</FormLabel>
                            <Input value={userData?.birthCity} type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                                setUserData({ ...userData, birthCity: e.target.value })
                            }
                            />
                        </FormControl>
                        <FormControl mt="3" isRequired>
                            <FormLabel>Cidade atual</FormLabel>
                            <Input value={userData.currentCity} type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                                setUserData({ ...userData, currentCity: e.target.value })
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
                                        value={userData?.modality}
                                        type="text"
                                        placeholder="e.g. Futebol"
                                        onChange={(e) =>
                                            setUserData({ ...userData, modality: e.target.value })
                                        }
                                    />
                                </FormControl>
                                <FormControl mt="3" isRequired>
                                    <FormLabel>Há quanto tempo?</FormLabel>
                                    <Select value={userData.timePratice} placeholder='Selecione uma opção' onChange={(e) => setUserData({ ...userData, timePratice: e.target.value })}>
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
                                            value={userData?.modality}
                                            onChange={(e) =>
                                                setUserData({ ...userData, modality: e.target.value })
                                            }
                                        />
                                    </FormControl>)
                                }
                            </>
                        )}
                        <Button type='submit' mt='3' colorScheme='teal' float='right' >Salvar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}
