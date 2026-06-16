"use client";

import Navbar from '@/components/Navbar';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [assignedTo, setAssignedTo] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(true);
  const [deadline, setDeadline] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      alert("Please enter a task name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          title, 
          description, 
          priority,
          assignedTo: assignedTo.trim() || "Unassigned", 
          status: "TODO",
          completion: false,
          deadline: hasDeadline && deadline ? deadline : null
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      setTitle("");
      setDescription("");
      setPriority("low");
      setAssignedTo("");
      setDeadline("");
      setHasDeadline(true);

      alert("Task assigned and added to Kanban Board successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <h1 className="text-4xl font-bold text-teal-300 mb-2">Deploy Club Task</h1>
        <p className="text-slate-400 mb-8 text-sm">Assign milestones directly into the team's working sprint execution flow.</p>

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700/60 p-6 rounded-2xl flex flex-col gap-5 shadow-xl">

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What's the task name?</label>
            <input 
              type="text" 
              placeholder="e.g., Design recruitment banner" 
              value={title}  
              onChange={(event) => { setTitle(event.target.value) }} 
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Assign to (Club Member Name)</label>
            <input 
              type="text" 
              placeholder="e.g., Pranav Kumar" 
              value={assignedTo}  
              onChange={(event) => { setAssignedTo(event.target.value) }} 
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Task Deadline</label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={!hasDeadline} 
                  onChange={(e) => setHasDeadline(!e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-0"
                />
                No Deadline
              </label>
            </div>
            
            {hasDeadline ? (
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required={hasDeadline}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <div className="w-full text-xs text-slate-500 border border-dashed border-slate-700 rounded-xl p-3 bg-slate-900/50 italic">
                📅 This task will remain unscheduled indefinitely.
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Describe the requirements</label>
            <textarea  
              placeholder="Provide clear references or expected deliverables..." 
              value={description} 
              onChange={(event) => { setDescription(event.target.value) }} 
              rows={4}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Urgency Priority</label>
            <div className="relative">
              <select
                value={priority}
                onChange={(event) => { setPriority(event.target.value) }}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full p-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2" 
          >
            {isSubmitting ? "Broadcasting to Team..." : "Deploy to Kanban"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateTask;