import { Box, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getQuerionnaireTerm } from '../../services/questionnairesServices'
import { ModalHeader } from 'react-bootstrap';

export default function TermsModal({isOpen, setIsOpen}) {

  const [term, setTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getTerm = async () => {
    const termData = await getQuerionnaireTerm('1');
    setTerm(termData);
  }

  useEffect(() => {
    getTerm().then((result) => {
      setIsLoading(false);
    });
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="5xl">
      <ModalOverlay />
      <ModalContent p='8'>
        <ModalCloseButton />
        <ModalHeader>
            <Heading>Termos de Uso</Heading>
        </ModalHeader>
        <ModalBody>
          {
          isLoading ? 
          <Flex h='90vh' justifyContent='center' alignItems='center'>
            <Spinner size='xl' />
          </Flex>
          :
          <Box h='65vh' overflowY='scroll' dangerouslySetInnerHTML={{ __html: term }}></Box>
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
