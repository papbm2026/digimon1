
import React, { useState, useMemo } from 'react';
import { User, CleaningLog } from '../types';
import { ROOMS_F1, ROOMS_F2, ROOM_ASSIGNMENTS } from '../constants';
import { Brush, Check, X, Printer, Calendar, Plus, Square, CheckSquare, AlertCircle, Droplets, Trash2, Wind, Sparkles } from 'lucide-react';

interface Props {
  user: User;
  logs: CleaningLog[];
  onAdd: (log: CleaningLog) => void;
}

const STANDARD_TASKS = [
  { id: 'lantai', label: 'Lantai Bersih & Dipel', icon: <Brush size={16} /> },
  { id: 'debu', label: 'Meja/Kaca Bebas Debu', icon: <Sparkles size={16} /> },
  { id: 'sampah', label: 'Tempat Sampah Dikosongkan', icon: <Trash2 size={16} /> },
  { id: 'pewangi', label: 'Pewangi Ruangan Terisi', icon: <Wind size={16} /> }
];

const TOILET_TASKS = [
  { id: 'lantai_toilet', label: 'Lantai Bersih & Tidak Licin', icon: <Brush size={16} /> },
  { id: 'kloset', label: 'Kloset/Urinal Bersih (Tidak Berkerak)', icon: <Droplets size={16} /> },
  { id: 'wastafel', label: 'Wastafel & Cermin Bersih', icon: <Sparkles size={16} /> },
  { id: 'stok', label: 'Air/Sabun/Tisu Tersedia Cukup', icon: <Droplets size={16} /> }
];

const CleaningChecklist: React.FC<Props> = ({ user, logs, onAdd }) => {
  const [selectedLantai, setSelectedLantai] = useState<1 | 2>(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const isToilet = (roomName: string) => roomName.toLowerCase().includes('toilet');
  const currentTasks = isToilet(selectedRoom) ? TOILET_TASKS : STANDARD_TASKS;

  const rooms = selectedLantai === 1 ? ROOMS_F1 : ROOMS_F2;
  const today = new Date().toISOString().split('T')[0];
  
  const todayLogs = useMemo(() => logs.filter(l => l.tanggal === today), [logs, today]);
  const roomsDone = useMemo(() => todayLogs.map(l => l.ruangan), [todayLogs]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const currentPIC = selectedRoom ? ROOM_ASSIGNMENTS[selectedRoom]?.pic : '-';
  const allTasksDone = completedTasks.length === currentTasks.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      tanggal: today,
      lantai: selectedLantai,
      ruangan: selectedRoom,
      picPetugas: currentPIC,
      petugasChecklist: user.name,
      isClean: allTasksDone,
      catatan: catatan || (allTasksDone ? 'Semua tugas selesai' : 'Beberapa tugas belum selesai')
    });

    setSelectedRoom('');
    setCatatan('');
    setCompletedTasks([]);
    setShowForm(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Checklist Kebersihan</h1>
          <p className="text-slate-500">Monitoring oleh Petugas Checklist: {user.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Printer size={18} />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            <span>{showForm ? 'Batal' : 'Input Checklist'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 no-print">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lantai</label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  value={selectedLantai}
                  onChange={e => { setSelectedLantai(Number(e.target.value) as 1 | 2); setSelectedRoom(''); setCompletedTasks([]); }}
                >
                  <option value={1}>Lantai 1</option>
                  <option value={2}>Lantai 2</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ruangan</label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  value={selectedRoom}
                  onChange={e => { setSelectedRoom(e.target.value); setCompletedTasks([]); }}
                >
                  <option value="">Pilih Ruangan</option>
                  {rooms.map(r => (
                    <option key={r} value={r} disabled={roomsDone.includes(r)}>
                      {r} {roomsDone.includes(r) ? '(SUDAH DICEK)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PIC Petugas Kebersihan</label>
                <div className="w-full px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold">
                  {currentPIC}
                </div>
              </div>
            </div>

            {selectedRoom && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Item Checklist {isToilet(selectedRoom) ? 'Khusus Toilet' : 'Kebersihan Ruangan'}
                  </label>
                  {isToilet(selectedRoom) && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Mode Toilet</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTasks.map(task => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        completedTasks.includes(task.id) 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm shadow-emerald-100' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${completedTasks.includes(task.id) ? 'text-emerald-600' : 'text-slate-300'}`}>
                          {task.icon}
                        </div>
                        <span className="font-semibold text-sm">{task.label}</span>
                      </div>
                      {completedTasks.includes(task.id) ? <CheckSquare className="text-emerald-600" /> : <Square />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catatan Tambahan</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  placeholder="Opsional: Keterangan kondisi..."
                />
              </div>
              <button 
                type="submit" 
                disabled={!selectedRoom}
                className={`w-full py-3 rounded-2xl font-bold transition-all shadow-lg ${
                  !selectedRoom ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-emerald-200'
                }`}
              >
                Simpan Laporan
              </button>
            </div>
            
            {!allTasksDone && selectedRoom && (
              <div className="flex items-center justify-center space-x-2 text-amber-600 text-xs font-medium bg-amber-50 py-3 rounded-xl border border-amber-100">
                <AlertCircle size={14} /> 
                <span>Lengkapi semua item checklist agar status tercatat <strong className="uppercase">Bersih</strong></span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Checklist List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Calendar size={18} className="mr-2 text-emerald-600" />
            Monitoring Harian: {new Date(today).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </h3>
          <div className="flex space-x-2 no-print">
            {[1, 2].map(l => (
              <button
                key={l}
                onClick={() => setSelectedLantai(l as 1 | 2)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedLantai === l ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-200'
                }`}
              >
                Lantai {l}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Ruangan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">PIC Petugas</th>
                <th className="px-6 py-4">Verified By</th>
                <th className="px-6 py-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map(room => {
                const log = todayLogs.find(l => l.ruangan === room);
                const pic = ROOM_ASSIGNMENTS[room]?.pic;
                return (
                  <tr key={room} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {isToilet(room) && <Droplets size={14} className="text-blue-400" />}
                        <p className="font-bold text-slate-700">{room}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">Lantai {ROOM_ASSIGNMENTS[room]?.lantai}</p>
                    </td>
                    <td className="px-6 py-4">
                      {log ? (
                        log.isClean ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            <Check size={12} className="mr-1" /> BERSIH
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold">
                            <X size={12} className="mr-1" /> BELUM BERSIH
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300 text-[10px] font-bold italic uppercase tracking-tighter">BELUM TERDATA</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{pic}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log?.petugasChecklist || '-'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 italic max-w-[250px] truncate">
                      {log?.catatan || (log ? '' : 'Belum dilakukan pemeriksaan')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-only p-8">
        <div className="text-center mb-10 border-b-2 border-black pb-6">
          <h1 className="text-2xl font-bold uppercase">Laporan Monitoring Kebersihan (DIGIMON)</h1>
          <h2 className="text-xl font-semibold">PENGADILAN AGAMA PRABUMULIH</h2>
          <p className="text-sm mt-2">Bulan: {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black p-2">Tanggal</th>
              <th className="border border-black p-2">Ruangan</th>
              <th className="border border-black p-2">PIC Petugas</th>
              <th className="border border-black p-2">Status</th>
              <th className="border border-black p-2">Pemeriksa</th>
              <th className="border border-black p-2">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td className="border border-black p-2">{l.tanggal}</td>
                <td className="border border-black p-2">{l.ruangan}</td>
                <td className="border border-black p-2">{l.picPetugas}</td>
                <td className="border border-black p-2 text-center font-bold">{l.isClean ? 'BERSIH' : 'BELUM BERSIH'}</td>
                <td className="border border-black p-2">{l.petugasChecklist}</td>
                <td className="border border-black p-2">{l.catatan}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 grid grid-cols-2 text-center text-sm">
          <div>
            <p>Mengetahui,</p>
            <p className="mt-20 font-bold underline">Sekretaris PA Prabumulih</p>
          </div>
          <div>
            <p>Prabumulih, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="mt-20 font-bold underline">Petugas Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningChecklist;
