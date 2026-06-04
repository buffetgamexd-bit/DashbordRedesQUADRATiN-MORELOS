import React, { useState } from 'react';
import { qm_data } from './data';
import { qm_analysis } from './analysis';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Official, highly recognizable brand logo components
const InstagramLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: '28px', height: '28px' }}>
    <defs>
      <radialGradient id="igGradient" cx="30%" cy="107%" r="130%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5" fill="url(#igGradient)" />
    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.25A3.25 3.25 0 1112 8.75a3.25 3.25 0 010 6.5zM17.25 7a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" fill="#ffffff" />
    <path d="M16 3H8C5.24 3 3 5.24 3 8v8c0 2.76 2.24 5 5 5h8c2.76 0 5-2.24 5-5V8c0-2.76-2.24-5-5-5zm3.25 13c0 1.79-1.46 3.25-3.25 3.25H8C6.21 19.25 4.75 17.79 4.75 16V8C4.75 6.21 6.21 4.75 8 4.75h8c1.79 0 3.25 1.46 3.25 3.25v8z" fill="#ffffff" />
  </svg>
);

const FacebookLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: '28px', height: '28px' }}>
    <rect width="24" height="24" rx="5" fill="#1877F2" />
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#ffffff" />
  </svg>
);

const TikTokLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: '28px', height: '28px' }}>
    <rect width="24" height="24" rx="5" fill="#010101" />
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.99 1.15 2.33 1.93 3.79 2.19v3.9c-1.57-.02-3.11-.53-4.41-1.42-.49-.34-.94-.74-1.32-1.19v6.84c.05 1.5-.32 3.02-1.13 4.29-.93 1.48-2.45 2.58-4.17 3.01-1.74.45-3.62.24-5.21-.6-1.59-.85-2.82-2.34-3.37-4.08-.58-1.77-.38-3.76.54-5.36C3.96 10 5.48 8.87 7.23 8.39c1.07-.3 2.19-.3 3.25-.01v4.03c-.87-.31-1.84-.19-2.6.33-.87.57-1.39 1.59-1.35 2.62.03.95.53 1.85 1.33 2.37.83.56 1.88.66 2.78.27.9-.36 1.58-1.14 1.83-2.09.11-.47.15-.96.15-1.44V0h.005z" fill="#ffffff" />
  </svg>
);

const TwitterXLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: '28px', height: '28px' }}>
    <rect width="24" height="24" rx="5" fill="#000000" />
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff" />
  </svg>
);


function App() {
  const [selectedChartTab, setSelectedChartTab] = useState('consolidado');
  const [activeReportTab, setActiveReportTab] = useState('redes');

  // Extract history and configurations from data
  const history = qm_data.history;
  const goals = qm_data.goals;
  
  const lastEntry = history[history.length - 1];
  const initialEntry = history[0]; // Jan 9
  
  // Platform configuration objects
  const platforms = {
    instagram: {
      name: 'Instagram',
      color: '#e1306c', // official Instagram branding color
      logo: InstagramLogo,
      initial: initialEntry.instagram,
      current: lastEntry.instagram,
      goal: goals.instagram,
      profileUrl: 'https://www.instagram.com/quadratin.morelos/'
    },
    tiktok: {
      name: 'TikTok',
      color: '#010101', // official black
      logo: TikTokLogo,
      initial: initialEntry.tiktok,
      current: lastEntry.tiktok,
      goal: goals.tiktok,
      profileUrl: 'https://www.tiktok.com/@quadratinmorelos'
    },
    facebook: {
      name: 'Facebook',
      color: '#1877f2', // official Facebook blue
      logo: FacebookLogo,
      initial: initialEntry.facebook,
      current: lastEntry.facebook,
      goal: goals.facebook,
      profileUrl: 'https://www.facebook.com/share/14iS411Pd47/?mibextid=wwXIfr'
    },
    twitter: {
      name: 'Twitter / X',
      color: '#000000', // official X black
      logo: TwitterXLogo,
      initial: initialEntry.twitter,
      current: lastEntry.twitter,
      goal: goals.twitter,
      profileUrl: 'https://x.com/Quadratin_Mor'
    }
  };

  // Format date helper in Spanish
  const formatDateSpanish = (dateStr) => {
    const dateObj = new Date(dateStr + 'T12:00:00'); // avoid timezone offset issues
    return dateObj.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHeaderDate = (dateStr) => {
    const dateObj = new Date(dateStr + 'T12:00:00');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `Cuernavaca, Morelos a ${day} de ${month} de ${year}`;
  };

  // Helper formatting functions
  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num);
  const formatPercentage = (val) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

  // Calculate totals
  const initialTotal = initialEntry.instagram + initialEntry.tiktok + initialEntry.facebook + initialEntry.twitter;
  const currentTotal = lastEntry.instagram + lastEntry.tiktok + lastEntry.facebook + lastEntry.twitter;
  const totalGoal = goals.instagram + goals.tiktok + goals.facebook + goals.twitter;
  const totalGrowth = currentTotal - initialTotal;
  const totalGrowthPercentage = (totalGrowth / initialTotal) * 100;
  const totalProgress = (currentTotal / totalGoal) * 100;

  // Chart data mapping
  const chartData = history.map(entry => {
    const dateObj = new Date(entry.date + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    return {
      date: formattedDate,
      fullDate: entry.date,
      instagram: entry.instagram,
      tiktok: entry.tiktok,
      facebook: entry.facebook,
      twitter: entry.twitter,
      total: entry.instagram + entry.tiktok + entry.facebook + entry.twitter
    };
  });

  const activeNotes = qm_analysis[activeReportTab];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-100 font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header Oficial de Quadratín Morelos */}
      <header className="w-full">
        {/* Franja Superior Naranja */}
        <div className="header-top-bar">
          {getHeaderDate(lastEntry.date)}
        </div>
        
        {/* Sección Central Blanca con Logo */}
        <div className="header-main-logo">
          <img src="/logo_quadratin.png" alt="Logo Quadratín Morelos" />
        </div>
        
        {/* Barra de Navegación Azul Marino */}
        <div className="header-nav-bar">
          <span className="header-nav-title">Reporte de Avances</span>
          <button 
            className={`header-nav-tab ${activeReportTab === 'redes' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('redes')}
          >
            Redes Sociales
          </button>
          <button 
            className={`header-nav-tab ${activeReportTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('radar')}
          >
            Radar Analytics
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Metadata section (Sub-header) */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-[#003366]">
              Dashboard de Métricas
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Campaña Q2 2026 · Resumen ejecutivo y cumplimiento de objetivos.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Último Scrape Automatizado</span>
            <span className="text-sm font-bold text-[#003366] flex items-center gap-1.5 mt-0.5">
              <Clock size={15} className="text-[#ff6600]" />
              {formatDateSpanish(lastEntry.date)} (7:00 AM)
            </span>
          </div>
        </div>

        {/* Totals Section */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="corp-card">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Audiencia Consolidada</span>
              <div className="text-3xl font-extrabold text-[#003366] font-outfit">{formatNumber(currentTotal)}</div>
            </div>
            <div className="text-xs text-slate-500 mt-4 flex items-center gap-1">
              <span className="text-[#ff6600] font-bold flex items-center">
                <TrendingUp size={14} className="mr-0.5" /> {formatPercentage(totalGrowthPercentage)}
              </span>
              desde el 9 de enero ({formatNumber(initialTotal)})
            </div>
          </div>

          <div className="corp-card">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Crecimiento Neto</span>
              <div className="text-3xl font-extrabold text-[#003366] font-outfit">+{formatNumber(totalGrowth)}</div>
            </div>
            <div className="text-xs text-slate-500 mt-4">
              Seguidores totales ganados en la campaña
            </div>
          </div>

          <div className="corp-card">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Progreso vs Meta Global</span>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xl font-extrabold text-[#003366] font-outfit">{totalProgress.toFixed(1)}%</span>
                <span className="text-xs font-mono text-slate-500">{formatNumber(currentTotal)} / {formatNumber(totalGoal)}</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="h-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(totalProgress, 100)}%`,
                    backgroundColor: 'var(--color-orange)'
                  }}
                />
              </div>
            </div>
          </div>

        </section>

        {/* Platform Grid */}
        <section className="mb-10">
          <h2 className="text-lg font-bold font-outfit text-[#003366] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#ff6600] rounded-full inline-block"></span>
            Rendimiento por Plataforma
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(platforms).map(([key, item]) => {
              const Logo = item.logo;
              const netGrowth = item.current - item.initial;
              const netGrowthPct = (netGrowth / item.initial) * 100;
              const progressPct = (item.current / item.goal) * 100;
              const remaining = item.goal - item.current;
              const isGoalMet = item.current >= item.goal;

              return (
                <div key={key} className="corp-card">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <Logo />
                      <a 
                        href={item.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-400 hover:text-[#003366] transition-colors p-1"
                        title="Ver perfil oficial"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>

                    {/* Title & Count */}
                    <div>
                      <h3 className="text-sm font-bold font-outfit text-slate-500">{item.name}</h3>
                      <div className="text-2xl font-extrabold text-[#003366] mt-0.5 font-outfit tracking-tight">
                        {formatNumber(item.current)}
                      </div>
                      <div className="text-[11px] text-slate-400">seguidores actuales</div>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Crecimiento Neto:</span>
                      <span className="font-bold flex items-center gap-0.5" style={{ color: netGrowth >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {netGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {formatNumber(netGrowth)} ({formatPercentage(netGrowthPct)})
                      </span>
                    </div>

                    {/* Meta progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 flex items-center gap-0.5"><Target size={11} /> Meta: {formatNumber(item.goal)}</span>
                        <span className="font-bold" style={{ color: isGoalMet ? 'var(--color-success)' : 'var(--color-blue)' }}>
                          {progressPct.toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Bar */}
                      <div className="progress-bar-container">
                        <div 
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.min(progressPct, 100)}%`,
                            backgroundColor: isGoalMet ? 'var(--color-success)' : 'var(--color-blue)'
                          }}
                        />
                      </div>

                      {/* Remaining indicator */}
                      <div className="text-right mt-1">
                        {isGoalMet ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-650 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-250">
                            <Award size={9} /> Meta Superada
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Faltan <strong className="text-slate-600 font-semibold">{formatNumber(remaining)}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Historical Baseline comparisons */}
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-2 space-y-0.5 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Inicio (9 Ene):</span>
                        <span className="text-slate-700 font-bold">{formatNumber(item.initial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cierre PDF (9 May):</span>
                        <span className="text-slate-700 font-bold">
                          {formatNumber(history[1] ? history[1][key] : item.initial)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts & Pipeline Info */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Card (span 3) */}
          <div className="lg:col-span-3 corp-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold font-outfit text-[#003366]">Histórico de Crecimiento</h2>
                <p className="text-slate-400 text-xs mt-0.5">Evolución de seguidores registrados.</p>
              </div>
              
              {/* Tab Selector */}
              <div className="sub-tabs-container">
                <button 
                  onClick={() => setSelectedChartTab('consolidado')}
                  className={`sub-tab-btn ${selectedChartTab === 'consolidado' ? 'active' : ''}`}
                >
                  Consolidado
                </button>
                {Object.entries(platforms).map(([key, item]) => (
                  <button 
                    key={key}
                    onClick={() => setSelectedChartTab(key)}
                    className={`sub-tab-btn ${selectedChartTab === key ? 'active' : ''}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={selectedChartTab === 'consolidado' ? '#ff6600' : platforms[selectedChartTab].color} 
                        stopOpacity={0.2} 
                      />
                      <stop 
                        offset="95%" 
                        stopColor={selectedChartTab === 'consolidado' ? '#ff6600' : platforms[selectedChartTab].color} 
                        stopOpacity={0} 
                      />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: selectedChartTab === 'consolidado' ? '#ff6600' : '#003366',
                      borderRadius: '8px',
                      color: '#1f2937',
                      fontSize: '13px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
                    }} 
                    itemStyle={{ color: '#1f2937' }}
                    labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
                    formatter={(value) => [formatNumber(value), selectedChartTab === 'consolidado' ? 'Seguidores Totales' : `Seguidores en ${platforms[selectedChartTab].name}`]}
                    labelFormatter={(label, items) => {
                      const entry = items[0]?.payload;
                      return entry ? `Fecha de registro: ${entry.fullDate}` : label;
                    }}
                  />

                  <Area 
                    type="monotone" 
                    dataKey={selectedChartTab === 'consolidado' ? 'total' : selectedChartTab} 
                    stroke={selectedChartTab === 'consolidado' ? '#ff6600' : platforms[selectedChartTab].color} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorGradient)" 
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Explanatory subtitle */}
            <div className="mt-4 text-xs text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1.5">
              <Calendar size={12} className="text-[#003366]" />
              Los puntos representan las fechas clave del reporte (9 de enero y 9 de mayo) complementados con las mediciones automáticas diarias a las 7:00 AM.
            </div>
          </div>


        </section>

        {/* 3. Avance Operativo y Planificación (Solo Lectura) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-outfit text-[#003366] flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff6600] rounded-full inline-block"></span>
              {activeNotes.title}
            </h2>
            <span className="text-xs font-bold bg-[#e6f0fa] text-[#003366] px-3 py-1 rounded-full uppercase tracking-wider">
              {activeNotes.is_dynamic ? 'Generado con IA (Claude)' : 'Datos Estáticos del PDF'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Logros */}
            <div className="corp-card">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold font-outfit text-slate-700 flex items-center gap-1.5 text-sm">
                    <span className="text-emerald-500">🏆</span> Logros de la Semana
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                    {activeNotes.logros.length} ítems
                  </span>
                </div>

                <div className="space-y-1">
                  {activeNotes.logros.map((text, idx) => (
                    <div key={idx} className="op-list-item">
                      <span className="text-emerald-500 op-bullet">✓</span>
                      <span className="op-text">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Accionables */}
            <div className="corp-card">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold font-outfit text-slate-700 flex items-center gap-1.5 text-sm">
                    <span className="text-amber-500">⚡</span> Accionables Próxima Semana
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
                    {activeNotes.accionables.length} ítems
                  </span>
                </div>

                <div className="space-y-1">
                  {activeNotes.accionables.map((text, idx) => (
                    <div key={idx} className="op-list-item">
                      <span className="text-amber-500 op-bullet">▶</span>
                      <span className="op-text">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Dependencias */}
            <div className="corp-card">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold font-outfit text-slate-700 flex items-center gap-1.5 text-sm">
                    <span className="text-[#003366]">📌</span> Dependencias y Notas
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                    {activeNotes.dependencias.length} ítems
                  </span>
                </div>

                <div className="space-y-1">
                  {activeNotes.dependencias.map((text, idx) => (
                    <div key={idx} className="op-list-item">
                      <span className="text-[#003366] op-bullet">•</span>
                      <span className="op-text">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-8 text-center text-slate-400 text-xs">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <span>Quadratín Morelos · Dashboard Ejecutivo Q2</span>
            <span>•</span>
            <span>Estadísticas en Tiempo Real</span>
          </p>
          <p className="mt-1">
            Diseño corporativo oficial basado en la identidad visual de Quadratín (Naranja y Azul).
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
