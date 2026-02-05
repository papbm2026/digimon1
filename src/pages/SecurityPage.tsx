
import React, { useState, useMemo } from 'react';
import { User, SecurityLog } from '../types';
import { SECURITY_STAFF, SECURITY_AREAS } from '../constants';
import { Shield, Plus, Printer, Check, X, Clock, MapPin, Lamp, Power, Lock, Key, Sun, Moon, AlertTriangle, UserCircle, CheckSquare, Square } from 'lucide-react';

interface Props {
  user: User;
  logs: SecurityLog[];
  onAdd: (log: SecurityLog) => void;
}

const SecurityPage: React.FC<Props> = ({ user, logs, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    petugas: SECURITY_STAFF[0],
    shift: 'Pagi' as SecurityLog['shift'],
    area: '' as SecurityLog['area'] | '',
    statusAman: true,
    isLampuMati: false,
    isElektronikOff: false,
    isPagarGembok: false,
    isPintuKunci: false,
    isLampuLuarHidup: false,
  });

  // Calculate used areas for the current shift and day to prevent duplicates
  const usedAreas = useMemo(() => {
    return logs
      .filter(l => l.tanggal === today && l.shift === formData.shift)
      .map(l => l.area);
  }, [logs, today, formData.shift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.area) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      tanggal: today,
      ...formData as SecurityLog
    });
    
    setShowForm(false);
    setFormData({
      ...formData,
      area: '',
      statusAman: true,
      isLampuMati: false,
      isElektronikOff: false,
      isPagarGembok: false,
      isPintuKunci: false,
      isLampuLuarHidup: false,
    });
  };

  const getShiftLabel = (shift: SecurityLog['shift']) => {
    if (shift === 'Pagi') return '07:00 - 12:00';
    if (shift === 'Siang') return '13:00 - 18:00';
    return '19:00 - 06:00';
  };

  // Fixed: Cast SECURITY_AREAS to SecurityLog['area'][] to prevent type mismatch in includes and setFormData
  const availableAreas = useMemo(() => {
    return (SECURITY_AREAS as SecurityLog['area'][]).filter(area => {
      // Area Gedung only for Malam
      if (area === 'Gedung' && formData.shift !== 'Malam') return false;
      // Other areas for any shift
      return true;
    });
  }, [formData.shift]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Keamanan</h1>
          <p className="text-slate-500">Log harian petugas keamanan (Mirza, Irfan, Eka, Inten)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => window.print()} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer size={18} />
            <span>Cetak Laporan</span>
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            <span>{showForm ? 'Batal' : 'Input Laporan'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl no-print animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Petugas Selection */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Petugas Bertugas</label>
                <div className="grid grid-cols-2 gap-3">
                  {SECURITY_STAFF.map(name => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, petugas: name })}
                      className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${
                        formData.petugas === name 
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      <UserCircle size={20} className={formData.petugas === name ? 'text-blue-600' : 'text-slate-300'} />
                      <span className="text-sm font-bold">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift Selection */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Waktu</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Pagi', 'Siang', 'Malam'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, shift: s, area: '' })}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        formData.shift === s 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      {s === 'Pagi' && <Sun size={20} className="mb-2" />}
                      {s === 'Siang' && <Clock size={20} className="mb-2" />}
                      {s === 'Malam' && <Moon size={20} className="mb-2" />}
                      <span className="text-xs font-bold">{s}</span>
                      <span className="text-[9px] opacity-70 mt-1">{getShiftLabel(s)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Area Selection with Locking Logic */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                Pilih Area Penjagaan
                <span className="ml-2 normal-case text-slate-400 font-normal">(Satu petugas satu area per shift)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableAreas.map(area => {
                  const isTaken = usedAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setFormData({ ...formData, area: area })}
                      className={`relative flex flex-col items-center p-5 rounded-3xl border-2 transition-all group ${
                        formData.area === area 
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md' 
                          : isTaken 
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300'
                      }`}
                    >
                      <MapPin size={24} className={`mb-2 ${formData.area === area ? 'text-blue-600' : isTaken ? 'text-slate-200' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span className="text-sm font-bold text-center">{area}</span>
                      {isTaken && (
                        <div className="absolute top-2 right-2">
                          <AlertTriangle size={14} className="text-red-300" />
                        </div>
                      )}
                      {isTaken && <span className="text-[8px] mt-1 text-red-400 font-bold">SUDAH TERISI</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shift Malam Specific Checklist */}
            {formData.shift === 'Malam' && formData.area === 'Gedung' && (
              <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Moon size={20} />
                  <h4 className="font-bold">Checklist Keamanan Gedung (Shift Malam)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'isLampuMati', label: 'Lampu Tidak Terpakai Mati', icon: <Lamp size={18} /> },
                    { id: 'isElektronikOff', label: 'Elektronik / PC Off', icon: <Power size={18} /> },
                    { id: 'isPagarGembok', label: 'Pagar Utama Digembok', icon: <Lock size={18} /> },
                    { id: 'isPintuKunci', label: 'Pintu Gedung Dikunci', icon: <Key size={18} /> },
                    { id: 'isLampuLuarHidup', label: 'Lampu Luar Dihidupkan', icon: <Sun size={18} /> },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, [item.id]: !formData[item.id as keyof typeof formData] })}
                      className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ${
                        formData[item.id as keyof typeof formData] 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={formData[item.id as keyof typeof formData] ? 'text-blue-100' : 'text-slate-300'}>
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold text-left flex-1">{item.label}</span>
                      {formData[item.id as keyof typeof formData] ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!formData.area}
              className={`w-full py-5 rounded-2xl font-bold shadow-xl transition-all ${
                !formData.area 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-800 text-white hover:bg-blue-900 shadow-blue-200 hover:-translate-y-1'
              }`}
            >
              Simpan Laporan Keamanan
            </button>
          </form>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center text-lg">
            <Shield size={20} className="mr-3 text-blue-600" />
            Riwayat Monitoring Keamanan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Tanggal & Shift</th>
                <th className="px-8 py-5">Petugas</th>
                <th className="px-8 py-5">Area</th>
                <th className="px-8 py-5">Status / Checklist Malam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700">{l.tanggal}</p>
                    <div className="flex items-center mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold uppercase mr-2">
                        {l.shift}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">{getShiftLabel(l.shift)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <UserCircle size={16} className="text-slate-300" />
                      <span className="font-bold text-slate-700">{l.petugas}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                      <MapPin size={10} className="mr-1" /> {l.area}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {l.shift === 'Malam' && l.area === 'Gedung' ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-bold">
                        <span className={l.isLampuMati ? 'text-emerald-600' : 'text-red-500'}>Lampu: {l.isLampuMati ? 'OFF ✓' : 'ON ✗'}</span>
                        <span className={l.isElektronikOff ? 'text-emerald-600' : 'text-red-500'}>Elektronik: {l.isElektronikOff ? 'OFF ✓' : 'ON ✗'}</span>
                        <span className={l.isPagarGembok ? 'text-emerald-600' : 'text-red-500'}>Pagar: {l.isPagarGembok ? 'GEMBOK ✓' : 'BUKA ✗'}</span>
                        <span className={l.isPintuKunci ? 'text-emerald-600' : 'text-red-500'}>Pintu: {l.isPintuKunci ? 'KUNCI ✓' : 'BUKA ✗'}</span>
                        <span className={l.isLampuLuarHidup ? 'text-emerald-600' : 'text-red-500'}>Lampu Luar: {l.isLampuLuarHidup ? 'ON ✓' : 'OFF ✗'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-emerald-600 font-bold">
                        <Check size={14} className="mr-1" /> AMAN & TERKONTROL
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center opacity-30">
                    <Shield size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400 font-medium italic">Belum ada laporan keamanan hari ini</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
