
import React, { useState, useRef } from 'react';
import { User, MaintenanceLog } from '../types';
import { MAINTENANCE_ITEMS } from '../constants';
import { Wrench, Plus, Printer, History, Upload, X, Camera, AlertCircle } from 'lucide-react';

interface Props {
  user: User;
  logs: MaintenanceLog[];
  onAdd: (log: MaintenanceLog) => void;
}

const MaintenancePage: React.FC<Props> = ({ user, logs, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    item: MAINTENANCE_ITEMS[0] as MaintenanceLog['item'],
    deskripsiKerusakan: '',
    detailPerbaikan: '',
    biaya: 0,
    foto: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setFileError('Ukuran file maksimal 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      tanggal: new Date().toISOString().split('T')[0],
      item: formData.item,
      deskripsiKerusakan: formData.deskripsiKerusakan,
      detailPerbaikan: formData.detailPerbaikan,
      petugas: user.name,
      biaya: formData.biaya,
      foto: formData.foto
    });
    setFormData({ 
      item: MAINTENANCE_ITEMS[0] as MaintenanceLog['item'], 
      deskripsiKerusakan: '', 
      detailPerbaikan: '', 
      biaya: 0, 
      foto: '' 
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Realisasi Pemeliharaan</h1>
          <p className="text-slate-500">Laporan pemeliharaan sarana dan prasarana</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => window.print()} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Printer size={18} />
            <span>Cetak Rekap Bulanan</span>
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            <span>{showForm ? 'Batal' : 'Lapor Pemeliharaan'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 no-print">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Pemeliharaan</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                    value={formData.item}
                    onChange={e => setFormData({...formData, item: e.target.value as any})}
                  >
                    {MAINTENANCE_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Kerusakan</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none"
                    value={formData.deskripsiKerusakan}
                    onChange={e => setFormData({...formData, deskripsiKerusakan: e.target.value})}
                    placeholder="Apa kerusakan yang ditemukan?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detail Perbaikan</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none"
                    value={formData.detailPerbaikan}
                    onChange={e => setFormData({...formData, detailPerbaikan: e.target.value})}
                    placeholder="Langkah perbaikan yang dilakukan?"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dokumentasi (Maks 10MB)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-[2rem] h-full min-h-[200px] flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    formData.foto ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-400 bg-slate-50'
                  }`}
                >
                  {formData.foto ? (
                    <>
                      <img src={formData.foto} className="absolute inset-0 w-full h-full object-cover rounded-[1.9rem] opacity-20" alt="Preview" />
                      <div className="relative z-10 text-center">
                        <CheckCircle2 className="mx-auto text-amber-600 mb-2" size={40} />
                        <p className="text-amber-800 font-bold">Foto Berhasil Diunggah</p>
                        <p className="text-amber-600 text-xs mt-1">Klik untuk ganti foto</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="text-slate-400 group-hover:text-amber-500" size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">Klik untuk Unggah Foto</p>
                      <p className="text-slate-400 text-xs mt-1">PNG, JPG atau JPEG (Max. 10MB)</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                {fileError && (
                  <p className="text-red-500 text-xs font-bold flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {fileError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="px-10 py-4 bg-amber-700 text-white rounded-2xl font-bold shadow-xl shadow-amber-200 hover:bg-amber-800 transition-all hover:-translate-y-1"
              >
                Simpan Laporan Pemeliharaan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center text-lg">
            <History size={20} className="mr-3 text-amber-600" />
            Riwayat Pemeliharaan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Item</th>
                <th className="px-8 py-5">Deskripsi Masalah & Perbaikan</th>
                <th className="px-8 py-5">Petugas</th>
                <th className="px-8 py-5 text-center">Foto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-slate-500 font-medium whitespace-nowrap">{l.tanggal}</td>
                  <td className="px-8 py-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] uppercase">
                      {l.item}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2 max-w-md">
                      <div>
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Kerusakan:</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{l.deskripsiKerusakan}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Perbaikan:</p>
                        <p className="text-slate-600 italic leading-relaxed">{l.detailPerbaikan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-600 font-bold">{l.petugas}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {l.foto ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm hover:scale-110 transition-transform cursor-zoom-in border border-slate-200">
                          <img src={l.foto} alt="Evidence" className="w-full h-full object-cover" onClick={() => window.open(l.foto)} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                          <Camera size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <Wrench size={48} className="text-slate-300 mb-4" />
                      <p className="text-slate-400 font-medium italic">Belum ada riwayat pemeliharaan sarpras</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print-only layout */}
      <div className="print-only p-12">
        <div className="text-center mb-10 border-b-4 border-slate-900 pb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Laporan Realisasi Pemeliharaan (DIGIMON)</h1>
          <h2 className="text-2xl font-bold mt-1">PENGADILAN AGAMA PRABUMULIH</h2>
          <p className="text-lg mt-2">Rekapitulasi Pemeliharaan Sarana & Prasarana Kantor</p>
        </div>
        <table className="w-full border-collapse border-2 border-slate-900 text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-2 border-slate-900 p-3">TGL</th>
              <th className="border-2 border-slate-900 p-3">ITEM</th>
              <th className="border-2 border-slate-900 p-3">KERUSAKAN</th>
              <th className="border-2 border-slate-900 p-3">PERBAIKAN</th>
              <th className="border-2 border-slate-900 p-3">PETUGAS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td className="border border-slate-900 p-3">{l.tanggal}</td>
                <td className="border border-slate-900 p-3 font-bold">{l.item}</td>
                <td className="border border-slate-900 p-3">{l.deskripsiKerusakan}</td>
                <td className="border border-slate-900 p-3">{l.detailPerbaikan}</td>
                <td className="border border-slate-900 p-3">{l.petugas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-16 flex justify-between text-sm px-10">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-bold">Sekretaris PA Prabumulih</p>
            <div className="h-24"></div>
            <p className="font-bold underline">H. Muhammad Ridwan, S.Ag</p>
            <p>NIP. 197410221999031001</p>
          </div>
          <div className="text-center">
            <p>Prabumulih, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            <p className="font-bold">Petugas Sarpras</p>
            <div className="h-24"></div>
            <p className="font-bold underline">{user.name}</p>
            <p>PIC Pemeliharaan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-defining CheckCircle2 locally if needed by type, but imported from lucide-react should work
const CheckCircle2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default MaintenancePage;
