import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, BookOpen, Handshake, Bell, Shield, Search, Filter, 
  PlusCircle, MessageSquare, ThumbsUp, CheckCircle, AlertCircle, 
  LogIn, UserPlus, Zap, Eye, Trash2, Edit3, Lock, ShieldCheck, Flag, 
  TrendingUp, Award, MapPin, Phone, Mail, ChevronRight, X, LogOut, Download
} from 'lucide-react';

// Default Seed Data
const INITIAL_USERS = [
  { id: 'u1', name: 'Ramesh Patel', email: 'ramesh@agri.in', role: 'Entrepreneur', businessName: 'GreenCrop Solutions', sector: 'Agriculture', location: 'Anand, Gujarat', phone: '+91 98765 43210', status: 'Active', bio: 'Pioneering organic drip-irrigation kits for smallholder farmers.', verified: true },
  { id: 'u2', name: 'Dr. Sunita Deshmukh', email: 'dr.sunita@ruraltech.org', role: 'Mentor', businessName: 'Rural Tech Foundation', sector: 'Agritech', location: 'Pune, Maharashtra', phone: '+91 91234 56789', status: 'Active', bio: '15+ years in agricultural extension, supply chain logistics, and NABARD grants.', verified: true },
  { id: 'u3', name: 'Master Administrator', email: 'admin@ruralrise.org', role: 'Admin', businessName: 'RuralRise HQ', sector: 'Platform Admin', location: 'New Delhi', phone: '+91 11000 00000', status: 'Active', bio: 'Platform governance, moderation, and incubator network manager.', verified: true },
  { id: 'u4', name: 'Anita Devi', email: 'anita@crafts.in', role: 'Entrepreneur', businessName: 'Rural Artisans Collective', sector: 'Handicraft', location: 'Madhubani, Bihar', phone: '+91 99887 76655', status: 'Active', bio: 'Empowering 50+ local women through traditional folk art e-commerce.', verified: true },
  { id: 'u5', name: 'Sanjay Verma', email: 'sanjay@finaccess.com', role: 'Mentor', businessName: 'MicroFinance Advisory', sector: 'Finance & Banking', location: 'Jaipur, Rajasthan', phone: '+91 94140 12345', status: 'Active', bio: 'Helping rural micro-enterprises secure Mudra loans and angel capital.', verified: true }
];

const INITIAL_POSTS = [
  { id: 'p1', author: 'Dr. Sunita Deshmukh', role: 'Mentor', category: 'Government Schemes', title: 'NABARD Agri-Infra Fund 2026: 3% Interest Subvention for FPOs', content: 'Farmer Producer Organizations (FPOs) can now apply for up to ₹2 Crore term loan with 3% interest subvention for setting up cold storages and processing hubs.', likes: 24, comments: [ { id: 'c1', author: 'Ramesh Patel', text: 'This is super helpful! Are individual entrepreneurs eligible or only registered FPOs?' } ], timestamp: '2 hours ago', status: 'Approved' },
  { id: 'p2', author: 'Ramesh Patel', role: 'Entrepreneur', category: 'Sustainable Tech', title: 'Solar Powered Cold Storage Prototype Tested Successfully', content: 'We built a 2-tonne micro cold storage powered by solar PV panels. Looking for partners in Maharashtra to pilot test for horticulture crops.', likes: 18, comments: [], timestamp: '5 hours ago', status: 'Approved' },
  { id: 'p3', author: 'Anita Devi', role: 'Entrepreneur', category: 'Marketplace & Export', title: 'Bulk Handicrafts Supply Chain Partnership Needed', content: 'Our self-help group produces hand-woven terracotta lamps and paintings. Seeking logistics partners with tier-3 delivery networks.', likes: 31, comments: [], timestamp: '1 day ago', status: 'Approved' }
];

const INITIAL_COLLABS = [
  { id: 'col1', title: 'Joint Bulk Procurement of Organic Fertilizer Raw Material', sector: 'Agriculture', postedBy: 'Ramesh Patel', location: 'Gujarat', lookingFor: 'Co-buyers in Anand/Vadodara district to aggregate order and reduce freight cost by 25%.', status: 'Open' },
  { id: 'col2', title: 'Digital E-Commerce Setup & Local Logistics Partnering', sector: 'Handicraft', postedBy: 'Anita Devi', location: 'Bihar', lookingFor: 'Tech mentor or agency to help build Shopify store and streamline shipping.', status: 'Open' }
];

const INITIAL_TICKETS = [
  { id: 't1', user: 'Anita Devi', subject: 'Inquiry regarding Mentor Connect', category: 'General Help', status: 'Pending', date: 'Oct 28, 2026', details: 'Need assistance connecting with supply chain mentors in North East India.' },
  { id: 't2', user: 'Ramesh Patel', subject: 'Spam Comment Flagged', category: 'Moderation', status: 'Resolved', date: 'Oct 25, 2026', details: 'Flagged suspicious promotional links posted on cold storage post.' }
];

export default function App() {
  // DB States
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('rr_db_users_v2')) || INITIAL_USERS);
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem('rr_db_posts_v2')) || INITIAL_POSTS);
  const [collabs, setCollabs] = useState(() => JSON.parse(localStorage.getItem('rr_db_collabs_v2')) || INITIAL_COLLABS);
  const [tickets, setTickets] = useState(() => JSON.parse(localStorage.getItem('rr_db_tickets_v2')) || INITIAL_TICKETS);
  
  // Auth Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('rr_db_current_session_v2');
    return savedSession ? JSON.parse(savedSession) : INITIAL_USERS[0];
  });

  // UI States
  const [activeTab, setActiveTab] = useState('feed');
  const [lowDataMode, setLowDataMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', role: 'Entrepreneur',
    businessName: '', sector: 'Agriculture', location: '', phone: '', bio: ''
  });

  const [newPost, setNewPost] = useState({ title: '', category: 'Government Schemes', content: '' });
  const [newCollab, setNewCollab] = useState({ title: '', sector: 'Agriculture', location: '', lookingFor: '' });
  const [mentorshipMsg, setMentorshipMsg] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [filterSector, setFilterSector] = useState('All');

  // LocalStorage Persistence Sync
  useEffect(() => { localStorage.setItem('rr_db_users_v2', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('rr_db_posts_v2', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('rr_db_collabs_v2', JSON.stringify(collabs)); }, [collabs]);
  useEffect(() => { localStorage.setItem('rr_db_tickets_v2', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('rr_db_current_session_v2', JSON.stringify(currentUser)); }, [currentUser]);

  // Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (user) {
      if (user.status === 'Suspended') {
        setAuthError('This account has been suspended by Administrator.');
        return;
      }
      setCurrentUser(user);
      setShowAuthModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setAuthError('Invalid email credentials. Try demo credentials provided below.');
    }
  };

  const handleQuickLogin = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setShowAuthModal(false);
      if (user.role === 'Admin') setActiveTab('admin');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return;

    if (users.some(u => u.email.toLowerCase() === regForm.email.toLowerCase())) {
      setAuthError('Email already registered. Please login.');
      return;
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name: regForm.name,
      email: regForm.email,
      role: regForm.role,
      businessName: regForm.businessName || regForm.name + ' Enterprise',
      sector: regForm.sector,
      location: regForm.location || 'Rural India',
      phone: regForm.phone || '+91 90000 00000',
      status: 'Active',
      bio: regForm.bio || 'Rural business pioneer striving for regional impact.',
      verified: true
    };

    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    setShowAuthModal(false);
    setRegForm({ name: '', email: '', password: '', role: 'Entrepreneur', businessName: '', sector: 'Agriculture', location: '', phone: '', bio: '' });
  };

  // Post Actions
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const postObj = {
      id: 'p_' + Date.now(),
      author: currentUser.name,
      role: currentUser.role,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      status: 'Approved'
    };
    setPosts([postObj, ...posts]);
    setNewPost({ title: '', category: 'Government Schemes', content: '' });
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddComment = (postId) => {
    const text = commentInput[postId];
    if (!text) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: 'c_' + Date.now(), author: currentUser.name, text }]
        };
      }
      return p;
    }));
    setCommentInput({ ...commentInput, [postId]: '' });
  };

  const handleCreateCollab = (e) => {
    e.preventDefault();
    if (!newCollab.title || !newCollab.lookingFor) return;
    const item = {
      id: 'col_' + Date.now(),
      title: newCollab.title,
      sector: newCollab.sector,
      postedBy: currentUser.name,
      location: newCollab.location || currentUser.location,
      lookingFor: newCollab.lookingFor,
      status: 'Open'
    };
    setCollabs([item, ...collabs]);
    setNewCollab({ title: '', sector: 'Agriculture', location: '', lookingFor: '' });
  };

  // Admin Controls
  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const changeUserRole = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div className={`min-h-screen ${lowDataMode ? 'bg-gray-100 text-gray-900' : 'bg-slate-900 text-slate-100'} font-sans`}>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur border-b border-emerald-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-amber-500 to-emerald-500 p-2 rounded-xl text-slate-950 font-bold flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                RuralRise <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">Platform</span>
              </span>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex space-x-1 bg-emerald-900/40 p-1 rounded-xl border border-emerald-800/40">
            {[
              { id: 'feed', label: 'Knowledge Feed', icon: BookOpen },
              { id: 'entrepreneurs', label: 'Entrepreneurs', icon: Users },
              { id: 'mentors', label: 'Mentors', icon: Award },
              { id: 'collabs', label: 'Collaboration Hub', icon: Handshake },
              ...(currentUser.role === 'Admin' ? [{ id: 'admin', label: 'Admin Authority', icon: ShieldCheck }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLowDataMode(!lowDataMode)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1 border ${
                lowDataMode ? 'bg-amber-400 text-black border-amber-500' : 'bg-slate-800 text-emerald-300 border-slate-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              {lowDataMode ? '2G Mode ON' : 'Low-Data Mode'}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2 border-l border-emerald-800 pl-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-300 font-medium">{currentUser.role}</div>
                </div>
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs flex items-center gap-1"
                  title="Switch User / Relogin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Log In
                </button>
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('register'); }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 border border-emerald-700/40 rounded-2xl p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1">
              <Shield className="w-3 h-3" /> Rural Business Incubator & Peer Network
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Bridging Rural Isolation for Entrepreneurs & Mentors</h1>
            <p className="text-slate-300 text-sm">
              "Rural entrepreneurs often operate in isolation without access to digital peer networks, incubators, or mentors. This reduces opportunities for collaboration, learning, and innovation."
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => { setShowAuthModal(true); setAuthMode('register'); }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Create Free Account
            </button>
            <button
              onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
              className="bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Existing User Login
            </button>
          </div>
        </div>

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post Card */}
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-5 shadow-md">
                <h2 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Share Community Insight or Innovation
                </h2>
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title (e.g. Mudra Loan Scheme Experience, Drip Irrigation Hack)"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-3">
                    <select
                      value={newPost.category}
                      onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    >
                      <option>Government Schemes</option>
                      <option>Sustainable Tech</option>
                      <option>Marketplace & Export</option>
                      <option>Funding & Grants</option>
                    </select>
                    <textarea
                      rows={2}
                      placeholder="Write your advice or query..."
                      value={newPost.content}
                      onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                      <PlusCircle className="w-3.5 h-3.5" /> Publish Insight
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-white text-xs">
                          {post.author[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {post.author}
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                              {post.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{post.timestamp}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 mb-1">{post.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{post.content}</p>

                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-3 text-xs">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1.5 text-slate-400 hover:text-emerald-400 font-semibold"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes} Upvotes</span>
                      </button>

                      <span className="text-slate-400 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" /> {post.comments.length} Responses
                      </span>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-2">
                      {post.comments.map(c => (
                        <div key={c.id} className="bg-slate-900/60 p-2.5 rounded-xl text-xs">
                          <span className="font-bold text-emerald-300">{c.author}: </span>
                          <span className="text-slate-300">{c.text}</span>
                        </div>
                      ))}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Add a suggestion or reply..."
                          value={commentInput[post.id] || ''}
                          onChange={e => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Platform Impact Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xl font-extrabold text-amber-400">{users.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Registered Users</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xl font-extrabold text-emerald-400">{users.filter(u => u.role === 'Mentor').length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Mentors</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xl font-extrabold text-blue-400">{collabs.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Joint Projects</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xl font-extrabold text-purple-400">{posts.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Knowledge Posts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && currentUser.role === 'Admin' && (
          <div className="space-y-6">
            <div className="bg-emerald-950/80 border border-emerald-700/60 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" /> Administrator Authority Panel
                </h2>
                <p className="text-xs text-slate-300">Supreme System Management: User roles, post moderation, and safety ticketing.</p>
              </div>
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full">
                Admin Active
              </span>
            </div>

            {/* User Management Table */}
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4">User Accounts & Authority Controls</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-900/80 text-emerald-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Sector & Location</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-700/30">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <div>{u.sector}</div>
                          <div className="text-[10px] text-slate-400">{u.location}</div>
                        </td>
                        <td className="p-3">
                          <select
                            value={u.role}
                            onChange={(e) => changeUserRole(u.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-amber-300 rounded px-2 py-1"
                          >
                            <option value="Entrepreneur">Entrepreneur</option>
                            <option value="Mentor">Mentor</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-900/80 text-emerald-300' : 'bg-red-900/80 text-red-300'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-[10px]"
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post Moderation */}
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4">Post Moderation & Content Removal</h3>
              <div className="space-y-3">
                {posts.map(p => (
                  <div key={p.id} className="bg-slate-900/60 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-400">By {p.author} • Category: {p.category}</div>
                    </div>
                    <button
                      onClick={() => deletePost(p.id)}
                      className="bg-red-900/80 hover:bg-red-800 text-red-200 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Post
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ENTREPRENEURS TAB */}
        {activeTab === 'entrepreneurs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.filter(u => u.role === 'Entrepreneur').map(e => (
              <div key={e.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                      {e.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{e.name}</h3>
                      <div className="text-xs text-amber-300 font-medium">{e.businessName}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 mb-4">
                    <div className="flex items-center gap-1 text-slate-400"><MapPin className="w-3.5 h-3.5" /> {e.location}</div>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold"><Briefcase className="w-3.5 h-3.5" /> {e.sector}</div>
                    <p className="mt-2 text-slate-300">{e.bio}</p>
                  </div>
                </div>
                <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded-xl text-xs font-bold">
                  Connect & Collaborate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MENTORS TAB */}
        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.filter(u => u.role === 'Mentor').map(m => (
              <div key={m.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                      {m.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{m.name}</h3>
                      <div className="text-xs text-emerald-300 font-medium">{m.businessName}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 mb-4">
                    <div className="flex items-center gap-1 text-slate-400"><MapPin className="w-3.5 h-3.5" /> {m.location}</div>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold"><Award className="w-3.5 h-3.5" /> Expertise: {m.sector}</div>
                    <p className="mt-2 text-slate-300">{m.bio}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMentor(m)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-1.5 rounded-xl text-xs font-bold"
                >
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        )}

        {/* COLLABORATIONS TAB */}
        {activeTab === 'collabs' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-300 mb-3">Post Joint Venture or Resource Request</h3>
              <form onSubmit={handleCreateCollab} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newCollab.title}
                  onChange={e => setNewCollab({ ...newCollab, title: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Location / District"
                  value={newCollab.location}
                  onChange={e => setNewCollab({ ...newCollab, location: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <textarea
                  placeholder="What partner/resource are you looking for?"
                  value={newCollab.lookingFor}
                  onChange={e => setNewCollab({ ...newCollab, lookingFor: e.target.value })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button type="submit" className="sm:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold">
                  Post Collaboration Requirement
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collabs.map(c => (
                <div key={c.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    {c.sector}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 mb-1">{c.title}</h3>
                  <p className="text-xs text-slate-300 mb-3">{c.lookingFor}</p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-2">
                    <span>Posted by: {c.postedBy}</span>
                    <span>Location: {c.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {authError && (
              <div className="bg-red-900/60 border border-red-700 text-red-200 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <div>
                <h2 className="text-lg font-extrabold text-white mb-1">User Login</h2>
                <p className="text-xs text-slate-400 mb-4">Enter credentials or click demo preset below.</p>

                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@ruralrise.org"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold">
                    Sign In
                  </button>
                </form>

                {/* Quick Presets */}
                <div className="mt-5 border-t border-slate-700 pt-4">
                  <div className="text-[10px] font-bold text-amber-400 uppercase mb-2">Quick Demo Accounts:</div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleQuickLogin('admin@ruralrise.org')}
                      className="w-full bg-slate-900 hover:bg-slate-950 border border-amber-500/40 text-amber-300 p-2 rounded-xl text-xs text-left flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold">Master Admin (Supreme Authority)</div>
                        <div className="text-[10px] text-slate-400">admin@ruralrise.org | admin1289</div>
                      </div>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleQuickLogin('ramesh@agri.in')}
                      className="w-full bg-slate-900 hover:bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl text-xs text-left flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold">Entrepreneur Account</div>
                        <div className="text-[10px] text-slate-400">ramesh@agri.in</div>
                      </div>
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-extrabold text-white mb-1">Create RuralRise Account</h2>
                <p className="text-xs text-slate-400 mb-4">Join peer network & incubator platform.</p>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={regForm.name}
                      onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={regForm.email}
                        onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Role</label>
                      <select
                        value={regForm.role}
                        onChange={e => setRegForm({ ...regForm, role: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none"
                      >
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. GreenCrop Solutions"
                      value={regForm.businessName}
                      onChange={e => setRegForm({ ...regForm, businessName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl text-xs font-bold mt-2">
                    Complete Registration
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}