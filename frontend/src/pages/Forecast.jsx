import React, { useEffect, useState } from 'react';
import { generateForecast, getForecasts } from '../services/api';
import { toast } from 'sonner';
import { Sparkles, Download, AlertTriangle, CheckCircle, RefreshCcw, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Forecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const response = await getForecasts();
      setForecasts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load forecasts');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await generateForecast();
      toast.success(response.data.message || 'Forecasts generated successfully!');
      fetchForecasts(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error('Forecast generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Forecast Report', 14, 20);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = forecasts.map(f => [
      f.productId,
      f.productName || f.product || 'N/A',
      f.region,
      f.predictedDemand,
      f.alertStatus
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Product Name', 'Region', 'Demand', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 163, 74] } 
    });

    doc.save('inventory-forecast.pdf');
    toast.success('PDF Report Downloaded');
  };

  const getStatusColor = (status) => {
    if (status === 'REORDER_REQUIRED') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (status === 'LOW_STOCK') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">AI Forecast Analysis</h2>
          <p className="text-slate-400 mt-1">Predictive insights powered by Groq API (Llama 3)</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchForecasts}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw size={20} />
          </button>
          
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`
              px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all
              ${generating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
              }
            `}
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Run AI Forecast
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-slate-200">Forecast Results</h3>
          {forecasts.length > 0 && (
             <button 
                onClick={exportPDF}
                className="text-sm flex items-center gap-2 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors"
             >
                <Download size={16} /> Export PDF
             </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
             <Loader2 size={32} className="animate-spin mx-auto mb-4" />
             <p>Loading data...</p>
          </div>
        ) : forecasts.length === 0 ? (
          <div className="p-16 text-center">
             <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertTriangle size={32} className="text-slate-500" />
             </div>
             <h4 className="text-lg font-medium text-white mb-2">No Forecasts Available</h4>
             <p className="text-slate-400 max-w-sm mx-auto">
               Click "Run AI Forecast" to analyze your sales data and generate predictions.
             </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercas tracking-wider">
                  <th className="px-6 py-4 font-medium">Product ID</th>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Region</th>
                  <th className="px-6 py-4 font-medium">Period</th>
                  <th className="px-6 py-4 font-medium text-right">Pred. Demand</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {forecasts.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{f.productId}</td>
                    <td className="px-6 py-4 text-slate-300">{f.productName || f.product || 'N/A'}</td>
                    <td className="px-6 py-4">{f.region}</td>
                    <td className="px-6 py-4 text-sm">{f.forecastPeriod}</td>
                    <td className="px-6 py-4 text-right font-mono text-blue-300">
                      {f.predictedDemand.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                       <span className={`
                          px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                          ${getStatusColor(f.alertStatus)}
                       `}>
                          {f.alertStatus === 'SAFE' && <CheckCircle size={12} />}
                          {f.alertStatus === 'LOW_STOCK' && <AlertTriangle size={12} />}
                          {f.alertStatus === 'REORDER_REQUIRED' && <AlertTriangle size={12} />}
                          {f.alertStatus.replace('_', ' ')}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
