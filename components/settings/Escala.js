import React, { useEffect, useState } from 'react'
import { Box, Card, CardBody, CardFooter, Flex, Heading, Image, Skeleton, Text, useToast, Button, Grid, GridItem, Input, useMultiStyleConfig, useColorModeValue, Breadcrumb, BreadcrumbItem, BreadcrumbLink, CardHeader, FormControl, FormLabel, Divider } from '@chakra-ui/react';
import { FiTrendingUp } from 'react-icons/fi'

export default function Escala() {

    const ranges = [
        { name: 'Extremamente baixo', value: 'extremelyLow' },
        { name: 'Baixo', value: 'low' },
        { name: 'Moderado', value: 'moderate' },
        { name: 'Alto', value: 'high' },
        { name: 'Extremamente alto', value: 'extremelyHigh' }
    ]

    const dimensions = [
        { name: 'Experiências Esportivas', value: 'sportExperiences' },
        { name: 'Apoio social familiar', value: 'familySocialSupport' },
        { name: 'Recursos pessoais e competências', value: 'personalResources' },
        { name: 'Espiritualidade', value: 'spirituality' },
        { name: 'Apoio social esportivo', value: 'sportSocialSupport' },
        { name: 'ERE - Total', value: 'total' }
    ]

    const toast = useToast();

    const [professionalScale, setProfessionalScale] = useState({
        sportExperiences: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' },
        familySocialSupport: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' },
        personalResources: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' },
        spirituality: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' },
        sportSocialSupport: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' },
        total: { extremelyLow: '', low: '', moderate: '', high: '', extremelyHigh: '' }
    });

    const fetchProfessionalScale = () => {
        fetch('/api/settings/scale?id=professionalScale', {
            method: 'GET',
        }).then((res) => res.json())
            .then((data) => {
                data.error ? null : setProfessionalScale(data)
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

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/settings/scale', {
            method: 'POST',
            body: JSON.stringify({ id: 'professionalScale', data: professionalScale })
        }).then((res) => res.json())
            .then((data) => {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
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

    useEffect(() => {
        fetchProfessionalScale();
    }, [])

    return (
        <Box m={['2']}>
            <Box bgColor={'teal.500'} color={'#fff'} p='5' borderRadius={'md'} boxShadow={'sm'}>
                <Flex alignItems='center'>
                    <FiTrendingUp size={'35'} /><Text my='0' fontSize={'2xl'} ps='2'>Escala</Text>
                </Flex>
            </Box>
            <Card mt='3'>
                <CardHeader pb='0'>
                    <Text fontSize={'3xl'} fontWeight='bold'>Escala para atletas profissionais</Text>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody pt='0'>
                        {
                            dimensions.map((dimension) => (
                                <Box key={dimension.value}>
                                    <Text fontSize={'2xl'}>{dimension.name}</Text>
                                    <Grid templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(5, 1fr)']} gap='4'>
                                        {
                                            ranges.map((range) => (
                                                <GridItem key={range.value}>
                                                    <FormControl>
                                                        <FormLabel>{range.name}</FormLabel>
                                                        <Input value={professionalScale[dimension.value][range.value]}
                                                            type='number' placeholder='e.g. 9,2' onChange={(e) => {
                                                                setProfessionalScale({ ...professionalScale, [dimension.value]: { ...professionalScale[dimension.value], [range.value]: e.target.value } })
                                                             }} />
                                                    </FormControl>
                                                </GridItem>
                                            ))
                                        }
                                    </Grid>
                                    <Divider my='4' />
                                </Box>
                            ))
                        }
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" w='100%' colorScheme='teal' size='sm'>Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </Box>
    )
}
