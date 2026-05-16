"use client";

import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, MoreHorizontal, Paperclip, Plus } from "lucide-react";
import { useState, use, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectBoard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: apiData, error, mutate } = useSWR(`/api/projects/${resolvedParams.id}`, fetcher);
  
  const [isMounted, setIsMounted] = useState(false);
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(null);
  const [newTaskContent, setNewTaskContent] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !apiData?.boardData) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const data = apiData.boardData;
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    let newData = { ...data };

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds as string[]);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      newData.columns[start.id] = { ...start, taskIds: newTaskIds };
    } else {
      const startTaskIds = Array.from(start.taskIds as string[]);
      startTaskIds.splice(source.index, 1);
      
      const finishTaskIds = Array.from(finish.taskIds as string[]);
      finishTaskIds.splice(destination.index, 0, draggableId);

      newData.columns[start.id] = { ...start, taskIds: startTaskIds };
      newData.columns[finish.id] = { ...finish, taskIds: finishTaskIds };
    }

    // Optimistic UI update
    mutate({ ...apiData, boardData: newData }, false);

    // Backend update
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: draggableId,
        newColumnId: destination.droppableId,
        newIndex: destination.index,
        oldColumnId: source.droppableId
      })
    });
    
    mutate(); // revalidate
  };

  const handleAddTask = async (columnId: string) => {
    if (!newTaskContent.trim() || !apiData?.boardData) {
      setAddingTaskToColumn(null);
      setNewTaskContent("");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const newTask = { 
      id: tempId, 
      content: newTaskContent, 
      priority: "Medium",
      status: apiData.boardData.columns[columnId].title,
      author: { initials: "JD", color: "from-indigo-500 to-blue-600" } 
    };

    const newData = { ...apiData.boardData };
    newData.tasks[tempId] = newTask;
    newData.columns[columnId].taskIds.push(tempId);

    mutate({ ...apiData, boardData: newData }, false);
    setAddingTaskToColumn(null);
    setNewTaskContent("");

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newTask.content,
        columnId,
        priority: "Medium"
      })
    });

    mutate();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (!isMounted) return null;

  if (error) return <div className="text-rose-400 text-center py-20">Failed to load project board.</div>;
  if (!apiData) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  const { project, boardData: data } = apiData;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{project.name} Board</h2>
          <p className="text-slate-400">{project.description || "Drag and drop tasks to organize your workflow."}</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {data.columnOrder.map((columnId: string) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId: string) => data.tasks[taskId]);

              return (
                <div key={column.id} className="w-80 shrink-0 flex flex-col glass-panel rounded-2xl max-h-full">
                  <div className="p-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-200">{column.title}</h3>
                      <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        {tasks.length}
                      </span>
                    </div>
                    <button className="text-slate-500 hover:text-slate-300 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${
                          snapshot.isDraggingOver ? "bg-indigo-500/5" : ""
                        }`}
                      >
                        {tasks.map((task: any, index: number) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className={`bg-slate-800/80 border ${
                                  snapshot.isDragging ? "border-indigo-500 shadow-xl shadow-indigo-500/20 rotate-2" : "border-slate-700"
                                } p-4 rounded-xl cursor-grab active:cursor-grabbing`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-200 font-medium mb-4">{task.content}</p>
                                <div className="flex items-center justify-between text-slate-400 text-xs">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 0</div>
                                  </div>
                                  {task.author && (
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${task.author.color} flex items-center justify-center text-[8px] font-bold text-white`}>
                                      {task.author.initials}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {addingTaskToColumn === column.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              autoFocus
                              value={newTaskContent}
                              onChange={(e) => setNewTaskContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddTask(column.id);
                                } else if (e.key === "Escape") {
                                  setAddingTaskToColumn(null);
                                  setNewTaskContent("");
                                }
                              }}
                              placeholder="What needs to be done?"
                              className="w-full p-3 rounded-xl bg-slate-800 border border-indigo-500 text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
                              rows={2}
                            />
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleAddTask(column.id)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                Add
                              </button>
                              <button 
                                onClick={() => { setAddingTaskToColumn(null); setNewTaskContent(""); }}
                                className="px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setAddingTaskToColumn(column.id)}
                            className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors border border-transparent border-dashed hover:border-slate-600"
                          >
                            <Plus className="w-4 h-4" /> Add Task
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
