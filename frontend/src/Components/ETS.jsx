import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ETS.css';

const ETS = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ets_forecast');
        const data = response.data;
        console.log('Raw data:', data);

        const rows = data.split('\n').slice(1).map(row => row.split(','));
        console.log('Parsed rows:', rows);

        const labels = rows.map(row => row[0]);
        const forecast7Days = rows.map(row => parseFloat(row[1]));
        const forecast4Weeks = rows.map(row => parseFloat(row[2]));
        const forecast2Months = rows.map(row => parseFloat(row[3]));

        setChartData({
          labels,
          datasets: [
            {
              label: '7 Days Forecast',
              data: forecast7Days,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
              label: '4 Weeks Forecast',
              data: forecast4Weeks,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
              label: '2 Months Forecast',
              data: forecast2Months,
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
            },
          ],
        });
      } catch (error) {
        console.error("There was an error fetching the forecast data!", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Forecast Value'
        }
      }
    }
  };

  return (
    <div className='ETS-body'>
      <h2>ETS Forecast</h2>
      {chartData.labels ? (
        <div style={{ width: '800px', height: '400px' }}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ETS;
