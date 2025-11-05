import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import styles from './WeightPieChart.module.css';

const WeightPieChart = () => {
    const data = [
    { name: '포장재', value: 63.3, color: '#16A34A' },
    { name: '첨가물', value: 10.6, color: '#DC2626' },
    { name: '영양', value: 26.0, color: '#2563EB' },
  ];

  const renderCustomLabel = (entry) => {
    return `${entry.value}%`;
  };

  return (
    <div className={styles.chart_container}>
      <h2 className={styles.chart_title}>현재 가중치 분포</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#333"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.legend_container}>
        {data.map((item, index) => (
          <div key={index} className={styles.legend_item}>
            <div 
              className={styles.legend_color} 
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legend_text}>{item.name}</span>
            <span className={styles.legend_percent}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeightPieChart;