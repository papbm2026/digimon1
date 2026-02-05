
import React from 'react';
import { Keluhan, CleaningLog, MaintenanceLog, SecurityLog } from '../types';
import { ROOMS_F1, ROOMS_F2 } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
// Added missing MessageSquare and Wrench icons to imports
import { AlertCircle, CheckCircle2, Clock, Shield, Activity, Calendar, MessageSquare, Wrench } from 'lucide-react';

interface DashboardProps {
  keluhans: Keluhan[];
  cleaning: CleaningLog[];
  maintenance: MaintenanceLog[];
  security: SecurityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ keluhans, cleaning, maintenance, security }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Stats
  const pendingComplaints = keluhans.filter(k => k.status === 'Menunggu').length;
  const todayCleaning = cleaning.filter(c => c.tanggal === today).length;
  const totalRooms = ROOMS_F1.length + ROOMS_F2.length;
  const cleaningProgress = Math.round((todayCleaning / totalRooms) * 100) || 0;
  
  const lastSecurity = security[0];

  // Data for Charts
  const complaintData = [
    { name: 'Menunggu', value: keluhans.filter(k => k.status === 'Menunggu').length, color: '#ef4444' },
    { name: 'Proses', value: keluhans.filter(k => k.status === 'Proses').length, color: '#f59e0b' },
    { name: 'Selesai', value: keluhans.filter(k => k.status === 'Selesai').length, color: '#10b981' },
  ];

  const maintenanceStats = [
    { name: 'Gedung', count: maintenance.filter(m => m.item === 'Gedung').length },
    { name: 'Halaman', count: maintenance.filter(m => m.item === 'Halaman').length },
    { name: 'IT', count: maintenance.filter(m => ['PC', 'Laptop', 'Printer'].includes(m.item)).length },
    { name: 'AC', count: maintenance.filter(m => m.item === 'AC').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoring Panel</h1>
          <p className="text-slate-500">Overview performa sarana & prasarana hari ini</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2 text-emerald-700 font-medium">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Keluhan Baru</p>
            <h3 className="text-3xl font-bold mt-1">{pendingComplaints}</h3>
            <p className="text-xs text-red-500 mt-2 flex items-center">
              <AlertCircle size={12} className="mr-1" /> Membutuhkan tindak lanjut
            </p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Kebersihan Ruangan</p>
            <h3 className="text-3xl font-bold mt-1">{cleaningProgress}%</h3>
            <p className="text-xs text-emerald-500 mt-2 flex items-center">
              <CheckCircle2 size={12} className="mr-1" /> {todayCleaning} dari {totalRooms} ruangan
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Pemeliharaan Terakhir</p>
            <h3 className="text-lg font-bold mt-1 truncate max-w-[140px]">{maintenance[0]?.item || 'Belum ada'}</h3>
            <p className="text-xs text-slate-400 mt-2 italic">{maintenance[0]?.tanggal || '-'}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Shield size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Status Keamanan</p>
            <h3 className="text-lg font-bold mt-1">
              Shift {lastSecurity?.shift || '-'}
            </h3>
            <p className="text-xs text-blue-500 mt-2 flex items-center">
              <CheckCircle2 size={12} className="mr-1" /> Terlaporkan: {lastSecurity?.petugas || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Shield size={24} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center">
            <MessageSquare size={18} className="mr-2 text-emerald-600" />
            Status Keluhan & Saran
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complaintData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {complaintData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-slate-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center">
            <Wrench size={18} className="mr-2 text-amber-600" />
            Realisasi Pemeliharaan per Kategori
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-6">Aktivitas Terkini</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-semibold">Waktu</th>
                <th className="pb-4 font-semibold">Kategori</th>
                <th className="pb-4 font-semibold">Detail</th>
                <th className="pb-4 font-semibold">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {keluhans.slice(0, 5).map((k) => (
                <tr key={k.id} className="text-sm">
                  <td className="py-4 text-slate-500">{new Date(k.tanggal).toLocaleString('id-ID')}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      k.kategori === 'Kebersihan' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {k.kategori}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-slate-700">{k.deskripsi}</td>
                  <td className="py-4 text-slate-600">{k.pelapor}</td>
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
