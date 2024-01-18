import { useColorModeValue, Box, FormErrorMessage } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
import { abbreviation } from '../utils/translates';


export default function RadarChart(props) {
  const valores = props.series;

  const colorMode = useColorModeValue('light', 'dark');
  const labelColor = colorMode === 'light' ? '#263238' : '#dfdfdf';
  const primaryRadarColor = colorMode === 'light' ? '#e9e9e9' : '#000000';
  const secondaryRadarColor = colorMode === 'light' ? '#ffffff' : '#2f2f2f';
  const strokeColor = colorMode === 'light' ? '#e9e9e9' : '#000000';
  const [series, setSeries ] = useState([]);

  const [keysValues, setKeysValues] = useState([]);

  useEffect(() => {
    const newKeysValues = Object.keys(valores[0])
      .filter((key) => key !== 'total')
      .sort()
      .map((key) => ({
        name: key,
        value: parseInt(valores[key]),
      }));
    setKeysValues(newKeysValues);
    
    const formattedData = Object.values(valores).map((key, index) => ({
      name: `Resposta ${index + 1}`,
      data: Object.keys(key).filter(k => k !== 'total').map(k => key[k])
    }));

    setSeries(formattedData);
  }, [valores]);

  const options = {
    colors: ['#319795', '#D3B041'],
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: strokeColor,
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
      categories: Object(keysValues.map((item) => abbreviation[item.name])),
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
    },
    stroke: {
      show: true,
      width: 4,
    },
    markers: {
      strokeColors: strokeColor,
      strokeWidth: 2,
    },
    dataLabels: {
      enabled: true,
      background: {
        borderRadius: 3,
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
