import React, { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';
import '../styles/Analytics.css';

interface Service {
  id: number;
  type: string;
  location?: string;
}

interface PieDataItem {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC99', '#FF6666'];

const Analytics: React.FC<{ user: any }> = ({ user }) => {
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [displayBy, setDisplayBy] = useState<'category' | 'location'>('category');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.services, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch services');

        const data: Service[] = await response.json();

        const counts: { [key: string]: number } = {};
        data.forEach(service => {
          const key = displayBy === 'category' ? (service.type || 'Unknown') : (service.location || 'Unknown');
          counts[key] = (counts[key] || 0) + 1;
        });

        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value
        }));

        setPieData(chartData);
        setError('');
      } catch {
        setError('Failed to load analytics data.');
        setPieData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [displayBy]);

  const handleDownload = () => {
    if (pieData.length === 0) return;

    const csv = Papa.unparse(pieData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `services-by-${displayBy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="analytics-container">Loading analytics...</div>;
  if (error) return <div className="analytics-container error">{error}</div>;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>

        <p className="analytics-subtitle">
          {displayBy === 'location'
            ? 'Service Distribution by Location'
            : 'Service Distribution by Category'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
          <select
            value={displayBy}
            onChange={(e) => setDisplayBy(e.target.value as 'category' | 'location')}
          >
            <option value="category">Category</option>
            <option value="location">Location</option>
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
          </select>

          <button onClick={handleDownload} style={{ padding: '6px 12px', cursor: 'pointer' }}>
            Download CSV
          </button>
        </div>
      </div>

      {pieData.length === 0 ? (
        <p>No data to show</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={pieData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
