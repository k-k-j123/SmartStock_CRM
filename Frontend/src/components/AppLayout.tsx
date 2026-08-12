import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-background/40 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="glow-blob left-[10%] top-[20%] h-[350px] w-[350px] bg-primary/10 dark:bg-primary/5" />
      <div className="glow-blob right-[15%] bottom-[15%] h-[400px] w-[400px] bg-purple-500/10 dark:bg-purple-900/5" />
      
      <AppSidebar />
      
      <div className="ml-16 flex flex-1 flex-col min-w-0 relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

