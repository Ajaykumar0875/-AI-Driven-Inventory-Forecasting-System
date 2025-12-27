import React, { useState } from 'react';
import { LayoutDashboard, UploadCloud, TrendingUp, Menu, X, Box } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ChatAssistant from '../components/ChatAssistant';

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Upload Data', icon: UploadCloud, path: '/upload' },
    { name: 'Forecasts', icon: TrendingUp, path: '/forecast' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isOpen ? 'w-64' : 'w-20'} 
        bg-slate-950/50 backdrop-blur-xl border-r border-slate-800 
        transition-all duration-300 ease-in-out flex flex-col z-20`}
      >
        <div className="h-20 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Box size={24} className="text-white" />
             </div>
            {isOpen && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                StockSense
              </h1>
            )}
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <Icon size={22} className={isActive ? 'text-blue-400' : 'group-hover:text-blue-300'} />
                {isOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                
                {/* Active Indicator */}
                {isActive && isOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`mb-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
             <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Developed By</p>
             <div className="flex gap-3">
                <a 
                  href="https://www.linkedin.com/in/ajaykumar-8b2ab4258/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a 
                  href="https://github.com/Ajaykumar0875" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
             </div>
          </div>

          <button 
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800/50 text-slate-500 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-900 relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        <div className="p-8 relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
        
        {/* Chat Assistant Overlay */}
        <ChatAssistant />
      </main>
    </div>
  );
};

export default MainLayout;
