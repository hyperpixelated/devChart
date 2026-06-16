"use client";

import React from "react";

type TaskCardProps = {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    priority: string;
    completion: boolean;
    onDelete?: (id: string) => void;
};

const TaskCard = ({ _id, id, title, description, priority, completion, onDelete }: TaskCardProps) => {
    const taskId = _id || id;

    const bgClass =
        priority?.toLowerCase() === "high"
            ? "border-red-500/30 hover:border-red-400 shadow-lg shadow-red-950/20 hover:shadow-red-500/20 animate-pulse-slow"
            : priority?.toLowerCase() === "medium"
            ? "border-amber-500/30 hover:border-amber-400 shadow-lg shadow-amber-950/10 hover:shadow-amber-500/20"
            : "border-emerald-500/20 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10";

    const badgeColor = 
        priority?.toLowerCase() === "high"
            ? "bg-red-500/20 text-red-400 border-red-500/30"
            : priority?.toLowerCase() === "medium"
            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

    return (
        <div className={`flex h-auto w-full flex-col rounded-2xl border bg-slate-900/60 overflow-hidden p-4 gap-3 relative group/card transition-all duration-300 hover:-translate-y-0.5 ${bgClass}`}>
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-100 tracking-wide line-clamp-2 pr-4">{title}</h2>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badgeColor}`}>
                    {priority}
                </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed break-words line-clamp-3 bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 mb-1">
                {description}
            </p>

            {onDelete && taskId && (
                <div className="flex justify-start mt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(taskId);
                        }}
                        className="text-[10px] bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-900/30 px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 z-20 flex items-center gap-1"
                        title="Delete Task"
                    >
                        🗑 Delete Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;