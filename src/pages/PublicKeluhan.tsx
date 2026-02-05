
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Keluhan } from '../types';
import { Brush, Wrench, Send, ArrowRight, MonitorDot, CheckCircle2, MessageCircle, UserCog } from 'lucide-react';

interface PublicKeluhanProps {
  onAdd: (k: Keluhan) => void;
}

const PublicKeluhan: React.FC<PublicKeluhanProps> = ({ onAdd }) => {
  const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');
  const [category, setCategory] = useState<'Kebersihan' | 'Perbaikan' | null>(null);
  const [formData, setFormData] = useState({
    pelapor: '',
    lokasi: '',
    deskripsi: ''
  });
  const [waLink, setWaLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const newComplaint: Keluhan = {
      id: Math.random().toString(36).substr(2, 9),
      tanggal: new Date().toISOString(),
      kategori: category,
      pelapor: formData.pelapor,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      status: 'Menunggu'
    };

    onAdd(newComplaint);
    
    // WhatsApp Integration
    const waNumber = category === 'Kebersihan' ? '628123456789' : '628987654321';
    const message = `*DIGIMON - Laporan Baru*\nKategori: ${category}\nPelapor: ${formData.pelapor}\nLokasi: ${formData.lokasi}\nDeskripsi: ${formData.deskripsi}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    setWaLink(waUrl);
    setStep('success');
  };

  const resetForm = () => {
    setStep('selection');
    setFormData({ pelapor: '', lokasi: '', deskripsi: '' });
    setCategory(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-3xl mb-6 shadow-sm">
          <MonitorDot className="w-12 h-12 text-emerald-800" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">DIGIMON</h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">Digital Monitoring Sarana & Prasarana</p>
        <p className="text-slate-400 text-sm italic">Pengadilan Agama Prabumulih</p>
      </div>

      {step === 'selection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <button
            onClick={() => { setCategory('Kebersihan'); setStep('form'); }}
            className="group relative overflow-hidden p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all text-left"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Brush size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Keluhan Kebersihan</h3>
            <p className="text-slate-500 mt-2">Laporkan ruangan yang kotor, toilet bermasalah, atau tumpukan sampah.</p>
            <div className="mt-8 flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
              Kirim Laporan <ArrowRight size={20} className="ml-2" />
            </div>
          </button>

          <button
            onClick={() => { setCategory('Perbaikan'); setStep('form'); }}
            className="group relative overflow-hidden p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-100 transition-all text-left"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-800 group-hover:text-white transition-all duration-300">
              <Wrench size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Mohon Perbaikan</h3>
            <p className="text-slate-500 mt-2">Permintaan perbaikan AC, Laptop, Meja, Kursi, atau fasilitas rusak lainnya.</p>
            <div className="mt-8 flex items-center text-amber-600 font-bold group-hover:translate-x-2 transition-transform">
              Ajukan Perbaikan <ArrowRight size={20} className="ml-2" />
            </div>
          </button>
        </div>
      )}

      {step === 'form' && (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto w-full">
          <button onClick={() => setStep('selection')} className="text-sm font-semibold text-slate-400 hover:text-emerald-700 mb-8 flex items-center transition-colors">
            <ArrowRight size={16} className="rotate-180 mr-2" /> Kembali Pilih Kategori
          </button>
          
          <div className="flex items-center space-x-4 mb-10">
            <div className={`p-4 rounded-2xl ${category === 'Kebersihan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {category === 'Kebersihan' ? <Brush size={28} /> : <Wrench size={28} />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Form Laporan {category}</h2>
              <p className="text-slate-400 text-sm">Lengkapi data untuk tindak lanjut cepat</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Pelapor</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="Siapa nama Anda?"
                value={formData.pelapor}
                onChange={e => setFormData({ ...formData, pelapor: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Lokasi Kejadian</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="Contoh: Ruang PTSP, Toilet F2"
                value={formData.lokasi}
                onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Keterangan Detail</label>
              <textarea
                required
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Ceritakan masalah yang ditemukan..."
                /* Fixed: changed description to deskripsi */
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-xl ${
                category === 'Kebersihan' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
              }`}
            >
              <Send size={20} />
              <span>Simpan Laporan Digimon</span>
            </button>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 text-center max-w-xl mx-auto w-full">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Laporan Berhasil Dicatat!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">Data laporan telah masuk ke sistem monitoring internal. Silakan hubungi petugas operasional (PIC) untuk respon instan via WhatsApp.</p>
          
          <div className="flex flex-col space-y-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1"
            >
              <MessageCircle size={22} />
              <span>Kirim Notifikasi ke PIC</span>
            </a>
            <button
              onClick={resetForm}
              className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
            >
              Selesai & Kembali
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link to="/login" className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-emerald-800 hover:border-emerald-200 text-sm font-bold transition-all shadow-sm">
          <UserCog size={18} />
          <span>Halaman Pegawai</span>
        </Link>
      </div>
    </div>
  );
};

export default PublicKeluhan;
