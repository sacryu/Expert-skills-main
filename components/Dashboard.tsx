import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { RECENT_EXECUTIONS } from '../constants';

const data = [
  { name: '08:00', success: 40, latency: 240 },
  { name: '09:00', success: 30, latency: 139 },
  { name: '10:00', success: 20, latency: 980 },
  { name: '11:00', success: 27, latency: 390 },
  { name: '12:00', success: 18, latency: 480 },
  { name: '13:00', success: 23, latency: 380 },
  { name: '14:00', success: 34, latency: 430 },
];

const KPICard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">{icon}</div>
    </div>
    <div className="flex items-baseline">
      <div className="text-3xl font-bold text-slate-800">{value}</div>
      {trend && <div className="ml-2 text-sm text-green-600 font-medium">{trend}</div>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="总执行次数" value="1,284" icon={<Activity size={20} />} trend="+12%" />
        <KPICard title="成功率" value="98.2%" icon={<CheckCircle size={20} />} trend="+0.4%" />
        <KPICard title="平均时延" value="342ms" icon={<Clock size={20} />} trend="-15ms" />
        <KPICard title="活跃技能" value="42" icon={<AlertTriangle size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">执行性能趋势</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="success" stroke="#4f46e5" strokeWidth={3} dot={false} name="请求数/分" />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#fbbf24" strokeWidth={3} dot={false} name="时延 (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[400px]">
           <h3 className="text-lg font-semibold text-slate-800 mb-6">技能调用分布</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey="success" fill="#4f46e5" radius={[4, 4, 0, 0]} name="调用次数" />
            </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">近期任务</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <th className="px-6 py-4">任务 ID</th>
                <th className="px-6 py-4">任务描述</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">调用技能</th>
                <th className="px-6 py-4">耗时</th>
                <th className="px-6 py-4">结果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {RECENT_EXECUTIONS.map((exec) => (
                <tr key={exec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-600">{exec.id}</td>
                  <td className="px-6 py-4">{exec.task_text}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exec.status === 'success' ? 'bg-green-100 text-green-800' : 
                      exec.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {exec.skills_used.map(s => (
                      <span key={s} className="mr-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">{s}</span>
                    ))}
                  </td>
                  <td className="px-6 py-4">{exec.duration}ms</td>
                  <td className="px-6 py-4 truncate max-w-xs" title={exec.result_summary}>{exec.result_summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;