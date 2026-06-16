"use client";

import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import React, { useState, useEffect } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  completion: boolean;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedTo?: string;
  deadline?: string | null;
};

type ActivityLog = {
  _id: string;
  text: string;
  createdAt: string;
};

function formatTimeAgo(dateString: string): string {
  if (!dateString) return "Just now";
  
  const now = new Date();
  const past = new Date(dateString);
  const elapsed = now.getTime() - past.getTime();
  
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  if (elapsed < msPerMinute) {
     return 'Just now';   
  } else if (elapsed < msPerHour) {
     const mins = Math.round(elapsed / msPerMinute);
     return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;   
  } else if (elapsed < msPerDay) {
     const hours = Math.round(elapsed / msPerHour);
     return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;   
  } else {
     const days = Math.round(elapsed / msPerDay);
     return `${days} ${days === 1 ? 'day' : 'days'} ago`;   
  }
}

function renderDeadline(deadline: string | null | undefined): string {
  if (!deadline || deadline === "No Deadline") return "No Deadline";
  
  const timestamp = Date.parse(deadline.replace(/-/g, '\/'));
  if (isNaN(timestamp)) {
    return deadline; 
  }
  
  return new Date(deadline.replace(/-/g, '\/')).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const [tasksRes, activitiesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/activities")
      ]);

      const tasksData = await tasksRes.json();
      const activitiesData = await activitiesRes.json();

      const normalizedTasks = tasksData.map((task: Task) => {
        let currentStatus = (task.status || "").toUpperCase();
        
        if (currentStatus !== "TODO" && currentStatus !== "IN_PROGRESS" && currentStatus !== "DONE") {
          currentStatus = task.completion ? "DONE" : "TODO";
        }
        
        return {
          ...task,
          status: currentStatus as 'TODO' | 'IN_PROGRESS' | 'DONE'
        };
      });

      setTasks(normalizedTasks);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Dashboard synchronization failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function moveTask(taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus.toLowerCase(),
          completion: newStatus === 'DONE'
        }),
      });

      if (!response.ok) throw new Error("API call failed");
      
      const logsRes = await fetch("/api/activities");
      const logsData = await logsRes.json();
      setActivities(logsData);

    } catch (error) {
      console.error("Failed to relocate task stage:", error);
      setTasks(previousTasks);
    }
  }

  async function deleteTask(taskId: string) {
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete API call failed");

      const logsRes = await fetch("/api/activities");
      const logsData = await logsRes.json();
      setActivities(logsData);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setTasks(previousTasks);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (loading) {
    return (
      <div className="min-h-screen spatial-bg text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spatial-bg text-white pb-10">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto px-6 mt-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="flex-1 w-full bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl shadow-slate-950/60">
            <h1 className="text-3xl font-bold mb-1 text-teal-400">Club Collaboration Pipeline</h1>
            <p className="text-slate-400 mb-6 text-xs">Track workflows and manage task deployments interactively.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl min-h-[550px] shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow shadow-amber-500/40"></span> To Do
                  </span>
                  <span className="bg-slate-800 border border-slate-700/40 text-slate-300 text-xs px-2 py-0.5 rounded-md font-medium">{todoTasks.length}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {todoTasks.map(task => (
                    <div key={task._id} className="bg-slate-800/80 border border-slate-700/30 rounded-2xl p-1 shadow-md hover:border-slate-600/60 transition duration-200">
                      <TaskCard {...task} onDelete={deleteTask} />
                      <div className="px-3 pb-3 flex flex-col gap-2 mt-1 border-t border-slate-700/20 pt-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="bg-slate-950/80 text-indigo-300 border border-indigo-900/30 px-2 py-0.5 rounded-full font-medium">
                            👤 {task.assignedTo || "Unassigned"}
                          </span>
                          <span className="text-slate-400 font-mono">
                            📅 {renderDeadline(task.deadline)}
                          </span>
                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            onClick={() => moveTask(task._id, 'IN_PROGRESS')}
                            className="text-[11px] bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-xl text-white transition font-medium w-full md:w-auto text-center cursor-pointer active:scale-95 shadow-sm shadow-teal-900/20"
                          >
                            Start Work →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl min-h-[550px] shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 shadow shadow-teal-500/40"></span> In Progress
                  </span>
                  <span className="bg-slate-800 border border-slate-700/40 text-slate-300 text-xs px-2 py-0.5 rounded-md font-medium">{inProgressTasks.length}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {inProgressTasks.map(task => (
                    <div key={task._id} className="bg-slate-800/80 border border-slate-700/30 rounded-2xl p-1 shadow-md hover:border-slate-600/60 transition duration-200">
                      <TaskCard {...task} onDelete={deleteTask} />
                      <div className="px-3 pb-3 flex flex-col gap-2 mt-1 border-t border-slate-700/20 pt-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="bg-slate-950/80 text-indigo-300 border border-indigo-900/30 px-2 py-0.5 rounded-full font-medium">
                            👤 {task.assignedTo || "Unassigned"}
                          </span>
                          <span className="text-slate-400 font-mono">
                            📅 {renderDeadline(task.deadline)}
                          </span>
                        </div>
                        <div className="flex gap-1.5 justify-end mt-1">
                          <button 
                            onClick={() => moveTask(task._id, 'TODO')}
                            className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded-lg text-slate-300 transition cursor-pointer active:scale-95"
                          >
                            &larr; Back
                          </button>
                          <button 
                            onClick={() => moveTask(task._id, 'DONE')}
                            className="text-[10px] bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-lg text-white transition font-medium cursor-pointer active:scale-95 shadow-sm shadow-emerald-900/20"
                          >
                            Complete &check;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl min-h-[550px] shadow-inner">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/40"></span> Done
                  </span>
                  <span className="bg-slate-800 border border-slate-700/40 text-slate-300 text-xs px-2 py-0.5 rounded-md font-medium">{doneTasks.length}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {doneTasks.map(task => (
                    <div key={task._id} className="bg-slate-800/60 border border-slate-700/20 rounded-2xl p-1 shadow-md opacity-70 hover:opacity-100 transition duration-200">
                      <TaskCard {...task} onDelete={deleteTask} />
                      <div className="px-3 pb-3 flex flex-col gap-2 mt-1 border-t border-slate-700/10 pt-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/20 px-2 py-0.5 rounded-full line-through">
                            👤 {task.assignedTo || "Unassigned"}
                          </span>
                          <span className="text-slate-500 font-mono line-through">
                            📅 {renderDeadline(task.deadline)}
                          </span>
                        </div>
                        <div className="flex justify-end mt-1">
                          <button 
                            onClick={() => moveTask(task._id, 'IN_PROGRESS')}
                            className="text-[11px] bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded-lg text-slate-400 transition cursor-pointer active:scale-95"
                          >
                            &larr; Reopen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="w-full lg:w-[360px] bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-3xl p-4 shadow-xl lg:mt-[52px] transition duration-300 shadow-slate-950/40">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/80">
              ⚡ Live Activity Feed
            </h3>
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-2 text-center">No recent logs. Deploy or move a task to generate logs!</p>
              ) : (
                activities.map(log => (
                  <div key={log._id} className="bg-slate-800/60 border border-slate-800/40 p-2.5 rounded-xl text-xs hover:bg-slate-800/90 transition shadow-sm">
                    <p className="text-slate-300 leading-relaxed font-light">{log.text}</p>
                    <span className="text-[10px] text-slate-500 block mt-1.5 text-right font-mono">
                      ⏳ {formatTimeAgo(log.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}