"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Award, CheckCircle2, Clock, Flame, Mail, MessageSquare, MoreVertical, Phone, Plus, Star, Trophy, X, Zap } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TeamPage() {
  const { data: teamMembers, error } = useSWR("/api/team", fetcher);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = "https://taskflow.app/invite/team-x9f2a";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Team Directory</h2>
          <p className="text-slate-400">Meet the amazing people building the future.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 w-fit"
        >
          <Plus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      {!teamMembers && !error ? (
        <div className="flex justify-center py-20 text-indigo-400">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers?.map((member: any) => (
          <motion.div
            layoutId={`card-${member.id}`}
            key={member.id}
            onClick={() => setSelectedId(member.id)}
            className="glass-card p-6 border border-slate-800 flex flex-col items-center text-center cursor-pointer hover:border-slate-600 transition-colors"
          >
            <motion.div layoutId={`avatar-${member.id}`} className={`w-20 h-20 rounded-full bg-gradient-to-tr ${member.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4`}>
              {member.initials}
            </motion.div>
            
            <motion.h3 layoutId={`name-${member.id}`} className="text-lg font-bold text-white mb-1">{member.name}</motion.h3>
            <motion.p layoutId={`role-${member.id}`} className="text-sm font-medium text-slate-400 mb-4">{member.role}</motion.p>
            
            <div className="w-full pt-4 border-t border-slate-800/50 flex justify-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-xs">{member.tasksCompleted}</span></div>
              <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-indigo-400" /> <span className="text-xs">{member.activeTasks.length}</span></div>
            </div>
          </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              {teamMembers?.filter((m: any) => m.id === selectedId).map((member: any) => (
                <motion.div
                  key={member.id}
                  layoutId={`card-${member.id}`}
                  className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row"
                >
                  {/* Left Column - Profile */}
                  <div className={`md:w-1/3 bg-gradient-to-b ${member.color} p-8 flex flex-col items-center text-center relative`}>
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors md:hidden"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <motion.div layoutId={`avatar-${member.id}`} className="w-28 h-28 rounded-full bg-white/20 backdrop-blur border-4 border-white/30 flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-6">
                      {member.initials}
                    </motion.div>
                    <motion.h3 layoutId={`name-${member.id}`} className="text-2xl font-bold text-white mb-1">{member.name}</motion.h3>
                    <motion.p layoutId={`role-${member.id}`} className="text-white/80 font-medium mb-6">{member.role}</motion.p>
                    
                    <div className="flex gap-3 mt-auto">
                      <a href={`mailto:${member.email}`} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur">
                        <Mail className="w-5 h-5" />
                      </a>
                      <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur">
                        <Phone className="w-5 h-5" />
                      </a>
                      <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="md:w-2/3 p-8 bg-slate-900 relative">
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors hidden md:block"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{member.bio}</p>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-semibold">{member.tasksCompleted}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Done</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="font-semibold">{member.rating}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
                            <Activity className="w-4 h-4" />
                            <span className="font-semibold text-sm">{member.velocity}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Velocity</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{member.onTimeRate}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">On Time</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Current Work ({member.activeTasks.length})</h4>
                        <div className="space-y-2">
                          {member.activeTasks.map((task: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                              <span className="text-slate-200 text-sm font-medium">{task.title}</span>
                              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${
                                task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                task.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" /> Past Achievements
                        </h4>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/50 before:to-transparent">
                          {member.pastWork.map((work: any, i: number) => {
                            // Determine styles based on impact
                            let glowColor = "shadow-indigo-500/20";
                            let iconBg = "bg-indigo-500";
                            let iconText = "text-indigo-100";
                            let Icon = Award;
                            let badgeBg = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

                            if (work.impact === "Critical") {
                              glowColor = "shadow-rose-500/30";
                              iconBg = "bg-rose-500";
                              iconText = "text-rose-100";
                              Icon = Flame;
                              badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                            } else if (work.impact === "High") {
                              glowColor = "shadow-amber-500/20";
                              iconBg = "bg-amber-500";
                              iconText = "text-amber-100";
                              Icon = Zap;
                              badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                            }

                            return (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={i} 
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                              >
                                {/* Timeline Node */}
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 ${iconBg} ${iconText} shadow-lg ${glowColor} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2 -translate-x-1/2 transition-transform group-hover:scale-110`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                
                                {/* Content Card */}
                                <div className={`w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 transition-all hover:shadow-xl ${glowColor} group-hover:-translate-y-1`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <span className="text-slate-100 font-bold text-sm tracking-wide">{work.title}</span>
                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full w-fit shrink-0">{work.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${badgeBg}`}>
                                      {work.impact} Impact
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto p-6 relative"
              >
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Invite team members</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Share this link with others so they can join your workspace. Anyone with the link can join as a member.
                </p>

                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    value={inviteLink}
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap min-w-[80px]"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
