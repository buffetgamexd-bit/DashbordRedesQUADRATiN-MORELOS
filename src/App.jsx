import React, { useState, useEffect, useRef } from 'react';
import { qm_data } from './data';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  CornerDownRight
} from 'lucide-react';

// Custom SVGs for Social Media Logos to ensure premium branded appearance
const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

// 3D Tilt Card Wrapper Component
const TiltCard = ({ children, className, glowColor }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative mouse coordinates from card center (-1 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rX = -((mouseY - height / 2) / (height / 2)) * 8; // Max 8 deg
    const rY = ((mouseX - width / 2) / (width / 2)) * 8; // Max 8 deg
    
    setRotateX(rX);
    setRotateY(rY);
    
    // Glow position in percentages
    const glowX = (mouseX / width) * 100;
    const glowY = (mouseY / height) * 100;
    setGlowPos({ x: glowX, y: glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl ${className}`}
    >
      {/* Dynamic spotlight gradient glow inside the card */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 180px at ${glowPos.x}% ${glowPos.y}%, ${glowColor || 'rgba(255, 120, 0, 0.15)'}, transparent 80%)`,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* 3D content container */}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </div>
  );
};

// Seed notes for fallback
const SEED_NOTES = {
  logros: [
    { id: 'l1', text: 'Se logró superar la meta mensual del OKR de seguidores en Instagram (13.8K+)', category: 'logros' },
    { id: 'l2', text: 'Aumentamos la frecuencia de publicación de Sofía de 1 a 2 videos diarios', category: 'logros' },
    { id: 'l3', text: 'Mejoramos significativamente el tiempo de respuesta inicial en comentarios de FB', category: 'logros' },
    { id: 'l4', text: 'Se lanzó con éxito la dinámica de interacción por el Día de las Madres', category: 'logros' }
  ],
  accionables: [
    { id: 'a1', text: 'Probar contenido diferenciado en TikTok con Sofía y Romina (5 contenidos diarios)', completed: false, category: 'accionables' },
    { id: 'a2', text: 'Enviar propuesta de pauta semanal para Facebook (2 a 3 contenidos diarios)', completed: true, category: 'accionables' },
    { id: 'a3', text: 'Pedir cotización formal a la agencia de Reuters para contratación (Jaki)', completed: false, category: 'accionables' },
    { id: 'a4', text: 'Definir el flujo de aportación de Bigote Chilaquiler a "Raíces Morelos"', completed: false, category: 'accionables' }
  ],
  dependencias: [
    { id: 'd1', text: 'Aprobación de Dirección General (Cerón) del diseño final para estudio Raíces Morelos', category: 'dependencias' },
    { id: 'd2', text: 'Reagendar la reunión técnica con el equipo de Radar Analytics para evaluar Tier 1', category: 'dependencias' },
    { id: 'd3', text: 'Definir asignación de presupuesto publicitario semanal para impulsar crecimiento en FB', category: 'dependencias' }
  ]
};

function App() {
  const [selectedTab, setSelectedTab] = useState('consolidado');
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('qm_dashboard_notes');
    return saved ? JSON.parse(saved) : SEED_NOTES;
  });

  // Notes state managers
  const [newNoteTexts, setNewNoteTexts] = useState({ logros: '', accionables: '', dependencias: '' });
  const [isEditingNote, setIsEditingNote] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    localStorage.setItem('qm_dashboard_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (category) => {
    const text = newNoteTexts[category].trim();
    if (!text) return;
    const newNote = {
      id: `${category}-${Date.now()}`,
      text,
      category,
      ...(category === 'accionables' ? { completed: false } : {})
    };
    setNotes(prev => ({
      ...prev,
      [category]: [...prev[category], newNote]
    }));
    setNewNoteTexts(prev => ({ ...prev, [category]: '' }));
  };

  const deleteNote = (category, id) => {
    setNotes(prev => ({
      ...prev,
      [category]: prev[category].filter(note => note.id !== id)
    }));
  };

  const toggleAccionable = (id) => {
    setNotes(prev => ({
      ...prev,
      accionables: prev.accionables.map(note => 
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    }));
  };

  const startEditing = (note) => {
    setIsEditingNote(note.id);
    setEditNoteText(note.text);
  };

  const saveEdit = (category, id) => {
    if (!editNoteText.trim()) return;
    setNotes(prev => ({
      ...prev,
      [category]: prev[category].map(note => 
        note.id === id ? { ...note, text: editNoteText.trim() } : note
      )
    }));
    setIsEditingNote(null);
    setEditNoteText('');
  };

  const cancelEdit = () => {
    setIsEditingNote(null);
    setEditNoteText('');
  };

  // Extract history and configurations
  const history = qm_data.history;
  const goals = qm_data.goals;
  
  const lastEntry = history[history.length - 1];
  const initialEntry = history[0]; // Jan 9
  
  // Platform configuration objects
  const platforms = {
    instagram: {
      name: 'Instagram',
      color: '#ff7a00',
      glowColor: 'rgba(255, 122, 0, 0.15)',
      icon: InstagramIcon,
      initial: initialEntry.instagram,
      current: lastEntry.instagram,
      goal: goals.instagram,
      profileUrl: 'https://www.instagram.com/quadratin.morelos/'
    },
    tiktok: {
      name: 'TikTok',
      color: '#00f2fe',
      glowColor: 'rgba(0, 242, 254, 0.15)',
      icon: TikTokIcon,
      initial: initialEntry.tiktok,
      current: lastEntry.tiktok,
      goal: goals.tiktok,
      profileUrl: 'https://www.tiktok.com/@quadratinmorelos'
    },
    facebook: {
      name: 'Facebook',
      color: '#1877f2',
      glowColor: 'rgba(24, 119, 242, 0.15)',
      icon: FacebookIcon,
      initial: initialEntry.facebook,
      current: lastEntry.facebook,
      goal: goals.facebook,
      profileUrl: 'https://www.facebook.com/QuadratinMorelos'
    },
    twitter: {
      name: 'Twitter / X',
      color: '#ffffff',
      glowColor: 'rgba(255, 255, 255, 0.1)',
      icon: TwitterIcon,
      initial: initialEntry.twitter,
      current: lastEntry.twitter,
      goal: goals.twitter,
      profileUrl: 'https://x.com/Quadratin_Mor'
    }
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
    const dateObj = new Date(entry.date);
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

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/80 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse" /> OKR Q2 2026
              </span>
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Clock size={12} /> Auto-Scraper 7:00 AM
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight font-outfit bg-gradient-to-r from-orange-400 via-amber-200 to-sky-400 bg-clip-text text-transparent">
              Quadratín Morelos
            </h1>
            <p className="text-slate-400 text-lg mt-1 font-light">
              Métricas de crecimiento y cumplimiento de objetivos de redes sociales.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col items-end bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
            <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Última actualización</div>
            <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-2">
              <Calendar size={18} className="text-orange-400" />
              {new Date(lastEntry.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {lastEntry.failed_scrapes && lastEntry.failed_scrapes.length > 0 && (
              <div className="text-xs text-yellow-400/90 mt-1 flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                <AlertCircle size={12} /> Falló scrape en: {lastEntry.failed_scrapes.join(', ')} (usando backup)
              </div>
            )}
          </div>
        </header>

        {/* Totals Section */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Audiencia Consolidada</span>
            <div className="text-3xl font-extrabold text-white font-outfit">{formatNumber(currentTotal)}</div>
            <div className="text-sm text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="text-orange-400 font-semibold flex items-center">
                <TrendingUp size={14} className="mr-0.5" /> {formatPercentage(totalGrowthPercentage)}
              </span>
              desde el 9 de enero ({formatNumber(initialTotal)})
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Crecimiento Neto Total</span>
            <div className="text-3xl font-extrabold text-white font-outfit">+{formatNumber(totalGrowth)}</div>
            <div className="text-sm text-slate-400 mt-2">
              Seguidores ganados en el período Q2
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Progreso vs Meta Global</span>
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-2xl font-extrabold text-white font-outfit">{totalProgress.toFixed(1)}%</span>
              <span className="text-xs font-mono text-slate-400">{formatNumber(currentTotal)} / {formatNumber(totalGoal)}</span>
            </div>
            {/* Custom progress bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-sky-500 transition-all duration-1000"
                style={{ width: `${Math.min(totalProgress, 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Platform Grid (3D tilt cards) */}
        <section className="mb-10">
          <h2 className="text-xl font-bold font-outfit text-slate-200 mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-orange-400" /> Rendimiento por Plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(platforms).map(([key, item]) => {
              const Icon = item.icon;
              const netGrowth = item.current - item.initial;
              const netGrowthPct = (netGrowth / item.initial) * 100;
              const progressPct = (item.current / item.goal) * 100;
              const remaining = item.goal - item.current;
              const isGoalMet = item.current >= item.goal;

              return (
                <TiltCard key={key} glowColor={item.glowColor} className="h-full">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-slate-300" style={{ color: item.color }}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <a 
                        href={item.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                        title="Ver perfil oficial"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    {/* Title & Count */}
                    <div>
                      <h3 className="text-lg font-bold font-outfit text-slate-300">{item.name}</h3>
                      <div className="text-3xl font-extrabold text-white mt-1 font-outfit tracking-tight">
                        {formatNumber(item.current)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">seguidores actuales</div>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="mt-6 space-y-4 pt-4 border-t border-slate-800/60">
                    {/* Net growth details */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Crecimiento Neto:</span>
                      <span className="font-semibold flex items-center gap-1" style={{ color: netGrowth >= 0 ? '#4ade80' : '#ef4444' }}>
                        {netGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {formatNumber(netGrowth)} ({formatPercentage(netGrowthPct)})
                      </span>
                    </div>

                    {/* Meta progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 flex items-center gap-1"><Target size={12} /> Meta: {formatNumber(item.goal)}</span>
                        <span className="font-mono font-semibold" style={{ color: isGoalMet ? '#4ade80' : item.color }}>
                          {progressPct.toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                        <div 
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.min(progressPct, 100)}%`,
                            backgroundColor: isGoalMet ? '#4ade80' : item.color
                          }}
                        />
                      </div>

                      {/* Remaining indicator */}
                      <div className="text-right">
                        {isGoalMet ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                            <Award size={10} /> ¡Meta Superada!
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Faltan <strong className="text-slate-300 font-semibold">{formatNumber(remaining)}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Historical Baseline comparisons */}
                    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inicio (9 Ene):</span>
                        <span className="text-slate-300 font-semibold">{formatNumber(item.initial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cierre PDF (9 May):</span>
                        <span className="text-slate-300 font-semibold">
                          {formatNumber(history[1] ? history[1][key] : item.initial)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* Charts & Interactive Analysis */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Card (span 2) */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold font-outfit text-slate-200">Histórico de Crecimiento</h2>
                <p className="text-slate-400 text-xs mt-0.5">Evolución de seguidores desde el inicio de la campaña.</p>
              </div>
              
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-1 bg-slate-950/60 border border-slate-800 p-1 rounded-xl self-start sm:self-center">
                <button 
                  onClick={() => setSelectedTab('consolidado')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedTab === 'consolidado' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Consolidado
                </button>
                {Object.entries(platforms).map(([key, item]) => (
                  <button 
                    key={key}
                    onClick={() => setSelectedTab(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedTab === key ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    style={{ backgroundColor: selectedTab === key ? item.color : undefined }}
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
                        stopColor={selectedTab === 'consolidado' ? '#ff7a00' : platforms[selectedTab].color} 
                        stopOpacity={0.4} 
                      />
                      <stop 
                        offset="95%" 
                        stopColor={selectedTab === 'consolidado' ? '#ff7a00' : platforms[selectedTab].color} 
                        stopOpacity={0} 
                      />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: selectedTab === 'consolidado' ? '#ff7a00' : platforms[selectedTab].color,
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '13px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
                    }} 
                    formatter={(value) => [formatNumber(value), selectedTab === 'consolidado' ? 'Seguidores Totales' : `Seguidores en ${platforms[selectedTab].name}`]}
                    labelFormatter={(label, items) => {
                      const entry = items[0]?.payload;
                      return entry ? `Fecha: ${entry.fullDate}` : label;
                    }}
                  />

                  <Area 
                    type="monotone" 
                    dataKey={selectedTab === 'consolidado' ? 'total' : selectedTab} 
                    stroke={selectedTab === 'consolidado' ? '#ff7a00' : platforms[selectedTab].color} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorGradient)" 
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Explanatory subtitle */}
            <div className="mt-4 text-xs text-slate-500 border-t border-slate-800/50 pt-3 flex items-center gap-1.5">
              <Clock size={12} />
              Los puntos representan las fechas clave del reporte del PDF (9 Enero, 9 Mayo) y las mediciones automatizadas posteriores.
            </div>
          </div>

          {/* Scraper / Pipeline Info Panel */}
          <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-bold font-outfit text-slate-200">Automatización Cron</h3>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                El dashboard se actualiza de forma autónoma diariamente a las <strong>7:00 AM (Morelos)</strong> utilizando la infraestructura sin servidor de GitHub Actions + Vercel:
              </p>

              <div className="space-y-3.5 text-xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-300 text-[10px] shrink-0 mt-0.5">1</div>
                  <div>
                    <strong className="text-slate-200 font-semibold block mb-0.5">Trigger diario (GitHub Actions)</strong>
                    Se levanta un contenedor Linux headless configurado con Google Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-300 text-[10px] shrink-0 mt-0.5">2</div>
                  <div>
                    <strong className="text-slate-200 font-semibold block mb-0.5">Script Extractor (Python)</strong>
                    Visita las páginas públicas, extrae los seguidores reales y los escribe en <code className="bg-slate-950 text-slate-300 text-[10px] px-1 py-0.5 rounded">src/data.js</code>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-300 text-[10px] shrink-0 mt-0.5">3</div>
                  <div>
                    <strong className="text-slate-200 font-semibold block mb-0.5">Despliegue Instantáneo</strong>
                    Se hace un push automático al repositorio, lo que dispara la compilación y actualización inmediata en Vercel.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 bg-slate-950/20 p-3 rounded-xl border border-slate-900">
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono block mb-1">Archivos del pipeline:</span>
              <ul className="space-y-1 font-mono text-[11px] text-slate-400">
                <li className="flex items-center gap-1"><CornerDownRight size={10} className="text-slate-650" /> <span className="text-orange-400/90">update_stats.py</span> (Scraper Core)</li>
                <li className="flex items-center gap-1"><CornerDownRight size={10} className="text-slate-650" /> <span className="text-blue-400/90">update_stats.yml</span> (GitHub Workflow)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Notes, Tasks, and Dependencies (Interactive) */}
        <section className="mb-10">
          <h2 className="text-xl font-bold font-outfit text-slate-200 mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-orange-400" /> Avance Operativo y Planificación
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Logros */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="font-bold font-outfit text-slate-200 flex items-center gap-2 text-md">
                    <span className="text-emerald-400">🏆</span> Logros de la Semana
                  </h3>
                  <span className="text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {notes.logros.length} items
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {notes.logros.map(note => (
                      <motion.div 
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex items-start gap-2 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 p-2.5 rounded-xl transition-all"
                      >
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5 text-xs">✓</span>
                        
                        {isEditingNote === note.id ? (
                          <div className="flex-1 flex gap-1">
                            <input 
                              type="text" 
                              value={editNoteText} 
                              onChange={(e) => setEditNoteText(e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-100 flex-1 focus:outline-none focus:border-orange-500"
                              autoFocus
                            />
                            <button onClick={() => saveEdit('logros', note.id)} className="p-1 text-green-400 hover:bg-slate-850 rounded"><CheckCircle size={14} /></button>
                            <button onClick={cancelEdit} className="p-1 text-red-400 hover:bg-slate-850 rounded"><AlertCircle size={14} /></button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs text-slate-300 flex-1 leading-relaxed cursor-pointer" onClick={() => startEditing(note)}>
                              {note.text}
                            </span>
                            <button 
                              onClick={() => deleteNote('logros', note.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 self-center"
                              title="Eliminar logro"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Add form */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Agregar logro..." 
                  value={newNoteTexts.logros}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, logros: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addNote('logros')}
                  className="bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 flex-1 focus:outline-none focus:border-orange-500/50"
                />
                <button 
                  onClick={() => addNote('logros')}
                  className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Column 2: Accionables */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="font-bold font-outfit text-slate-200 flex items-center gap-2 text-md">
                    <span className="text-orange-400">⚡</span> Accionables Próxima Semana
                  </h3>
                  <span className="text-xs font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                    {notes.accionables.filter(n => !n.completed).length} pendientes
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {notes.accionables.map(note => (
                      <motion.div 
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group flex items-start gap-2 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-850 p-2.5 rounded-xl transition-all ${note.completed ? 'opacity-50' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={note.completed} 
                          onChange={() => toggleAccionable(note.id)}
                          className="mt-0.5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900 cursor-pointer"
                        />
                        
                        {isEditingNote === note.id ? (
                          <div className="flex-1 flex gap-1">
                            <input 
                              type="text" 
                              value={editNoteText} 
                              onChange={(e) => setEditNoteText(e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-100 flex-1 focus:outline-none focus:border-orange-500"
                              autoFocus
                            />
                            <button onClick={() => saveEdit('accionables', note.id)} className="p-1 text-green-400 hover:bg-slate-850 rounded"><CheckCircle size={14} /></button>
                            <button onClick={cancelEdit} className="p-1 text-red-400 hover:bg-slate-850 rounded"><AlertCircle size={14} /></button>
                          </div>
                        ) : (
                          <>
                            <span 
                              className={`text-xs text-slate-300 flex-1 leading-relaxed cursor-pointer ${note.completed ? 'line-through text-slate-500' : ''}`}
                              onClick={() => startEditing(note)}
                            >
                              {note.text}
                            </span>
                            <button 
                              onClick={() => deleteNote('accionables', note.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 self-center"
                              title="Eliminar tarea"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Add form */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Agregar accionable..." 
                  value={newNoteTexts.accionables}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, accionables: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addNote('accionables')}
                  className="bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 flex-1 focus:outline-none focus:border-orange-500/50"
                />
                <button 
                  onClick={() => addNote('accionables')}
                  className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white rounded-xl transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Column 3: Dependencias */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="font-bold font-outfit text-slate-200 flex items-center gap-2 text-md">
                    <span className="text-sky-400">📌</span> Dependencias y Notas
                  </h3>
                  <span className="text-xs font-mono bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">
                    {notes.dependencias.length} items
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {notes.dependencias.map(note => (
                      <motion.div 
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex items-start gap-2 bg-slate-950/40 hover:bg-slate-950/70 border border-slate-855 p-2.5 rounded-xl transition-all"
                      >
                        <span className="text-sky-400 font-bold shrink-0 mt-0.5 text-xs">•</span>
                        
                        {isEditingNote === note.id ? (
                          <div className="flex-1 flex gap-1">
                            <input 
                              type="text" 
                              value={editNoteText} 
                              onChange={(e) => setEditNoteText(e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-100 flex-1 focus:outline-none focus:border-orange-500"
                              autoFocus
                            />
                            <button onClick={() => saveEdit('dependencias', note.id)} className="p-1 text-green-400 hover:bg-slate-850 rounded"><CheckCircle size={14} /></button>
                            <button onClick={cancelEdit} className="p-1 text-red-400 hover:bg-slate-850 rounded"><AlertCircle size={14} /></button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs text-slate-300 flex-1 leading-relaxed cursor-pointer" onClick={() => startEditing(note)}>
                              {note.text}
                            </span>
                            <button 
                              onClick={() => deleteNote('dependencias', note.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 self-center"
                              title="Eliminar dependencia"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Add form */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Agregar dependencia..." 
                  value={newNoteTexts.dependencias}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, dependencias: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addNote('dependencias')}
                  className="bg-slate-950/60 border border-slate-855 rounded-xl px-3 py-2 text-xs text-slate-300 flex-1 focus:outline-none focus:border-orange-500/50"
                />
                <button 
                  onClick={() => addNote('dependencias')}
                  className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white rounded-xl transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800/80 pt-8 text-center text-slate-550 text-xs">
          <p className="flex items-center justify-center gap-1.5">
            <span>Quadratín Morelos Social OKR Dashboard</span>
            <span>•</span>
            <span className="text-slate-500">Construido con React, Vite y Framer Motion</span>
          </p>
          <p className="mt-1 text-slate-600">
            Diseño Premium adaptado en colores Azul y Naranja de la identidad visual de Quadratín.
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
