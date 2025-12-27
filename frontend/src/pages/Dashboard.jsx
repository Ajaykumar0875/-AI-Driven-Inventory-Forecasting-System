import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
} from 'chart.js';
import { getSalesHistory, getProductAlerts } from '../services/api';
import { TrendingUp, AlertOctagon, Package, ArrowUpRight } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          getSalesHistory(),
          getProductAlerts()
        ]);
        setSales(salesRes.data);
        
        // Filter for active alerts only
        const activeAlerts = productsRes.data.filter(p => 
          p.currentStock <= p.reorderThreshold || 
          (p.latestAlert && p.latestAlert !== 'SAFE' && p.latestAlert !== 'UNKNOWN')
        );
        setAlerts(activeAlerts);
      } catch (error) {
        console.error("Dashboard Load Failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare Chart Data
  const chartData = {
    labels: sales.map(s => new Date(s.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Units Sold',
        data: sales.map(s => s.unitsSold),
        borderColor: '#3b82f6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500/20
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: '#334155', borderDash: [4, 4] },
        ticks: { color: '#64748b' }
      }
    }
  };

  // derived stats
  const totalSales = sales.reduce((acc, curr) => acc + curr.unitsSold, 0);
  const totalRevenue = totalSales * 150; // Mock price $150
  const activeProducts = new Set(sales.map(s => s.productId)).size;

  return (
    <div className="space-y-6">
       {/* Title */}
       <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
           Executive Overview
         </h2>
         <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
           Live Data
         </span>
       </div>

       {/* KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
             <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20" />
             <p className="text-slate-400 font-medium flex items-center gap-2">
               <TrendingUp size={18} className="text-blue-400" /> Total Revenue (Est)
             </p>
             <h3 className="text-4xl font-bold text-white mt-2">${totalRevenue.toLocaleString()}</h3>
             <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
               <ArrowUpRight size={14} /> +12.5% vs last month
             </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
             <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20" />
             <p className="text-slate-400 font-medium flex items-center gap-2">
               <Package size={18} className="text-purple-400" /> Units Sold
             </p>
             <h3 className="text-4xl font-bold text-white mt-2">{totalSales.toLocaleString()}</h3>
             <p className="text-sm text-slate-500 mt-2">
               Across {activeProducts} active products
             </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
             <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/20" />
             <p className="text-slate-400 font-medium flex items-center gap-2">
               <AlertOctagon size={18} className="text-amber-400" /> Stock Alerts
             </p>
             <h3 className="text-4xl font-bold text-white mt-2">{alerts.length}</h3>
             <p className="text-sm text-amber-400 mt-2">
               {alerts.length > 0 ? "Attention Needed" : "All Systems Normal"}
             </p>
          </div>
       </div>

       {/* Charts & Alerts Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl">
             <h3 className="text-lg font-semibold text-white mb-6">Sales Trend Analysis</h3>
             <div className="h-80 w-full">
                {sales.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    No sales data available. Please upload CSV.
                  </div>
                )}
             </div>
          </div>

          {/* Side Panel - Alerts */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl">
             <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-between">
                <span>Inventory Alerts</span>
                <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Priority</span>
             </h3>
             
             <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No alerts active.</p>
                ) : (
                  alerts.map((alert, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl flex items-start gap-3">
                       <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                          <AlertOctagon size={20} className="text-red-400" />
                       </div>
                       <div>
                          <h4 className="text-sm font-semibold text-white">{alert.productName}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                             Stock: <span className="text-red-300 font-medium">{alert.currentStock}</span> 
                             {' '}/ Threshold: {alert.reorderThreshold}
                          </p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;
