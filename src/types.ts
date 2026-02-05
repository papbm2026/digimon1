
export type StatusTindakLanjut = 'Menunggu' | 'Proses' | 'Selesai';

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Checklist' | 'Maintenance' | 'Security';
  username: string;
}

export interface Keluhan {
  id: string;
  tanggal: string;
  kategori: 'Kebersihan' | 'Perbaikan';
  deskripsi: string;
  lokasi: string;
  status: StatusTindakLanjut;
  evidenceBefore?: string;
  evidenceAfter?: string;
  pelapor: string;
}

export interface CleaningLog {
  id: string;
  tanggal: string;
  ruangan: string;
  lantai: 1 | 2;
  picPetugas: string;
  petugasChecklist: string;
  isClean: boolean;
  catatan?: string;
}

export interface MaintenanceLog {
  id: string;
  tanggal: string;
  item: 'Gedung' | 'Halaman' | 'Kendaraan' | 'PC' | 'Laptop' | 'Printer' | 'AC';
  deskripsiKerusakan: string;
  detailPerbaikan: string;
  petugas: string;
  foto?: string; // base64 string
  biaya?: number;
}

export interface SecurityLog {
  id: string;
  tanggal: string;
  petugas: string;
  shift: 'Pagi' | 'Siang' | 'Malam';
  area: 'Pos Depan' | 'Tunggu Sidang' | 'PTSP' | 'Gedung';
  statusAman: boolean;
  // Khusus Malam & Gedung
  isLampuMati?: boolean;
  isElektronikOff?: boolean;
  isPagarGembok?: boolean;
  isPintuKunci?: boolean;
  isLampuLuarHidup?: boolean;
}
