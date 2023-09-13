import React from 'react'
import Layout from './../components/Layout';
import { Box, Card, CardBody, Flex, Text, Link } from '@chakra-ui/react';
import Footer from '../components/Footer';

export default function about() {
  return (
    <Layout>
      <Card mx={[4, 20]} my={[4, 5]} px='10' py='2'>
        <Text fontSize='3xl'>Bem-vindo(a)!</Text>
        <Text fontSize='2xl' fontWeight='bold'>Sobre mim</Text>
        <Text textAlign='justify'>
          Sou Camila Bicalho, Doutora em Ciências do Esporte com ênfase na Psicologia Esportiva.
          Sou apaixonada pelo esporte de alto rendimento e sempre acreditei no poder transformador que eles têm na vida das pessoas.
          Ao longo dos anos, mergulhei em pesquisas e estudos relacionados à psicologia esportiva, com foco especial na resiliência.
          Minha jornada nessa área me permitiu entender a importância da mentalidade resiliente para o desempenho e bem-estar dos atletas,
          tanto em suas carreiras esportivas como em suas vidas pessoais.
        </Text>
        <Text fontSize='2xl' fontWeight='bold'>Sobre o site</Text>
        <Text textAlign='justify'>
          Você encontrará um espaço dedicado à Resiliência Psicológica no esporte, com destaque para a Escala de Resiliência no Esporte (RS-Sp), desenvolvida por mim durante o meu doutorado. Você poderá ler mais sobre as evidências de validade dela em <Link href='http://www.ijsp-online.com/abstract/view/52/494'>http://www.ijsp-online.com/abstract/view/52/494</Link>.
        </Text>
        <Text textAlign='justify'>
          A RS-Sp uma ferramenta cuidadosamente desenvolvida para medir o nível de resiliência de atletas e praticantes de esportes voltados para o alto rendimento. A RS-Sp é composta por 15 itens distribuídos em cinco fatores essenciais:
        </Text>
        <Text textAlign='justify'>
          <i>Experiências Esportivas:</i> Representa a capacidade do atleta de perceber seus instintos e fortalecer os efeitos do estresse, bem como uma autoavaliação positiva das situações vivenciadas no cotidiano do esporte.
        </Text>
        <Text textAlign='justify'>
          <i>Recursos Pessoais e Competências:</i> Aborda a determinação e o autocontrole emocional do atleta em sua capacidade de se adaptar a situações desafiadoras ou estressantes nos esportes cotidianos.
        </Text>
        <Text textAlign='justify'>
          <i>Espiritualidade:</i> Representa o fortalecimento a partir da crença do atleta para enfrentar situações estressantes no esporte, proporcionando suporte interno.
        </Text>
        <Text textAlign='justify'>
          <i>Apoio Social Esportivo:</i> Indica a coesão e os laços colaborativos de treinadores e companheiros de equipe com o desempenho do atleta no esporte, reforçando a importância do ambiente esportivo de suporte.
        </Text>
        <Text textAlign='justify'>
          <i>Apoio Social Familiar:</i> Reflete a coesão e os laços colaborativos da família e amigos com o desempenho do atleta no esporte, fornecendo suporte emocional importante.
        </Text>
        <Text textAlign='justify'>
          A RS-Sp foi validada para a língua portuguesa e sua aplicação permite uma compreensão da resiliência de atletas em diferentes dimensões. Seus resultados têm a capacidade de identificar pontos fortes e áreas de melhoria em cada indivíduo, contribuindo significativamente para o desenvolvimento pessoal e desempenho esportivo.
        </Text>
        <Text textAlign='justify'>
          Neste site, além de conhecer mais sobre a RS-Sp e ter acesso gratuito à ela, você encontrará uma rica variedade de conteúdos relacionados à resiliência no esporte. De artigos informativos a estudos de caso inspiradores, dicas práticas e muito mais, meu objetivo é fornecer informações valiosas que ajudem atletas e praticantes a desenvolverem sua mentalidade resiliente.
        </Text>
        <Text textAlign='justify'>
          Este espaço não é apenas uma fonte de conhecimento, mas também um ponto de encontro para construir uma comunidade engajada. Encorajo você a compartilhar suas histórias, opiniões e dúvidas nos comentários dos artigos, contribuindo para o crescimento conjunto.
        </Text>
        <Text textAlign='justify'>
          Agradeço sua presença e interesse em aprender mais sobre resiliência no esporte. Espero que este site seja um espaço enriquecedor em sua jornada esportiva e pessoal.
        </Text>
        <Text textAlign='center'>
          "Com resiliência e determinação, você pode superar qualquer desafio e alcançar novas alturas em sua jornada esportiva e pessoal. Vamos juntos trilhar o caminho do sucesso!"
        </Text>
      </Card>
      <Footer/>
    </Layout>
  )
}
