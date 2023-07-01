import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RadarChart(){

  const options ={
    xaxis : {
      categories: ['Experiências Esportivas', 'Apoio Social Familiar', 'Recursos Pessoais e Competências', 'Espiritualidade', 'Apoio Social Esportivo']
    },
    yaxis : {
      min: 0,
      max: 20,
    },
  }

  const series = [{
    name: 'Pontuação',
    data: [15, 10, 12, 14, 16]
  }]

  return(
    <ApexCharts
      options={options}
      series={series}
      type="radar"
    />
  );
}