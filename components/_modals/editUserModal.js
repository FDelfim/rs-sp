import { Button, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { updateUser } from '../../services/userServices'

export default function EditUserModal({ isOpen, onClose, user, update }) {

    const [userData, setUserData] = useState({});
    const [birthDate, setBirthDate] = useState(null);

    const toast = useToast();

    useEffect(() => { 
        if (user?.birthDate?.seconds) {
            setBirthDate(new Date(user.birthDate.seconds * 1000).toISOString().split('T')[0]);
            setUserData({ ...user });
        }
    }, [user])

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
                            <Input value={userData?.name} onChange={(e) => setUserData({...userData, name: e.target.value})} type="text" placeholder="Nome" />
                        </FormControl>
                        <FormControl mt="3" isRequired>
                            <FormLabel>Data de nascimento</FormLabel>
                            <Input type="date" placeholder="e.g. 01/01/2000" value={birthDate || ''} onChange={(e) => {
                                setBirthDate(e.target.value)
                                setUserData({ ...userData, birthDate: new Date(`${e.target.value}T00:00:00-03:00`) })
                                }}/>
                        </FormControl>
                        <FormControl mt="3" isRequired>
                            <FormLabel>Naturalidade</FormLabel>
                            <Input value={userData?.birthCity} type="text" placeholder="e.g. Belo Horizonte" onChange={(e) =>
                                setUserData({ ...userData, birthCity: e.target.value })
                            }
                            />
                        </FormControl>
                        <Button type='submit' mt='3' colorScheme='teal' float='right' >Salvar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}
