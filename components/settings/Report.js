import { Box, Card, Flex, FormLabel, Input, InputLeftAddon, Text, InputGroup, FormControl, Button, useToast, Checkbox, Menu, MenuButton, MenuList, MenuItem, Heading } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiDownload, FiFileText } from 'react-icons/fi'
import { Select } from 'chakra-react-select'
import { getJsonReport } from '../../controllers/ReportController'
import { csv, excel, txt } from '../../utils/reports/RSSP-formats'
import xlsx from 'json-as-xlsx'
import { storeReport } from '../../services/reportServices'
import { json2csv } from 'json-2-csv'
import { jsonToPlainText } from 'json-to-plain-text'
import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Badge } from '@chakra-ui/react'


const reportsCollection = collection(db, 'reports');

const getHistory = async ({ page }) => {
    const pageSize = 5;
    let result = []
    try {
        const querySnapshot = await getDocs(query(reportsCollection, limit(pageSize), orderBy('created_at'), startAt(pageSize * (page - 1))));
        querySnapshot.docs.map((doc) => {
            result.push(doc.data());
        });
    } catch (err) {
        throw err;
    }
    return result;
}

export default function Report() {
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [tipo, setTipo] = useState([]);
    const [format, setFormat] = useState('');
    const [recent, setRecent] = useState([]);
    const toast = useToast();

    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);

    const handleDownload = (format, report) => {

        let answers = [];

        Object.values(report).forEach((data) => {
            answers.push(data);
        });

        if (format === 'xlsx') {
            excel(answers).then((answers) => {
                xlsx(answers.sheet, answers.settings);
            }).catch((err) => {
                throw err;
            });
        } else if (format === 'csv') {
            csv(answers).then((answers) => {
                const csv = json2csv(answers.formatted);
                const blob = new Blob([csv], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Relatório ${answers.questionnaireName}.csv`;
                link.click();
            }).catch((err) => {
                throw err;
            })
        } else if (format === 'txt') {
            txt(answers).then((answers) => {
                const txt = jsonToPlainText(answers.formatted);
                const blob = new Blob([txt], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Relatório ${answers.questionnaireName}.txt`;
                link.click();
            }).catch((err) => {
                throw err;
            })
        } else if (format === 'tsv') {
            csv(answers).then((answers) => {
                const tsv = json2csv(answers.formatted, { delimiter: '\t' });
                const blob = new Blob([tsv], { type: 'text/tsv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Relatório ${answers.questionnaireName}.tsv`;
                link.click();
            }).catch((err) => {
                throw err;
            })
        }
    }

    useEffect(() => {
        const getData = async () => {
            setHistory(await getHistory({ page }));
        }
        getData();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const inicioTimestamp = new Date(inicio).getTime();
        const fimTimestamp = new Date(fim).getTime();

        if (inicioTimestamp > fimTimestamp) {
            toast({
                title: 'Atenção',
                description: 'A data de início deve ser anterior à data de fim.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const tipos = tipo.map((t) => t.value);

        const data = {
            inicio: inicioTimestamp,
            fim: fimTimestamp,
            tipo: tipos
        };

        try {
            getJsonReport(data).then((res) => {
                let report = {
                    data: { ...res },
                    inicio: new Date(inicioTimestamp),
                    fim: new Date(fimTimestamp),
                    tipo: tipos,
                    created_at: new Date(),
                }
                storeReport(report);
                setRecent(report);
                if (format === 'xlsx') {
                    excel(res).then((res) => {
                        xlsx(res.sheet, res.settings);
                    }).catch((err) => {
                        throw err;
                    });
                } else if (format === 'csv') {
                    csv(res).then((res) => {
                        const csv = json2csv(res.formatted);
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `Relatório ${res.questionnaireName}.csv`;
                        link.click();
                    }).catch((err) => {
                        throw err;
                    })
                } else if (format === 'txt') {
                    txt(res).then((res) => {
                        const txt = jsonToPlainText(res.formatted);
                        const blob = new Blob([txt], { type: 'text/plain' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `Relatório ${res.questionnaireName}.txt`;
                        link.click();
                    }).catch((err) => {
                        throw err;
                    })
                } else if (format === 'tsv') {
                    csv(res).then((res) => {
                        const tsv = json2csv(res.formatted, { delimiter: '\t' });
                        const blob = new Blob([tsv], { type: 'text/tsv' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `Relatório ${res.questionnaireName}.tsv`;
                        link.click();
                    }).catch((err) => {
                        throw err;
                    })
                }
            }).catch((err) => {
                throw err;
            });
        } catch (error) {
            toast({
                title: 'Erro ao gerar relatório',
                description: 'Não foi possível gerar o relatório',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Box m={['2']}>
            <Box bgColor={'teal.500'} color={'#fff'} p='5' borderRadius={'md'} boxShadow={'sm'}>
                <Flex alignItems='center'>
                    <FiFileText size={'35'} /><Text my='0' fontSize={'2xl'} ps='2'>Relatórios</Text>
                </Flex>
            </Box>
            <Card mt='3' mx={['', '', '', '10%']} p='4' variant='elevated'>
                <Text fontSize='xl' mb='0' fontWeight='bold'>Relatório de respostas</Text>
                <form onSubmit={handleSubmit}>
                    <FormControl mt='4' isRequired>
                        <FormLabel>Período:</FormLabel>
                        <Flex>
                            <InputGroup>
                                <InputLeftAddon children="De" />
                                <Input type='date' onChange={(e) => { setInicio(e.target.value) }} />
                                <InputLeftAddon children="Até" />
                                <Input type='date' onChange={(e) => { setFim(e.target.value) }} />
                            </InputGroup>
                        </Flex>
                    </FormControl>
                    <FormControl mt='4' isRequired>
                        <FormLabel>Tipo de atleta</FormLabel>
                        <Select placeholder='Selecione pelo menos uma opção...'
                            options={[
                                { value: 'Profissional', label: 'Profissional' },
                                { value: 'Amador', label: 'Amador' },
                                { value: 'null', label: 'Não atleta' }
                            ]}
                            isMulti={true}
                            onChange={(e) => { setTipo(e) }}
                        />
                    </FormControl>
                    <Box w='100%'>
                        <Menu w='100%'>
                            <MenuButton w='100%' as={Button} mt='4' colorScheme='teal' rightIcon={<FiFileText />}>
                                Gerar relatório
                            </MenuButton>
                            <MenuList>
                                <MenuItem type='submit' onClick={() => { setFormat('csv'); }} icon={<FiFileText />}>CSV</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('xlsx'); }} icon={<FiFileText />}>Excel</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('txt'); }} icon={<FiFileText />}>TXT</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('tsv'); }} icon={<FiFileText />}>TSV</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </form>
            </Card>
            <Card mt='5' mx={['', '', '', '10%']} p='4' variant='elevated'>
                <Heading fontSize='xl' mb='0' fontWeight='bold'>Relatórios gerados</Heading>
                <>
                    <Flex justifyContent='end'>
                        <Button colorScheme='teal' onClick={() => { setPage(page - 1) }}><FiArrowLeft /></Button>
                        <Button colorScheme='teal' onClick={() => { setPage(page + 1) }} ml='2'><FiArrowRight /></Button>
                    </Flex>
                    {
                        recent.data && <>
                            <Card variant='filled' shadow={'md'} p='4' mt='2' key={recent.created_at.seconds}>
                                <Flex justifyContent='end'>
                                    <Badge float={'right'} display='flex' colorScheme='purple'>Novo</Badge>
                                </Flex>
                                <Text my='0' fontSize={['sm', 'md']} fontWeight={'bold'}>Relatório {new Date(recent.created_at).toLocaleDateString()}</Text>
                                <Text my='0' fontSize={['sm', 'md']}><b>Período:</b> {new Date(recent.inicio).toLocaleDateString()} - {new Date(recent.fim).toLocaleDateString()}</Text>
                                <Text my='0' fontSize={['sm', 'md']}><b>Tipos de atletas:</b> {recent.tipo.map((tipo) => tipo !== 'null' ? tipo : 'Não atleta').join(', ')}</Text>
                                <Flex w='100%' justifyContent='center'>
                                    <Box w='50%'>
                                        <Menu w='100%'>
                                            <MenuButton w='100%' as={Button} mt='4' colorScheme='teal' rightIcon={<FiDownload />}>
                                                Fazer download
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem type='submit' onClick={() => { handleDownload('csv', recent.data); }} icon={<FiDownload />}>CSV</MenuItem>
                                                <MenuItem type='submit' onClick={() => { handleDownload('xlsx', recent.data); }} icon={<FiDownload />}>Excel</MenuItem>
                                                <MenuItem type='submit' onClick={() => { handleDownload('txt', recent.data); }} icon={<FiDownload />}>TXT</MenuItem>
                                                <MenuItem type='submit' onClick={() => { handleDownload('tsv', recent.data); }} icon={<FiDownload />}>TSV</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                </Flex>
                            </Card>

                        </>
                    }
                    {
                        history.map((report) => {
                            return (
                                <Card variant='filled' shadow={'md'} p='4' mt='2' key={report.created_at.seconds}>
                                    <Text my='0' fontSize={['sm', 'md']} fontWeight={'bold'}>Relatório {new Date(report.created_at.seconds * 1000).toLocaleDateString()}</Text>
                                    <Text my='0' fontSize={['sm', 'md']}><b>Período:</b> {new Date(report.inicio.seconds * 1000).toLocaleDateString()} - {new Date(report.fim.seconds * 1000).toLocaleDateString()}</Text>
                                    <Text my='0' fontSize={['sm', 'md']}><b>Tipos de atletas:</b> {report.tipo.map((tipo) => tipo !== 'null' ? tipo : 'Não atleta').join(', ')}</Text>
                                    <Flex w='100%' justifyContent='center'>
                                        <Box w='50%'>
                                            <Menu w='100%'>
                                                <MenuButton w='100%' as={Button} mt='4' colorScheme='teal' rightIcon={<FiDownload />}>
                                                    Fazer download
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem type='submit' onClick={() => { handleDownload('csv', report.data); }} icon={<FiDownload />}>CSV</MenuItem>
                                                    <MenuItem type='submit' onClick={() => { handleDownload('xlsx', report.data); }} icon={<FiDownload />}>Excel</MenuItem>
                                                    <MenuItem type='submit' onClick={() => { handleDownload('txt', report.data); }} icon={<FiDownload />}>TXT</MenuItem>
                                                    <MenuItem type='submit' onClick={() => { handleDownload('tsv', report.data); }} icon={<FiDownload />}>TSV</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Box>
                                    </Flex>
                                </Card>
                            )
                        })
                    }
                </>
            </Card>
        </Box>
    )
}
