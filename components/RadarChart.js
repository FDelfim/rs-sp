import { useColorModeValue, Card, Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RadarChart() {
  const colorMode = useColorModeValue('light', 'dark');
  const labelColor = colorMode === 'light' ? '#263238' : '#ffffff';
  const primaryRadarColor = colorMode === 'light' ? '#e9e9e9' : '#1a202c';
  const secondaryRadarColor = colorMode === 'light' ? '#ffffff' : '#2d3748';

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
      width: 2,
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
        borderRadius: 2,
      },
      style: {
        colors: ['#319795'],
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
            height: 350,
          },
        },
      },
    ],
  }

  const series = [{
    data: [13, 10, 12, 14, 12]
  }]

  return (
      <ApexCharts
        name='Radar chart'
        options={options}
        series={series}
        type="radar"
      />
  );
}
