import React from 'react'
import Layout from './../components/Layout';
import { Card, Text, Link } from '@chakra-ui/react';
import Footer from '../components/Footer';

export default function about() {
  return (
    <Layout>
      <Card mx={[4, 20]} my={[4, 5]} px='10' py='2'>
        <Text as='h1' fontSize='3xl'>Bem-vindo(a)!</Text>
        <Text as='h2' fontSize='2xl' fontWeight='bold'>Sobre mim</Text>
        <Text as='p' textAlign='justify'>
        Sou Camila Bicalho, Doutora em Ciências do Esporte com ênfase na Psicologia Esportiva. Sou apaixonada pelo esporte de rendimento e sempre acreditei no poder transformador que ele tem na vida das pessoas. Nos últimos anos, tenho me dedicado aos estudos relacionados à psicologia esportiva, com foco especial na resiliência. Minha jornada nesta área me permitiu entender a importância da mentalidade resiliente para o desempenho e bem-estar dos atletas, tanto em suas carreiras esportivas como em suas vidas pessoais.
        </Text>
        <Text as='h2' fontSize='2xl' fontWeight='bold'>Sobre o site</Text>
        <Text as='p' textAlign='justify'>
          Você encontrará um espaço dedicado à Resiliência Psicológica no esporte, com destaque para a Escala de Resiliência no Esporte (RS-Sp), desenvolvida por mim durante o meu doutorado. Você poderá ler mais sobre as evidências de validade dela em <Link href='http://www.ijsp-online.com/abstract/view/52/494'>http://www.ijsp-online.com/abstract/view/52/494</Link>.
        </Text>
        <Text as='p' textAlign='justify'>
          A RS-Sp uma ferramenta cuidadosamente desenvolvida para medir o nível de resiliência de atletas e praticantes de esportes voltados para o alto rendimento. A RS-Sp é composta por 15 itens distribuídos em cinco fatores essenciais:
        </Text>
        <Text as='p' textAlign='justify'>
          <i>Experiências Esportivas:</i> Representa a capacidade do atleta de perceber seus instintos e fortalecer os efeitos do estresse, bem como uma autoavaliação positiva das situações vivenciadas no cotidiano do esporte.
        </Text>
        <Text as='p' textAlign='justify'>
          <i>Recursos Pessoais e Competências:</i> Aborda a determinação e o autocontrole emocional do atleta em sua capacidade de se adaptar a situações desafiadoras ou estressantes nos esportes cotidianos.
        </Text>
        <Text as='p' textAlign='justify'>
          <i>Espiritualidade:</i> Representa o fortalecimento a partir da crença do atleta para enfrentar situações estressantes no esporte, proporcionando suporte interno.
        </Text>
        <Text as='p' textAlign='justify'>
          <i>Apoio Social Esportivo:</i> Indica a coesão e os laços colaborativos de treinadores e companheiros de equipe com o desempenho do atleta no esporte, reforçando a importância do ambiente esportivo de suporte.
        </Text>
        <Text as='p' textAlign='justify'>
          <i>Apoio Social Familiar:</i> Reflete a coesão e os laços colaborativos da família e amigos com o desempenho do atleta no esporte, fornecendo suporte emocional importante.
        </Text>
        <Text as='p' textAlign='justify'>
          A RS-Sp foi validada para a língua portuguesa e sua aplicação permite uma compreensão da resiliência de atletas em diferentes dimensões. Seus resultados têm a capacidade de identificar pontos fortes e áreas de melhoria em cada indivíduo, contribuindo significativamente para o desenvolvimento pessoal e desempenho esportivo.
        </Text>
        <Text as='p' textAlign='justify'>
          Neste espaço, além de conhecer mais sobre a RS-Sp e ter acesso gratuito a ela, você estará participando da pesquisa “Avaliação das Características Psicológicas, Sociais e Fisiológicas de Atletas, Paratletas e Treinadores”, registro 56920222.7.0000.5112. Os dados são sigilosos e você não será identificado. Para mais informações veja no Termo de Uso deste aplicativo.        </Text>
        <Text as='p' textAlign='justify'>
          Este espaço não é apenas uma fonte de conhecimento, mas também um ponto de encontro para construir uma comunidade engajada. Encorajo você a compartilhar suas histórias, opiniões e dúvidas nos comentários dos artigos, contribuindo para o crescimento conjunto.
        </Text>
        <Text as='p' textAlign='justify'>
          Agradeço seu interesse em aprender mais sobre a resiliência no esporte. Espero que este aplicativo seja um espaço enriquecedor em sua jornada esportiva e pessoal!        </Text>
        <Text as='p' textAlign='center'>
          "Com resiliência e determinação, você pode superar qualquer desafio e alcançar novas alturas em sua jornada esportiva e pessoal. Vamos juntos trilhar o caminho do sucesso!"
        </Text>
      </Card>
      <Footer/>
    </Layout>
  )
}
