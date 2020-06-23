import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosWithAuth } from '../../utils/auth/axiosWithAuth';
import '../../styles/mobile/Graph.scss';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const DesktopGraphs = () => {
  let [deviceList, setDeviceList] = useState([]);
  let [device, setDevice] = useState([]);
  let [dataList, setDataList] = useState([]);
  let [total, setTotal] = useState(0);
  let [totalUsage, setTotalUsage] = useState(0);
  useEffect(() => {
    axiosWithAuth()
      .get('https://localhost:3300/api/encon/appliances')
      .then((response) => {
        setDeviceList(response.data);
        response.data.map((appliances) => {
          device = [
            {
              Name: `${appliances.device}`,
            },
          ];
          setDevice(device);
        });
      })
      .catch((err) => {
        console.log('error getting appliance list', err);
      });
  }, []);
  useEffect(() => {
    deviceList.map((appliance) => {
      axios
        .get(
          `http://enconaq.eba-bqepxksk.us-east-1.elasticbeanstalk.com/${appliance.device}/${localStorage.USER_LOCATION}/${appliance.hours}/${appliance.days}`
        )
        .then((res) => {
          setTotal((total += res.data.cost_per_year));
          setTotalUsage((totalUsage = totalUsage + res.data.energy_used));
          dataList = [
            ...dataList,
            {
              Name: appliance.device,
              TotalCost: total,
              TotalUsage: totalUsage,
            },
          ];
          setDataList(dataList);
        })
        .catch((err) => {
          console.log('error getting appliance data', err);
        });
    });
  }, [device]);
  return (
    <div className='graphContainer' data-testid='EnergyChart'>
      <h2>Average Energy Output Per Appliance Per Month</h2>
      <LineChart
        className='energyGraph'
        width={1000}
        height={500}
        data={dataList}
        margin={{ top: 5, right: 20, bottom: 10, left: 0 }}
      >
        <Line
          type='monotone'
          dataKey='TotalUsage'
          stroke='purple'
          strokeWidth={2}
        />
        <CartesianGrid stroke='grey' strokeDasharray='10' />
        <XAxis tick={{ fontSize: 15 }} dataKey='Name' />
        <YAxis />
        <Tooltip content={dataList} tick={{ fontSize: 15 }} />
        <Legend />
      </LineChart>
      <h2>Average Expenses</h2>
      <BarChart
        className='energyGraph'
        width={1000}
        height={500}
        data={dataList}
        margin={{ top: 5, right: 20, bottom: 10, left: 0 }}
      >
        <Bar
          type='monotone'
          dataKey='TotalCost'
          stroke='green'
          fill='green'
          strokeWidth={2}
        />
        <CartesianGrid stroke='grey' strokeDasharray='10' />
        <XAxis tick={{ fontSize: 15 }} dataKey='Name' />
        <YAxis />
        <Tooltip content={dataList} tick={{ fontSize: 15000 }} />
        <Legend />
      </BarChart>
    </div>
  );
};

export default DesktopGraphs;
