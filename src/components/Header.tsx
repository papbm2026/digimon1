
import React from 'react';
import { User } from '../types';
import { Bell, UserCircle } from 'lucide-react';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between no-print shrink-0">
      <h2 className="text-lg font-semibold text-slate-800">
        Selamat Datang, {user.name}
      </h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
          <UserCircle size={32} className="text-emerald-800" />
        </div>
      </div>
    </header>
  );
};

export default Header;
