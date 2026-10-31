import { useState } from 'react'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  
  // Form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'features' | 'benefits' | 'partners'>('products')

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Figma Professional', cost: 15.00, status: 'Active', category: 'Design' },
    { id: 2, name: 'GitHub Copilot', cost: 10.00, status: 'Active', category: 'Development' },
    { id: 3, name: 'Netflix Premium', cost: 22.99, status: 'Active', category: 'Entertainment' },
  ])
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCost, setNewCost] = useState('')
  const [newCategory, setNewCategory] = useState('Development')

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
  }

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newCost) return
    setSubscriptions([
      ...subscriptions,
      { id: Date.now(), name: newName, cost: parseFloat(newCost), status: 'Active', category: newCategory }
    ])
    setNewName('')
    setNewCost('')
    setIsAddModalOpen(false)
  }

  const handleDeleteSub = (id: number) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id))
  }

  const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.cost, 0).toFixed(2)

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('products')}>
          <span className="text-xl font-black tracking-tighter bg-orange-600 text-white px-2.5 py-1 rounded">S</span>
          <span className="text-xl font-bold tracking-tight">Subsync</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-full">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'products' ? 'bg-orange-600 text-white font-bold shadow' : 'hover:text-white'}`}>Products</button>
          <button onClick={() => setActiveTab('features')} className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'features' ? 'bg-orange-600 text-white font-bold shadow' : 'hover:text-white'}`}>Features</button>
          <button onClick={() => setActiveTab('benefits')} className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'benefits' ? 'bg-orange-600 text-white font-bold shadow' : 'hover:text-white'}`}>Benefits</button>
          <button onClick={() => setActiveTab('partners')} className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'partners' ? 'bg-orange-600 text-white font-bold shadow' : 'hover:text-white'}`}>Partners</button>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <span className="text-xs font-bold bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-orange-400">
              🟢 Connected ({username || 'User'})
            </span>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
            >
              Log In
            </button>
          )}
          <button 
            onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-orange-900/20 cursor-pointer active:scale-95"
          >
            {isLoggedIn ? '+ Add Service' : 'Sign up ↗'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-8 py-16 max-w-7xl mx-auto">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Trusted Protection & Expert Guidance</span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
                Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Financial</span> Future
              </h1>
              <p className="text-zinc-400 text-lg max-w-xl font-medium">
                Simplify your accounts automatically and track recurring subscriptions in real-time with zero friction.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      setIsAddModalOpen(true)
                    } else {
                      setAuthMode('signup')
                      setIsAuthModalOpen(true)
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-8 py-4 rounded-full text-base transition-all shadow-xl shadow-orange-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  {isLoggedIn ? 'ADD SUBSCRIPTION' : 'GET STARTED'} <span>↗</span>
                </button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-600 p-6 rounded-3xl flex flex-col justify-between shadow-2xl transform hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">🔥</div>
                <div>
                  <h3 className="text-4xl font-black text-white">500k+</h3>
                  <p className="text-orange-100 text-sm font-medium mt-1">Active users managing subscriptions seamlessly.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between shadow-2xl transform hover:-translate-y-1 transition-transform">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Total</span>
                <div>
                  <p className="text-3xl font-black text-white">${totalMonthly}</p>
                  <p className="text-zinc-400 text-xs mt-1">Across {subscriptions.length} tracked services</p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Subscriptions</span>
                  <button 
                    onClick={() => {
                      if (isLoggedIn) setIsAddModalOpen(true)
                      else { setAuthMode('signup'); setIsAuthModalOpen(true); }
                    }}
                    className="text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    + Add New
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {subscriptions.length === 0 ? (
                    <p className="text-zinc-500 text-sm py-4 text-center">No subscriptions tracked yet.</p>
                  ) : (
                    subscriptions.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center py-2.5 border-b border-zinc-800/60 text-sm group">
                        <div>
                          <span className="font-semibold text-zinc-200 block">{sub.name}</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{sub.category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-orange-400">${sub.cost.toFixed(2)}</span>
                          <button 
                            onClick={() => handleDeleteSub(sub.id)}
                            className="text-zinc-600 hover:text-red-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div>
              <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Core Capabilities</span>
              <h2 className="text-4xl font-black uppercase tracking-tight mt-1">Platform Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold">Real-Time Sync</h3>
                <p className="text-zinc-400 text-sm">Automatically calculates monthly burn rates and flags duplicate charges.</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold">Bank-Grade Vault</h3>
                <p className="text-zinc-400 text-sm">Encrypted token storage ensuring complete security over your accounts.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div>
              <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Why Subsync</span>
              <h2 className="text-4xl font-black uppercase tracking-tight mt-1">Financial Benefits</h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <span className="font-bold text-zinc-300">Average Annual Savings</span>
                <span className="text-2xl font-black text-orange-500">$420.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-300">Hidden Subscription Detection</span>
                <span className="text-xl font-bold text-emerald-400">100% Automated</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto text-center py-12">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Ecosystem</span>
            <h2 className="text-4xl font-black uppercase tracking-tight mt-1">Our Trusted Partners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6">
              {['FIGMA', 'GITHUB', 'NETFLIX', 'STRIPE', 'DISCORD', 'AWS'].map((partner, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 py-8 rounded-2xl font-black tracking-wider text-xl text-zinc-400 hover:text-white hover:border-orange-500 transition-all">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Split-Screen Login / Signup Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2">
            
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold text-xl z-10 cursor-pointer bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center">✕</button>

            {/* Left Side: Form */}
            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-zinc-400 text-sm mt-1">Enter your account details to continue</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Username / Email</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="blesson_bright" 
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/30 cursor-pointer text-sm"
                  >
                    {authMode === 'login' ? 'Login Securely' : 'Register Account'}
                  </button>
                </div>
              </form>

              <div className="text-center text-xs text-zinc-500">
                {authMode === 'login' ? (
                  <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-orange-400 font-bold hover:underline cursor-pointer">Sign up</button></p>
                ) : (
                  <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-orange-400 font-bold hover:underline cursor-pointer">Log in</button></p>
                )}
              </div>
            </div>

            {/* Right Side: Custom Financial Portal Branding Graphic */}
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur">Subsync Portal</span>
              </div>

              <div className="space-y-3 z-10 my-auto py-12">
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  Secure Your Financial Future
                </h3>
                <p className="text-orange-100 text-sm font-medium">
                  Automate tracking, eliminate burn rate friction, and manage all your recurring subscriptions in one secure dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-orange-200">
                <span>⚡ Zero Friction Sync</span>
                <span>•</span>
                <span>🛡️ Bank Grade Vault</span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tight">Add Subscription</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white font-bold text-xl cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddSub} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Service Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="e.g. Spotify, AWS" 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Monthly Cost ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={newCost} 
                  onChange={(e) => setNewCost(e.target.value)} 
                  placeholder="9.99" 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-sm"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Cloud">Cloud & Infra</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/30 cursor-pointer text-sm"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}