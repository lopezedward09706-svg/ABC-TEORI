
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { energy: 1, reality: 1.10, theory: 1.12 },
  { energy: 2, reality: 1.25, theory: 1.26 },
  { energy: 5, reality: 1.55, theory: 1.54 },
  { energy: 10, reality: 2.10, theory: 2.08 },
  { energy: 20, reality: 3.40, theory: 3.35 },
  { energy: 50, reality: 7.80, theory: 7.75 },
  { energy: 100, reality: 15.2, theory: 15.3 },
];

const ValidationChart: React.FC = () => {
  return (
    <div className="w-full h-[250px] bg-slate-900/50 p-4 rounded-xl border border-slate-700">
      <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Comparativa: Retardo Gamma (EeV vs s)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="energy" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={10} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="theory" name="ABC Prediction" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="reality" name="NASA Fermi Data" stroke="#06D6A0" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValidationChart;
