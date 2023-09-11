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
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => setIsOpen(false)} size="5xl">
      <ModalOverlay />
      <ModalContent p={['2','8']}>
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
          <Box overflowy='auto' dangerouslySetInnerHTML={{ __html: term }} style={{ WebkitOverflowScrolling: 'touch'}}></Box>
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
