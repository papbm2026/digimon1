
import React, { useState } from 'react';
import { Keluhan, StatusTindakLanjut } from '../types';
import { CheckCircle2, Clock, AlertCircle, MessageSquare, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface Props {
  keluhans: Keluhan[];
  onUpdate: (k: Keluhan) => void;
}

const ComplaintsAdmin: React.FC<Props> = ({ keluhans, onUpdate }) => {
  const [selectedK, setSelectedK] = useState<Keluhan | null>(null);

  const handleUpdateStatus = (status: StatusTindakLanjut) => {
    if (!selectedK) return;
    const updated = { ...selectedK, status };
    onUpdate(updated);
    setSelectedK(updated);
    
    // Logic: Send WhatsApp to supervisor if needed
    if (status === 'Selesai') {
      const waAtasan = '6281122334455';
      const msg = `Laporan Selesai: ${selectedK.deskripsi} di ${selectedK.lokasi} telah diperbaiki.`;
      // window.open(`https://wa.me/${waAtasan}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* List */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Keluhan & Saran</h1>
        {keluhans.map(k => (
          <button
            key={k.id}
            onClick={() => setSelectedK(k)}
            className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group ${
              selectedK?.id === k.id ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-100 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${
                k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 
                k.status === 'Proses' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              }`}>
                {k.status === 'Selesai' ? <CheckCircle2 size={24} /> : 
                 k.status === 'Proses' ? <Clock size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    k.kategori === 'Kebersihan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {k.kategori}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(k.tanggal).toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-slate-800 mt-1">{k.deskripsi}</h4>
                <p className="text-xs text-slate-500">Lokasi: {k.lokasi} • Pelapor: {k.pelapor}</p>
              </div>
            </div>
            <ChevronRight size={20} className={`transition-transform ${selectedK?.id === k.id ? 'translate-x-2 text-emerald-600' : 'text-slate-300'}`} />
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="w-[400px] bg-white rounded-3xl border border-slate-100 p-8 shadow-sm h-fit sticky top-0">
        {selectedK ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Detail Laporan</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                selectedK.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 
                selectedK.status === 'Proses' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                {selectedK.status.toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Deskripsi</p>
                <p className="text-slate-700 text-sm leading-relaxed">{selectedK.deskripsi}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Lokasi</p>
                <p className="text-slate-700 text-sm">{selectedK.lokasi}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800">Tindak Lanjut</h4>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleUpdateStatus('Proses')}
                  className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-all font-semibold ${
                    selectedK.status === 'Proses' ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-100 text-slate-400 hover:border-amber-300'
                  }`}
                >
                  <Clock size={18} />
                  <span>Proses Perbaikan</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Selesai')}
                  className={`flex items-center justify-center space-x-2 py-3 rounded-xl border-2 transition-all font-semibold ${
                    selectedK.status === 'Selesai' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-100 text-slate-400 hover:border-emerald-300'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span>Tandai Selesai</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800">Bukti (Evidence)</h4>
              <div className="flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl h-32 text-slate-400 hover:bg-slate-50 cursor-pointer">
                <div className="text-center">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs">Klik untuk upload foto</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-400">
            <MessageSquare size={48} className="mb-4 opacity-10" />
            <p className="text-sm">Pilih laporan di samping untuk melihat detail dan tindak lanjut.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsAdmin;
