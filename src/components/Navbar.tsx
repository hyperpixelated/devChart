import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center h-auto font-bold bg-slate-950 border-b border-slate-800 text-teal-200 p-4">
      <Link href="/" className="hover:opacity-90 transition">
        <h1 className="text-2xl tracking-tight bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
          devChart
        </h1>
      </Link>
      
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-5 py-2 text-sm font-semibold tracking-wide text-slate-300 transition-all duration-300 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:text-teal-400 hover:bg-slate-800/60 shadow-sm active:scale-95"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/create-task"
          className="px-5 py-2 text-sm font-bold tracking-wide text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md shadow-teal-950/20 active:scale-95 hover:brightness-110"
        >
          ✨ Create Task
        </Link>
      </div>
    </div>
  );
}