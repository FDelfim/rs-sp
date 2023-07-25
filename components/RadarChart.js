import { useColorModeValue, Card, Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RadarChart(props) {
  
  const valores  = props.series ?? [0,0,0,0,0]

  const colorMode = useColorModeValue('light', 'dark');
  const labelColor = colorMode === 'light' ? '#263238' : '#ffffff';
  const primaryRadarColor = colorMode === 'light' ? '#e9e9e9' : '#999999';
  const secondaryRadarColor = colorMode === 'light' ? '#ffffff' : '#5e6572';

  const options = {
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: '#e9e9e9',
          fill: {
            colors: [primaryRadarColor, secondaryRadarColor]
          }
        },
        offsetX: 10,
        offsetY: 10,
      }
    },
    chart: {
      toolbar: {
        show: false
      },
      autoSelected: "zoom"
    },
    xaxis: {
      categories: ['ES', 'ASF', 'RPC', 'E', 'ASE'],
      labels: {
        show: true,
        style: {
          colors: [labelColor, labelColor, labelColor, labelColor, labelColor],
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      show: false,
      min: 0,
      max: 15,
    },
    fill: {
      opacity: 0.4,
      colors: ['#319795']
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['#319795']
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
  }

  const series = [{
    data: valores,
  }]

  return (
    <Box w='100%' p='0' m='0'>
      <ApexCharts
        name='Resiliência no Esporte'
        options={options}
        series={series}
        type="radar"
      />
    </Box>
  );
}
