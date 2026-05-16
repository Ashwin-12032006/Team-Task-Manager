"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Lock, User, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const { data: userData, mutate } = useSWR("/api/user", fetcher);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    bio: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        phone: userData.phone || "",
        bio: userData.bio || ""
      });
    }
  }, [userData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await mutate();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Account Settings</h2>
        <p className="text-slate-400">Manage your profile, preferences, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Tabs */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Lock className="w-5 h-5" />
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  {showSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Changes saved successfully!
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${userData.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {userData.initials}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                      <input 
                        type="text" 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                    <textarea 
                      rows={3}
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none" 
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 border border-slate-800"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', desc: 'Receive emails about task assignments and comments.' },
                    { title: 'Desktop Push', desc: 'Real-time browser notifications for important updates.' },
                    { title: 'Weekly Performance Digest', desc: 'A summary of your team\'s productivity and goals.' }
                  ].map((item, index) => (
                    <div key={item.title} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 group hover:border-slate-600 transition-colors">
                      <div>
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${index === 2 ? 'bg-slate-700' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${index === 2 ? 'left-1' : 'right-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-6 border border-slate-800"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
