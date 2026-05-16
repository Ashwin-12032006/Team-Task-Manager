"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  UserPlus,
  X,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: userData } = useSWR("/api/user", fetcher);

  const navItems = [
    { name: "Projects", href: "/dashboard", icon: LayoutDashboard },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const inviteLink = "https://taskflow.app/invite/t-8f92a1";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden md:flex flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0 shrink-0 z-20"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="text-white w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-white text-lg tracking-tight whitespace-nowrap"
              >
                TaskFlow
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">{item.name}</motion.span>
                )}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all w-full group"
            >
              <UserPlus className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap font-medium">Invite Team</motion.span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 glass sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors hidden md:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">
              {navItems.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-700 mx-2"></div>
            <button 
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-3 hover:bg-slate-800/50 py-1.5 px-2 rounded-lg transition-colors group"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${userData?.color || "from-indigo-500 to-blue-600"} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {userData?.initials || "JD"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-none group-hover:text-indigo-400 transition-colors">{userData?.name || "Loading..."}</p>
                <p className="text-[10px] text-slate-500 mt-1">{userData?.role || "Team Member"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Invite Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInviteModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                  <h3 className="text-xl font-bold text-white">Invite Team Members</h3>
                  <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                      <UserPlus className="w-10 h-10 text-indigo-400" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h4 className="text-white font-semibold">Invite by link</h4>
                    <p className="text-slate-400 text-sm">Anyone with this link can join your workspace and start collaborating.</p>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                      <input 
                        type="text" 
                        readOnly 
                        value={inviteLink}
                        className="flex-1 bg-transparent text-slate-300 text-sm px-2 outline-none select-all"
                      />
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'}`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Expires in 7 days</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
