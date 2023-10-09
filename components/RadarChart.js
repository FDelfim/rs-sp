import { useColorModeValue, Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const translate = {
  'sportExperiences': 'ES',
  'familySocialSupport': 'ASF',
  'personalResources': 'RPC',
  'spirituality': 'ESPI',
  'sportSocialSupport': 'ASE',
}

export default function RadarChart(props) {
  const valores = props.series;

  const colorMode = useColorModeValue('light', 'dark');
  const labelColor = colorMode === 'light' ? '#263238' : '#ffffff';
  const primaryRadarColor = colorMode === 'light' ? '#e9e9e9' : '#999999';
  const secondaryRadarColor = colorMode === 'light' ? '#ffffff' : '#5e6572';

  const [keysValues, setKeysValues] = useState([]);

  useEffect(() => {
    const newKeysValues = Object.keys(valores)
      .filter((key) => key !== 'total')
      .sort()
      .map((key) => ({
        name: key,
        value: parseInt(valores[key]),
      }));
    setKeysValues(newKeysValues);
  }, [valores]);

  const options = {
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: '#e9e9e9',
          fill: {
            colors: [primaryRadarColor, secondaryRadarColor],
          },
        },
        offsetX: 10,
        offsetY: 10,
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      autoSelected: 'zoom',
    },
    xaxis: {
      categories: Object(keysValues.map((item) => translate[item.name])),
      labels: {
        show: true,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 15,
    },
    fill: {
      opacity: 0.4,
      colors: ['#319795'],
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['#319795'],
    },
    markers: {
      colors: ['#319795'],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    dataLabels: {
      enabled: true,
      background: {
        borderRadius: 3,
      },
      style: {
        colors: ['#319795'],
      },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            width: '100%',
            height: 300,
          },
        },
      },
    ],
  };

  const series = [
    {
      data: keysValues.map((item) => item.value),
    },
  ];

  return (
    <Box w="100%" p="0" m="0">
      <ApexCharts
        name="Resiliência no Esporte"
        options={options}
        series={series}
        type="radar"
      />
    </Box>
  );
}
