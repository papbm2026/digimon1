
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { User, Keluhan, CleaningLog, MaintenanceLog, SecurityLog } from './types';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicKeluhan from './pages/PublicKeluhan';
import CleaningChecklist from './pages/CleaningChecklist';
import MaintenancePage from './pages/MaintenancePage';
import SecurityPage from './pages/SecurityPage';
import ComplaintsAdmin from './pages/ComplaintsAdmin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [keluhans, setKeluhans] = useState<Keluhan[]>(() => {
    const saved = localStorage.getItem('pa_keluhans');
    return saved ? JSON.parse(saved) : [];
  });

  const [cleaningLogs, setCleaningLogs] = useState<CleaningLog[]>(() => {
    const saved = localStorage.getItem('pa_cleaning');
    return saved ? JSON.parse(saved) : [];
  });

  const [maintLogs, setMaintLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('pa_maint');
    return saved ? JSON.parse(saved) : [];
  });

  const [secLogs, setSecLogs] = useState<SecurityLog[]>(() => {
    const saved = localStorage.getItem('pa_security');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pa_keluhans', JSON.stringify(keluhans));
  }, [keluhans]);

  useEffect(() => {
    localStorage.setItem('pa_cleaning', JSON.stringify(cleaningLogs));
  }, [cleaningLogs]);

  useEffect(() => {
    localStorage.setItem('pa_maint', JSON.stringify(maintLogs));
  }, [maintLogs]);

  useEffect(() => {
    localStorage.setItem('pa_security', JSON.stringify(secLogs));
  }, [secLogs]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('pa_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pa_user');
  };

  // Helper to render protected content or login form without redirecting
  const renderProtectedRoute = (Component: React.ElementType, props: any = {}) => {
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }
    return <Component user={user} {...props} />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {user && <Header user={user} />}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              {/* Conditional Root: Decides what to show based on auth state */}
              <Route path="/" element={
                user ? (
                  <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                ) : (
                  <PublicKeluhan onAdd={(k) => setKeluhans([k, ...keluhans])} />
                )
              } />

              {/* Public Routes */}
              <Route path="/public" element={<PublicKeluhan onAdd={(k) => setKeluhans([k, ...keluhans])} />} />
              
              {/* Login path: shows login if not logged in, otherwise dashboard view */}
              <Route path="/login" element={
                user ? (
                  <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } />

              {/* Protected Routes using conditional rendering to avoid Navigate triggers */}
              <Route path="/cleaning" element={renderProtectedRoute(CleaningChecklist, { logs: cleaningLogs, onAdd: (l: CleaningLog) => setCleaningLogs([l, ...cleaningLogs]) })} />
              
              <Route path="/maintenance" element={renderProtectedRoute(MaintenancePage, { logs: maintLogs, onAdd: (l: MaintenanceLog) => setMaintLogs([l, ...maintLogs]) })} />
              
              <Route path="/security" element={renderProtectedRoute(SecurityPage, { logs: secLogs, onAdd: (l: SecurityLog) => setSecLogs([l, ...secLogs]) })} />
              
              <Route path="/complaints" element={
                user ? (
                  <ComplaintsAdmin keluhans={keluhans} onUpdate={(k) => setKeluhans(keluhans.map(item => item.id === k.id ? k : item))} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } />

              {/* Fallback to Dashboard/Public view based on auth */}
              <Route path="*" element={
                user ? (
                  <Dashboard keluhans={keluhans} cleaning={cleaningLogs} maintenance={maintLogs} security={secLogs} />
                ) : (
                  <PublicKeluhan onAdd={(k) => setKeluhans([k, ...keluhans])} />
                )
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
