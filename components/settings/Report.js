import { Box, Card, Flex, FormLabel, Input, InputLeftAddon, Text, InputGroup, FormControl, Button, useToast, Checkbox, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { Select } from 'chakra-react-select'
import { getJsonReport } from '../../controllers/ReportController'
import { csv, excel, txt } from '../../utils/reports/RSSP-formats'
import xlsx from 'json-as-xlsx'
import { storeReport } from '../../services/reportServices'
import { json2csv } from 'json-2-csv'
import { jsonToPlainText } from 'json-to-plain-text'

export default function Report() {
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [tipo, setTipo] = useState([]);
    const [ format, setFormat ] = useState('');
    const toast = useToast();
    
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
                    data: {...res},
                    inicio: new Date(inicioTimestamp),
                    fim: new Date(fimTimestamp),
                    tipo: tipos,
                }
                storeReport(report);  
                if(format === 'xlsx'){
                    excel(res).then((res) => {
                        xlsx(res.sheet, res.settings);
                    }).catch((err) => {
                        throw err;
                    });
                }else if(format === 'csv'){
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
                }else if(format === 'txt'){
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
                }else if(format === 'tsv'){
                    csv(res).then((res) => {
                        const tsv = json2csv(res.formatted, {delimiter: '\t'});
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
            <Card mt='3' mx={['', '', '10%']} p='4' variant='elevated'>
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
                                <MenuItem type='submit' onClick={() => { setFormat('csv');  }} icon={<FiFileText />}>CSV</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('xlsx');  }} icon={<FiFileText />}>Excel</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('txt');  }} icon={<FiFileText />}>TXT</MenuItem>
                                <MenuItem type='submit' onClick={() => { setFormat('tsv');  }} icon={<FiFileText />}>TSV</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </form>
            </Card>
        </Box>
    )
}
