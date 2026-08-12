interface StatCardProps {
  value: number | string;
  label: string;
  type?: "success" | "warning" | "info";
}

export default function StatCard({ value, label, type = "info" }: StatCardProps) {
  const indicatorColors = {
    success: "bg-emerald-500 text-emerald-500 dark:text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
    warning: "bg-amber-500 text-amber-500 dark:text-amber-400 border-amber-500/20 shadow-amber-500/10",
    info: "bg-primary text-primary dark:text-primary-foreground border-primary/20 shadow-primary/10",
  };

  return (
    <div className="glass-card flex-1 flex items-center justify-between p-5 rounded-2xl bg-card/30 dark:bg-zinc-900/15 backdrop-blur-xl border border-white/25 dark:border-zinc-800/40 hover:-translate-y-0.5">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{value}</h4>
      </div>
      <div className={`h-7 w-7 rounded-xl flex items-center justify-center border-0 bg-opacity-10 dark:bg-opacity-20 ${indicatorColors[type].split(" ")[1]} ${indicatorColors[type].split(" ")[2]}`}>
        <span className={`h-2 w-2 rounded-full ${indicatorColors[type].split(" ")[0]} animate-pulse`} />
      </div>
    </div>
  );
}

