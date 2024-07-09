'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';
import {
  bgColorSkiFemale,
  bgColorSkiMale,
  bgColorSnowboardFemale,
  bgColorSnowboardMale,
  fgColorSkiFemale,
  fgColorSkiMale,
  fgColorSnowboardFemale,
  fgColorSnowboardMale,
} from '../../../common/colors';
import { Point } from '@repo/database';

type Props = {
  points: Point[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
);
export function PointChart(props: Props) {
  const data = {
    labels: props.points.map((point) => point.id),
    datasets: [
      {
        label: 'スキー男子',
        data: props.points.map((point) => point.pointSkiMale),
        borderColor: fgColorSkiMale,
        backgroundColor: bgColorSkiMale,
      },
      {
        label: 'スキー女子',
        data: props.points.map((point) => point.pointSkiFemale),
        borderColor: fgColorSkiFemale,
        backgroundColor: bgColorSkiFemale,
      },
      {
        label: 'スノボ男子',
        data: props.points.map((point) => point.pointSnowboardMale),
        borderColor: fgColorSnowboardMale,
        backgroundColor: bgColorSnowboardMale,
      },
      {
        label: 'スノボ女子',
        data: props.points.map((point) => point.pointSnowboardFemale),
        borderColor: fgColorSnowboardFemale,
        backgroundColor: bgColorSnowboardFemale,
      },
    ],
  };

  const fontSize = 14;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: '順位',
          font: {
            size: fontSize,
          },
        },
        ticks: {
          font: {
            size: fontSize,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'ポイント',
          font: {
            size: fontSize,
          },
        },
        ticks: {
          font: {
            size: fontSize,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: fontSize,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '60vh' }}>
      <Line data={data} options={options} />
    </div>
  );
}
