import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BarChart3, Settings, Plus, Play, Trash2, Activity, Users, 
  Wallet, ShieldCheck, Link as LinkIcon, Bell, Search, CheckCircle2, Lock, 
  LogOut, UserCog, Database, Server, Briefcase, Clock, Cpu, HardDrive, 
  Network, StopCircle, RefreshCw, AlertTriangle, FileText, Download, 
  ChevronRight, ArrowUpRight, Zap, CreditCard 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';

// ==========================================
// MOCK DATABASE & SEED DATA
// ==========================================
const DB = {
  users: [
    { id: 'u1', username: 'admin', name: 'System Administrator', email: 'admin@subsync.io', role: 'admin', status: 'Active', department: 'Operations', lastLogin: 'Just now' },
    { id: 'u2', username: 'employee', name: 'Adwaitha Bini', email: 'adwaitha@subsync.io', role: 'employee', status: 'Active', department: 'Engineering', lastLogin: '2 hours ago' },
    { id: 'u3', username: 'user', name: 'Blesson Bright', email: 'blesson@subsync.io', role: 'user', status: 'Active', department: 'Product', lastLogin: '1 day ago' },
  ],
  tasks: [
    { id: 't1', title: 'Audit AWS Infrastructure', status: 'In Progress', priority: 'High', due: 'Today', assignee: 'Adwaitha Bini', estimatedHours: 4 },
    { id: 't2', title: 'Update Compliance Docs', status: 'Pending', priority: 'Medium', due: 'Tomorrow', assignee: 'Adwaitha Bini', estimatedHours: 2 },
    { id: 't3', title: 'Resolve Webhook Bugs', status: 'Completed', priority: 'High', due: 'Yesterday', assignee: 'Adwaitha Bini', estimatedHours: 6 },
    { id: 't4', title: 'Optimize Database Queries', status: 'Pending', priority: 'Low', due: 'Next Week', assignee: 'Adwaitha Bini', estimatedHours: 8 },
  ],
  targets: [
    { id: 1, name: 'Figma Professional', category: 'Design', cost: 15.00, status: 'Active', renewal: '2026-11-15' },
    { id: 2, name: 'GitHub Copilot', category: 'Development', cost: 10.00, status: 'Active', renewal: '2026-11-05' },
    { id: 3, name: 'AWS Cloud Compute', category: 'Infrastructure', cost: 145.50, status: 'Active', renewal: '2026-11-01' },
    { id: 4, name: 'Vercel Enterprise', category: 'Infrastructure', cost: 120.00, status: 'Pending', renewal: '2026-11-20' },
  ],
  timesheets: [
    { id: 'ts1', date: 'Oct 31', in: '09:00 AM', out: '05:30 PM', total: '8.5 hrs', status: 'Approved', project: 'Core Platform' },
    { id: 'ts2', date: 'Oct 30', in: '09:15 AM', out: '06:00 PM', total: '8.75 hrs', status: 'Approved', project: 'Client Portal' },
    { id: 'ts3', date: 'Oct 29', in: '08:50 AM', out: '05:10 PM', total: '8.3 hrs', status: 'Approved', project: 'Core Platform' },
  ],
  integrations: [
    { id: 'stripe', name: 'Stripe Billing', connected: true, lastSync: '10 mins ago' },
    { id: 'plaid', name: 'Plaid Bank Sync', connected: false, lastSync: 'Never' },
    { id: 'aws', name: 'AWS Cost Explorer', connected: false, lastSync: 'Never' },
    { id: 'slack', name: 'Slack Notifications', connected: true, lastSync: '1 min ago' },
  ],
  logs: [
    { id: 'l1', level: 'CRITICAL', msg: 'Multiple failed logins detected on root account', time: '10 mins ago', source: 'Auth Service' },
    { id: 'l2', level: 'INFO', msg: 'Database backup completed successfully', time: '1 hour ago', source: 'Cron Job' },
    { id: 'l3', level: 'WARNING', msg: 'High memory usage on Node-2', time: '2 hours ago', source: 'Infrastructure' },
    { id: 'l4', level: 'INFO', msg: 'New user provisioned: Adwaitha Bini', time: '5 hours ago', source: 'Admin Console' },
  ],
  metrics: {
    revenue: [{ month: 'Jun', value: 45000 }, { month: 'Jul', value: 52000 }, { month: 'Aug', value: 58000 }, { month: 'Sep', value: 61000 }, { month: 'Oct', value: 74000 }, { month: 'Nov', value: 82000 }],
    spend: [{ month: 'Jun', value: 45 }, { month: 'Jul', value: 55 }, { month: 'Aug', value: 67 }, { month: 'Sep', value: 45 }, { month: 'Oct', value: 85 }, { month: 'Nov', value: 170.5 }],
    velocity: [{ week: 'W1', tickets: 12 }, { week: 'W2', tickets: 18 }, { week: 'W3', tickets: 15 }, { week: 'W4', tickets: 22 }],
    allocation: [{ name: 'Infrastructure', value: 400 }, { name: 'Software', value: 300 }, { name: 'Marketing', value: 300 }, { name: 'Operations', value: 200 }]
  }
};

const PIE_COLORS = ['#ea580c', '#f59e0b', '#3b82f6', '#10b981'];

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [appState, setAppState] = useState<'auth' | 'loading' | 'active'>('auth');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data States
  const [targets, setTargets] = useState(DB.targets);
  const [tasks, setTasks] = useState(DB.tasks);
  const [timesheets, setTimesheets] = useState(DB.timesheets);
  const [integrations, setIntegrations] = useState(DB.integrations);
  const [systemLogs, setSystemLogs] = useState(DB.logs);
  
  // Interactive States
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'addTarget' | 'addTask' | 'exportReport'>('none');
  const [formData, setFormData] = useState<any>({});

  // --- AUTHENTICATION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('loading');
    setTimeout(() => {
      const user = DB.users.find(u => u.username === formData.username?.toLowerCase()) || DB.users[2];
      setCurrentUser(user);
      setCurrentView('dashboard');
      setAppState('active');
    }, 1500);
  };

  const handleLogout = () => {
    setAppState('loading');
    setTimeout(() => {
      setCurrentUser(null);
      setFormData({});
      setAppState('auth');
    }, 1000);
  };

  // --- ACTIONS ---
  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'addTarget') {
      setTargets([{ id: Date.now(), name: formData.name, cost: parseFloat(formData.cost), category: formData.category || 'Software', status: 'Active', renewal: formData.renewal || '2026-12-01' }, ...targets]);
    } else if (activeModal === 'addTask') {
      setTasks([{ id: `t${Date.now()}`, title: formData.title, status: 'Pending', priority: formData.priority || 'Medium', due: formData.due, assignee: currentUser.name, estimatedHours: formData.hours || 4 }, ...tasks]);
    }
    setActiveModal('none');
    setFormData({});
  };

  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  const toggleIntegration = (id: string) => setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected, lastSync: !i.connected ? 'Just now' : i.lastSync } : i));
  const handleClockInOut = () => {
    if (isClockedIn) {
      setTimesheets([{ id: `ts${Date.now()}`, date: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric'}), in: '09:00 AM', out: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}), total: '8.0 hrs', status: 'Pending Review', project: 'Current Assignment' }, ...timesheets]);
    }
    setIsClockedIn(!isClockedIn);
  };
  const triggerExport = () => {
    setActiveModal('none');
    alert('Report generation initiated. Download will begin shortly.');
  };

  // ==========================================
  // VIEW: AUTHENTICATION
  // ==========================================
  if (appState === 'auth') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-orange-500 font-sans">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 lg:p-20 flex flex-col justify-center relative">
            <div className="mb-12">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-4xl mb-8 shadow-lg shadow-orange-900/50 transform -rotate-3 hover:rotate-0 transition-transform">S</div>
              <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">System<br/>Login</h1>
              <p className="text-zinc-400 font-medium mt-4 text-lg">Authenticate to access enterprise workspace.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-xs font-bold bg-zinc-900 text-zinc-400 px-4 py-2 rounded-full border border-zinc-800 uppercase tracking-widest hover:text-white transition-colors cursor-default">admin</span>
                <span className="text-xs font-bold bg-zinc-900 text-zinc-400 px-4 py-2 rounded-full border border-zinc-800 uppercase tracking-widest hover:text-white transition-colors cursor-default">employee</span>
                <span className="text-xs font-bold bg-zinc-900 text-zinc-400 px-4 py-2 rounded-full border border-zinc-800 uppercase tracking-widest hover:text-white transition-colors cursor-default">user</span>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Workspace ID</label>
                <input type="text" required onChange={e => setFormData({...formData, username: e.target.value})} placeholder="e.g. admin" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 font-bold transition-colors text-lg"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Passcode</label>
                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 font-bold transition-colors text-lg"/>
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-xl transition-all shadow-lg shadow-orange-900/40 mt-8 flex justify-center items-center gap-3 text-lg uppercase tracking-wider active:scale-[0.98]">
                <Lock size={20}/> Authenticate Session
              </button>
            </form>
          </div>
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-600 via-orange-700 to-amber-700 p-20 relative overflow-hidden">
            <div className="absolute -right-32 -top-32 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -left-32 -bottom-32 w-[40rem] h-[40rem] bg-black/40 rounded-full blur-[100px] pointer-events-none"></div>
            <span className="bg-black/30 self-start px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 z-10 text-white shadow-xl">Make-a-Ton 9.0 Core</span>
            <div className="z-10 mt-auto space-y-6">
              <h2 className="text-7xl font-black tracking-tighter leading-[0.85] text-white mix-blend-overlay">SUBSYNC<br/>PLATFORM<br/>V2.0.</h2>
              <p className="text-orange-100/80 font-medium text-2xl max-w-md leading-snug">Multi-tenant financial radar, burn-rate analytics, and operational command center.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOADING
  // ==========================================
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-24 h-24 bg-orange-600/20 rounded-3xl absolute inset-0 animate-ping"></div>
          <div className="w-24 h-24 bg-orange-600 rounded-3xl flex items-center justify-center font-black text-5xl mb-8 relative z-10 shadow-[0_0_80px_rgba(234,88,12,0.8)]">S</div>
        </div>
        <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-sm mt-8">
          <RefreshCw size={18} className="animate-spin text-orange-500"/> Establishing Handshake...
        </div>
        <div className="w-64 h-1 bg-zinc-900 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-orange-500 w-1/2 animate-[pulse_1s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD LAYOUT & ROUTING
  // ==========================================
  const renderNavLinks = () => {
    const links = [{ id: 'dashboard', icon: LayoutDashboard, label: 'Overview' }];
    
    if (currentUser.role === 'admin') {
      links.push({ id: 'users', icon: Users, label: 'Directory' }, { id: 'system', icon: Server, label: 'Infrastructure' }, { id: 'audit', icon: FileText, label: 'Audit Logs' });
    }
    if (currentUser.role === 'employee') {
      links.push({ id: 'tasks', icon: Briefcase, label: 'Task Board' }, { id: 'timesheets', icon: Clock, label: 'Timesheets' }, { id: 'performance', icon: Activity, label: 'My Performance' });
    }
    if (currentUser.role === 'user') {
      links.push({ id: 'billing', icon: CreditCard, label: 'Billing Details' }, { id: 'integrations', icon: LinkIcon, label: 'Integrations' });
    }
    links.push({ id: 'analytics', icon: BarChart3, label: 'Analytics' }, { id: 'settings', icon: Settings, label: 'Settings' });

    return links.map(link => (
      <button key={link.id} onClick={() => setCurrentView(link.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${currentView === link.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'}`}>
        <link.icon size={18} className={currentView === link.id ? 'text-white' : 'text-zinc-500'} /> {link.label}
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} hidden lg:flex flex-col border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-2xl transition-all duration-300 z-20`}>
        <div className="p-6 flex items-center gap-4 border-b border-zinc-900 h-24 shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-orange-900/40">S</div>
          {isSidebarOpen && (
            <div className="flex flex-col justify-center overflow-hidden">
              <span className="font-black text-xl uppercase tracking-tight leading-none">Subsync</span>
              <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mt-1">{currentUser.role} PORTAL</span>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {renderNavLinks()}
        </div>
        <div className="p-6 border-t border-zinc-900 shrink-0">
          <div className={`flex items-center gap-4 ${!isSidebarOpen && 'justify-center'} bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md`}>
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-black shrink-0 border border-zinc-700 shadow-inner text-lg">{currentUser.name.charAt(0)}</div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white leading-tight">{currentUser.name}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{currentUser.email}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={18} /> {isSidebarOpen && 'Secure Logout'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505] relative">
        <header className="h-24 border-b border-zinc-900 bg-black/90 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors border border-zinc-800">
              <MenuToggleIcon isOpen={isSidebarOpen} />
            </button>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-100">{currentView.replace('-', ' ')}</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1 hidden sm:block">Subsync Workspace / {currentUser.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"/>
              <input type="text" placeholder="Search workspace..." className="bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-6 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-72 transition-all font-medium"/>
            </div>
            <button onClick={() => setActiveModal('exportReport')} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-bold uppercase tracking-wider transition-colors text-zinc-300">
              <Download size={14}/> Export
            </button>
            <button className="relative p-3 text-zinc-400 hover:text-white transition-colors bg-zinc-900 rounded-full border border-zinc-800">
              <Bell size={18}/>
              <span className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full border-[3px] border-zinc-900"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 animate-in fade-in duration-500 custom-scrollbar">
          
          {/* ======================================= */}
          {/* ADMIN VIEWS                               */}
          {/* ======================================= */}
          {currentUser.role === 'admin' && currentView === 'dashboard' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Monthly Recurring Rev" value="$82,450" icon={Database} color="orange" trend="+12.4%" />
                <StatCard title="Active Workspaces" value="1,248" icon={Users} color="blue" trend="+3.2%" />
                <StatCard title="System Uptime" value="99.99%" icon={Activity} color="emerald" trend="Stable" />
                <StatCard title="Open Security Alerts" value="0" icon={ShieldCheck} color="purple" trend="-2" />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-sm">Global Revenue Trajectory</h3>
                    <select className="bg-zinc-900 border border-zinc-800 text-xs font-bold px-3 py-1.5 rounded-lg text-zinc-300 focus:outline-none"><option>Last 6 Months</option><option>YTD</option></select>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DB.metrics.revenue}>
                        <defs><linearGradient id="cRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/><stop offset="95%" stopColor="#ea580c" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="month" stroke="#71717a" tickLine={false} axisLine={false} dy={10} fontSize={12} fontWeight="bold"/>
                        <YAxis stroke="#71717a" tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`} dx={-10} fontSize={12} fontWeight="bold"/>
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', fontWeight: 'bold' }} itemStyle={{color: '#fff'}} cursor={{stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4'}} />
                        <Area type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={4} fill="url(#cRev)" activeDot={{r: 8, strokeWidth: 0, fill: '#ea580c'}} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 shadow-xl flex flex-col">
                  <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-sm mb-6">Resource Allocation</h3>
                  <div className="flex-1 flex flex-col justify-center relative min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={DB.metrics.allocation} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                          {DB.metrics.allocation.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontWeight: 'bold', border: 'none' }} itemStyle={{color: '#fff'}} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-white">$1.2M</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Total CapEx</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {DB.metrics.allocation.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: PIE_COLORS[i]}}></div>
                        <span className="text-xs font-bold text-zinc-300">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && currentView === 'users' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-zinc-950 p-8 rounded-[2rem] border border-zinc-900 shadow-lg gap-4">
                <div><h2 className="text-3xl font-black uppercase tracking-tight">Active Directory</h2><p className="text-zinc-500 text-sm mt-2 font-bold">Manage workspace access, roles, and permissions.</p></div>
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-black px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 whitespace-nowrap"><Plus size={18}/> Provision User</button>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-900/40 text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                      <tr><th className="p-6 font-bold">Identity</th><th className="p-6 font-bold">Department</th><th className="p-6 font-bold">Role Level</th><th className="p-6 font-bold">Status</th><th className="p-6 font-bold">Last Active</th><th className="p-6"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {DB.users.map(u => (
                        <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-zinc-400 border border-zinc-700">{u.name.charAt(0)}</div>
                              <div><p className="font-bold text-white text-base leading-tight">{u.name}</p><p className="text-xs text-zinc-500 font-medium mt-1">{u.email}</p></div>
                            </div>
                          </td>
                          <td className="p-6 font-bold text-sm text-zinc-300">{u.department}</td>
                          <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${u.role === 'admin' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : u.role === 'employee' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-zinc-700 text-zinc-400 bg-zinc-800'}`}>{u.role}</span></td>
                          <td className="p-6"><span className="text-emerald-400 font-bold text-sm flex items-center gap-2 bg-emerald-500/10 w-max px-3 py-1 rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>{u.status}</span></td>
                          <td className="p-6 text-sm text-zinc-400 font-bold">{u.lastLogin}</td>
                          <td className="p-6 text-right"><button className="text-zinc-500 hover:text-white font-bold text-sm bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl transition-colors border border-zinc-800 opacity-0 group-hover:opacity-100">Manage</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && currentView === 'system' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                  <Cpu className="text-blue-500 mb-6" size={36}/>
                  <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Compute Load</h3>
                  <div className="flex items-end gap-3"><p className="text-5xl font-black text-white">42%</p><span className="text-blue-500 font-bold text-sm mb-1.5 flex items-center"><ArrowUpRight size={16}/> 2%</span></div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full mt-6 overflow-hidden"><div className="bg-blue-500 h-full w-[42%]"></div></div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                  <HardDrive className="text-purple-500 mb-6" size={36}/>
                  <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Memory Allocation</h3>
                  <div className="flex items-end gap-3"><p className="text-5xl font-black text-white">12.4<span className="text-2xl text-zinc-500 ml-1">GB</span></p></div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full mt-6 overflow-hidden"><div className="bg-purple-500 h-full w-[65%]"></div></div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                  <Network className="text-emerald-500 mb-6" size={36}/>
                  <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Active TCP Conns</h3>
                  <div className="flex items-end gap-3"><p className="text-5xl font-black text-white">1,204</p></div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full mt-6 overflow-hidden"><div className="bg-emerald-500 h-full w-[80%]"></div></div>
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && currentView === 'audit' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
                  <div><h3 className="font-black text-2xl uppercase">System Audit Trails</h3><p className="text-sm font-bold text-zinc-500 mt-1">Immutable security and operational logs.</p></div>
                  <button className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors border border-zinc-800"><Download size={18}/></button>
                </div>
                <div className="divide-y divide-zinc-900/50">
                  {systemLogs.map(log => (
                    <div key={log.id} className="p-6 hover:bg-zinc-900/20 transition-colors flex items-start gap-6">
                      <div className={`mt-1 p-2.5 rounded-xl border ${log.level === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-500' : log.level === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500'}`}>
                        {log.level === 'CRITICAL' ? <AlertTriangle size={20}/> : log.level === 'WARNING' ? <Activity size={20}/> : <ShieldCheck size={20}/>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${log.level === 'CRITICAL' ? 'text-red-400' : log.level === 'WARNING' ? 'text-amber-400' : 'text-blue-400'}`}>{log.level}</span>
                          <span className="text-zinc-600 font-bold text-xs">•</span>
                          <span className="text-zinc-400 font-bold text-xs uppercase tracking-wider">{log.source}</span>
                          <span className="text-zinc-600 font-bold text-xs">•</span>
                          <span className="text-zinc-500 font-bold text-xs">{log.time}</span>
                        </div>
                        <p className="font-bold text-white text-lg">{log.msg}</p>
                      </div>
                      <button className="px-4 py-2 bg-zinc-900 rounded-xl text-xs font-bold text-zinc-400 border border-zinc-800 hover:text-white transition-colors">Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* EMPLOYEE VIEWS                            */}
          {/* ======================================= */}
          {currentUser.role === 'employee' && (currentView === 'dashboard' || currentView === 'tasks') && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              {currentView === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-8 rounded-[2rem] border border-blue-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    <h3 className="text-blue-200 font-bold text-xs uppercase tracking-widest mb-2">My Open Tickets</h3>
                    <div className="flex items-end gap-3"><p className="text-6xl font-black text-white">{tasks.filter(t => t.status !== 'Completed').length}</p><span className="text-blue-300 font-bold mb-2">High Priority</span></div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl">
                    <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Hours Logged (Week)</h3>
                    <div className="flex items-end gap-3"><p className="text-6xl font-black text-white">34.5<span className="text-2xl text-zinc-600 font-black ml-2">/ 40</span></p></div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full mt-6 overflow-hidden"><div className="bg-orange-500 h-full w-[85%]"></div></div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl">
                    <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Sprint Velocity</h3>
                    <p className="text-6xl font-black text-emerald-400">92%</p>
                    <p className="text-sm font-bold text-zinc-400 mt-4">Top 10% in Engineering</p>
                  </div>
                </div>
              )}

              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                  <div><h3 className="font-black text-2xl uppercase tracking-tight">Active Assignments</h3><p className="text-sm font-bold text-zinc-500 mt-1">Drag or toggle to update ticket status.</p></div>
                  <button onClick={() => setActiveModal('addTask')} className="bg-orange-600 hover:bg-orange-500 text-white font-black px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 whitespace-nowrap"><Plus size={18}/> Draft Task</button>
                </div>
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div key={task.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-orange-500/30 hover:bg-zinc-900/80 transition-all gap-6 group">
                      <div className="flex items-start gap-5">
                        <div className={`mt-1 p-3 rounded-2xl border ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                          {task.status === 'Completed' ? <CheckCircle2 size={24}/> : task.status === 'In Progress' ? <Activity size={24}/> : <Briefcase size={24}/>}
                        </div>
                        <div>
                          <p className={`font-black text-xl leading-tight ${task.status === 'Completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>{task.title}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold uppercase tracking-wider">
                            <span className={`px-2.5 py-1 rounded-md bg-zinc-950 border ${task.priority === 'High' ? 'text-red-400 border-red-500/30' : task.priority === 'Medium' ? 'text-amber-400 border-amber-500/30' : 'text-blue-400 border-blue-500/30'}`}>{task.priority} Priority</span>
                            <span className="text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">Due {task.due}</span>
                            <span className="text-zinc-500 hidden sm:block">Est: {task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end lg:self-auto">
                        <button onClick={() => toggleTask(task.id)} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border shadow-sm ${task.status === 'Completed' ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white' : 'bg-zinc-100 text-black border-transparent hover:bg-white'}`}>
                          {task.status === 'Completed' ? 'Reopen' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && <div className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-2xl"><p className="text-xl font-black text-zinc-600 uppercase tracking-widest">Inbox Zero</p></div>}
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'employee' && currentView === 'timesheets' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-zinc-950 p-8 rounded-[2rem] border border-zinc-900 shadow-xl gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="z-10">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Time & Attendance</h2>
                  <p className="text-zinc-500 text-sm mt-2 font-bold">Immutable ledger of recorded hours.</p>
                </div>
                <div className="flex items-center gap-4 z-10">
                  {isClockedIn && <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm uppercase tracking-wider"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Active Shift</div>}
                  <button onClick={handleClockInOut} className={`${isClockedIn ? 'bg-red-500 hover:bg-red-600 shadow-red-900/40' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40'} text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all text-lg uppercase tracking-wider whitespace-nowrap active:scale-95`}>
                    {isClockedIn ? <StopCircle size={22}/> : <Play size={22}/>} {isClockedIn ? 'Clock Out' : 'Clock In Now'}
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-900/40 text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                      <tr><th className="p-6 font-bold">Shift Date</th><th className="p-6 font-bold">Project Code</th><th className="p-6 font-bold">Clock In</th><th className="p-6 font-bold">Clock Out</th><th className="p-6 font-bold">Total Hrs</th><th className="p-6 font-bold">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {timesheets.map(ts => (
                        <tr key={ts.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="p-6 font-black text-white text-lg">{ts.date}</td>
                          <td className="p-6 text-zinc-300 font-bold">{ts.project}</td>
                          <td className="p-6 text-zinc-400 font-bold font-mono text-sm">{ts.in}</td>
                          <td className="p-6 text-zinc-400 font-bold font-mono text-sm">{ts.out}</td>
                          <td className="p-6 font-black text-orange-400 text-lg">{ts.total}</td>
                          <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${ts.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{ts.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* USER VIEWS                                */}
          {/* ======================================= */}
          {currentUser.role === 'user' && currentView === 'dashboard' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-colors pointer-events-none"></div>
                  <Wallet className="text-orange-500 mb-6" size={32}/>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Total Monthly Burn</p>
                  <p className="text-6xl font-black mt-2 text-white">${targets.reduce((a, b) => a + b.cost, 0).toFixed(2)}</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>
                  <Activity className="text-blue-500 mb-6" size={32}/>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Tracked Subscriptions</p>
                  <p className="text-6xl font-black mt-2 text-white">{targets.length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-8 rounded-[2rem] shadow-xl shadow-orange-900/20 flex flex-col justify-center items-center text-center cursor-pointer transform hover:-translate-y-2 transition-transform border border-orange-500" onClick={() => setActiveModal('addTarget')}>
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white mb-6 backdrop-blur-md shadow-inner"><Plus size={40} strokeWidth={3}/></div>
                  <h3 className="font-black text-2xl text-white tracking-tight">Sync New Target</h3>
                  <p className="text-orange-100/80 font-bold mt-2">Connect a new subscription</p>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                  <h3 className="font-black text-2xl uppercase tracking-tight">Active Portfolio</h3>
                  <button className="text-zinc-400 hover:text-white font-bold text-sm bg-zinc-900 px-4 py-2 rounded-xl transition-colors border border-zinc-800">Filter</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-zinc-900/40 text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                      <tr><th className="p-6 font-bold">Service Target</th><th className="p-6 font-bold">Sector</th><th className="p-6 font-bold">Monthly Impact</th><th className="p-6 font-bold">Next Billing</th><th className="p-6 font-bold">Status</th><th className="p-6"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {targets.map(target => (
                        <tr key={target.id} className="hover:bg-zinc-900/30 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-zinc-400 text-xl">{target.name.charAt(0)}</div>
                              <span className="font-black text-xl text-white">{target.name}</span>
                            </div>
                          </td>
                          <td className="p-6 text-zinc-400 font-bold">{target.category}</td>
                          <td className="p-6 font-black text-orange-400 text-xl">${target.cost.toFixed(2)}</td>
                          <td className="p-6 text-zinc-300 font-bold text-sm">{target.renewal}</td>
                          <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${target.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{target.status}</span></td>
                          <td className="p-6 text-right"><button onClick={() => deleteTarget(target.id)} className="p-2.5 bg-zinc-900 hover:bg-red-900/30 rounded-xl text-zinc-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/30 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {targets.length === 0 && <div className="p-20 text-center flex flex-col items-center"><div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 mb-4"><Search size={32}/></div><p className="text-2xl font-black text-zinc-600 uppercase tracking-widest">No active targets found</p></div>}
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'user' && currentView === 'integrations' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="mb-10">
                <h2 className="text-4xl font-black uppercase tracking-tight">External Data Links</h2>
                <p className="text-zinc-500 font-bold mt-2">Connect Subsync to your existing financial ecosystem for automated discovery.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {integrations.map(plugin => (
                  <div key={plugin.id} className={`p-8 rounded-[2rem] border-2 transition-all duration-300 ${plugin.connected ? 'bg-zinc-950 border-orange-500/40 shadow-[0_0_30px_rgba(234,88,12,0.1)]' : 'bg-zinc-950 border-zinc-900'}`}>
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 rounded-2xl ${plugin.connected ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/50' : 'bg-zinc-900 text-zinc-500'}`}><LinkIcon size={28}/></div>
                      {plugin.connected && <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Live</span>}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{plugin.name}</h3>
                    <p className="text-zinc-500 font-bold text-sm mb-8">Last Sync: <span className="text-zinc-300">{plugin.lastSync}</span></p>
                    <button onClick={() => toggleIntegration(plugin.id)} className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${plugin.connected ? 'bg-zinc-900 text-zinc-400 hover:text-red-400 border border-zinc-800' : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/40'}`}>{plugin.connected ? 'Sever Connection' : 'Initialize Auth'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* SHARED VIEWS                              */}
          {/* ======================================= */}
          {currentView === 'analytics' && currentUser.role !== 'admin' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-black uppercase tracking-tight">{currentUser.role === 'employee' ? 'Velocity & Output' : 'Burn Trajectory'}</h2>
                <p className="text-zinc-500 font-bold mt-2">Historical data visualization and forecasting.</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] h-[550px] shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-sm">{currentUser.role === 'employee' ? 'Tickets Resolved (Trailing 4 Weeks)' : 'Monthly Spend vs Budget'}</h3>
                  <button className="bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors border border-zinc-800">Download CSV</button>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  {currentUser.role === 'employee' ? (
                    <BarChart data={DB.metrics.velocity} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
                      <XAxis dataKey="week" stroke="#71717a" tickLine={false} axisLine={false} dy={10} fontFamily="monospace" fontWeight="bold"/>
                      <YAxis stroke="#71717a" tickLine={false} axisLine={false} dx={-10} fontFamily="monospace" fontWeight="bold"/>
                      <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor:'#09090b',borderColor:'#27272a',borderRadius:'16px', fontWeight: 'bold'}} itemStyle={{color: '#fff'}}/>
                      <Bar dataKey="tickets" fill="#3b82f6" radius={[8,8,0,0]} barSize={60} />
                    </BarChart>
                  ) : (
                    <AreaChart data={DB.metrics.spend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs><linearGradient id="cArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/><stop offset="95%" stopColor="#ea580c" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
                      <XAxis dataKey="month" stroke="#71717a" tickLine={false} axisLine={false} dy={10} fontWeight="bold"/>
                      <YAxis stroke="#71717a" tickLine={false} axisLine={false} dx={-10} tickFormatter={v=>`$${v}`} fontWeight="bold"/>
                      <Tooltip contentStyle={{backgroundColor:'#09090b',borderColor:'#27272a',borderRadius:'16px',fontWeight:'bold'}} itemStyle={{color: '#fff'}}/>
                      <Area type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={4} fill="url(#cArea)" activeDot={{r:8,strokeWidth:0,fill:'#ea580c'}} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="max-w-4xl space-y-8 mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-black uppercase tracking-tight">Configuration</h2>
                <p className="text-zinc-500 font-bold mt-2">Manage preferences and security parameters.</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-10 shadow-xl space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-10 gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shrink-0"><ShieldCheck size={32}/></div>
                    <div><h3 className="font-black text-2xl">End-to-End Encryption</h3><p className="text-base text-zinc-500 font-medium mt-1 max-w-md">Enforce AES-256 military-grade encryption for all stored financial metrics and tokens locally.</p></div>
                  </div>
                  <div className="w-16 h-8 bg-emerald-500 rounded-full relative shadow-[0_0_30px_rgba(16,185,129,0.3)] cursor-pointer shrink-0"><div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1"></div></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-10 gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shrink-0"><Bell size={32}/></div>
                    <div><h3 className="font-black text-2xl">Push Notifications</h3><p className="text-base text-zinc-500 font-medium mt-1 max-w-md">Receive critical system alerts, ticket updates, and upcoming billing renewals.</p></div>
                  </div>
                  <div className="w-16 h-8 bg-orange-600 rounded-full relative shadow-[0_0_30px_rgba(234,88,12,0.4)] cursor-pointer shrink-0"><div className="w-6 h-6 bg-white rounded-full absolute right-1 top-1"></div></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0"><Trash2 size={32}/></div>
                    <div><h3 className="font-black text-2xl text-red-500">Danger Zone</h3><p className="text-base text-zinc-500 font-medium mt-1 max-w-md">Permanently purge all workspace data. This action cannot be undone.</p></div>
                  </div>
                  <button className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-base font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/30 whitespace-nowrap active:scale-95">Purge Data</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================== */}
      {/* UNIVERSAL MODALS                           */}
      {/* ========================================== */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl relative">
            
            {activeModal === 'exportReport' ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4"><Download className="text-orange-500" size={40}/></div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Export Workspace Data</h2>
                <p className="text-zinc-400 font-medium text-lg">Generate a complete CSV report of your current view.</p>
                <div className="pt-6 flex gap-4">
                  <button onClick={() => setActiveModal('none')} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl text-lg">Cancel</button>
                  <button onClick={triggerExport} className="w-1/2 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-900/50 text-lg">Download CSV</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black tracking-tight mb-8 uppercase flex items-center gap-3">
                  <Plus className="text-orange-500" size={32}/> {activeModal === 'addTarget' ? 'New Target' : 'New Assignment'}
                </h2>
                <form onSubmit={handleCreateEntity} className="space-y-5">
                  {activeModal === 'addTarget' ? (
                    <>
                      <input required type="text" onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Service Name (e.g. AWS)" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg"/>
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="number" step="0.01" onChange={e => setFormData({...formData, cost: e.target.value})} placeholder="Monthly Cost ($0.00)" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg"/>
                        <input required type="date" onChange={e => setFormData({...formData, renewal: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg [color-scheme:dark]"/>
                      </div>
                      <select onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-zinc-400 focus:outline-none focus:border-orange-500 font-bold text-lg appearance-none">
                        <option value="" disabled selected>Select Category...</option><option>Infrastructure</option><option>Software</option><option>Marketing</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <input required type="text" onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Task Title" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg"/>
                      <div className="grid grid-cols-2 gap-4">
                        <select onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg appearance-none"><option>Medium</option><option>High</option><option>Low</option></select>
                        <input type="text" placeholder="Due Date (e.g. Tomorrow)" required onChange={e => setFormData({...formData, due: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg"/>
                      </div>
                      <input required type="number" onChange={e => setFormData({...formData, hours: e.target.value})} placeholder="Estimated Hours" className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-orange-500 font-bold text-lg"/>
                    </>
                  )}
                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setActiveModal('none')} className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl text-lg transition-colors">Cancel</button>
                    <button type="submit" className="w-2/3 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-900/50 text-lg uppercase tracking-wider transition-all active:scale-[0.98]">Confirm</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
const MenuToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {isOpen ? <path d="M19 12H5M12 19l-7-7 7-7"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
  </svg>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => {
  const colors: Record<string, string> = { orange: 'text-orange-500 bg-orange-500/10', blue: 'text-blue-500 bg-blue-500/10', emerald: 'text-emerald-500 bg-emerald-500/10', purple: 'text-purple-500 bg-purple-500/10'};
  return (
    <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-xl flex flex-col justify-between relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl transition-colors pointer-events-none ${colors[color].split(' ')[1]}`}></div>
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${colors[color]}`}><Icon size={28} /></div>
        <span className="text-xs font-black bg-zinc-900 px-3 py-1.5 rounded-lg text-zinc-400 border border-zinc-800 uppercase tracking-widest">{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1.5">{title}</p><p className="text-4xl lg:text-5xl font-black text-white">{value}</p>
      </div>
    </div>
  );
};