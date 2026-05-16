"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Folder, MoreVertical, Plus, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function DashboardPage() {
  const { data: projects, error, mutate } = useSWR("/api/projects", fetcher);
  const [showModal, setShowModal] = useState(false);
  
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("from-indigo-500 to-blue-600");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject = {
      name: newProjectName,
      description: newProjectDesc,
      color: newProjectColor,
    };

    // Optimistic update
    const optimisticProject = {
      ...newProject,
      id: Date.now().toString(),
      progress: 0,
      _count: { members: 1 }
    };

    mutate([...(projects || []), optimisticProject], false);
    setShowModal(false);
    setNewProjectName("");
    setNewProjectDesc("");

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    mutate();
  };

  return (
    <div className="space-y-8 relative">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Projects</h2>
          <p className="text-slate-400">Manage your active workspaces and teams.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 w-fit"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {!projects && !error ? (
        <div className="flex justify-center py-20 text-indigo-400">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error || (projects && projects.error) ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-red-400">Database Connection Error</h3>
          <p className="text-slate-400">We couldn't connect to the database. Please make sure your <code className="bg-slate-950 px-2 py-1 rounded text-indigo-400">DATABASE_URL</code> is set correctly in Railway variables.</p>
          <button 
            onClick={() => mutate()}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all font-medium"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {Array.isArray(projects) && projects.map((project: any) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Link href={`/dashboard/project/${project.id}`} className="block group">
                <div className="glass-card overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                  <div className={`h-32 bg-gradient-to-br ${project.color} p-5 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4">
                      <button className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors" onClick={(e) => e.preventDefault()}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="h-full flex flex-col justify-end relative z-10">
                      <h3 className="text-xl font-bold text-white truncate drop-shadow-md">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                      {project.description || "No description provided."}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300 font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{project._count?.members || 0} members</span>
                        </div>
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(project._count?.members || 0, 3))].map((_, i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-300"
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                          {(project._count?.members || 0) > 3 && (
                            <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              +{(project._count?.members || 0) - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                <Folder className="w-6 h-6" />
              </div>
              <span className="font-medium">Create New Project</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* New Project Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create New Project</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Q4 Marketing Campaign"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                    <textarea 
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="Briefly describe the project..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Theme Color</label>
                    <div className="flex gap-3">
                      {[
                        "from-indigo-500 to-blue-600",
                        "from-emerald-500 to-teal-600",
                        "from-purple-500 to-pink-600",
                        "from-amber-500 to-orange-600",
                        "from-rose-500 to-red-600"
                      ].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewProjectColor(color)}
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-transform hover:scale-110 ${newProjectColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
