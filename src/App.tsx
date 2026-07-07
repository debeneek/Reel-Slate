import { useState, useEffect } from "react";
import { LogEntry, Movie } from "./types";
import Home from "./components/Home";
import Logger from "./components/Logger";
import Quiz from "./components/Quiz";
import Stats from "./components/Stats";
import { Film, Sparkles, BookOpen, BarChart3, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Seed data for new users to immediately see beautiful journal entries and statistics
const INITIAL_LOGS: LogEntry[] = [
  {
    id: "seed_1",
    movieId: "m2",
    movieTitle: "The Dark Knight",
    movieYear: 2008,
    moviePosterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80",
    dateWatched: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    rating: 5,
    review: "Heath Ledger's performance as the Joker is legendary. The direction, musical score, and pacing are perfect. Easily one of the greatest movies of all time.",
    isRewatch: true,
    watchedWith: "Partner",
    tags: ["Classic", "Late Night", "Action"]
  },
  {
    id: "seed_2",
    movieId: "m6",
    movieTitle: "Spirited Away",
    movieYear: 2001,
    moviePosterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    dateWatched: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 6 days ago
    rating: 5,
    review: "Stunning hand-drawn animation and an incredibly imaginative spirit world. A heartwarming masterpiece from Studio Ghibli.",
    isRewatch: false,
    watchedWith: "Family",
    tags: ["Classic", "Animation", "Family"]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "quiz" | "logger" | "stats">("home");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [prepopulatedMovie, setPrepopulatedMovie] = useState<Movie | null>(null);

  // Load logs on mount
  useEffect(() => {
    const saved = localStorage.getItem("cinelog_logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs from localstorage:", e);
        setLogs(INITIAL_LOGS);
      }
    } else {
      // Seed initial logs for beautiful onboarding
      setLogs(INITIAL_LOGS);
      localStorage.setItem("cinelog_logs", JSON.stringify(INITIAL_LOGS));
    }
  }, []);

  // Sync logs to localStorage
  const handleAddLog = (newLog: LogEntry) => {
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("cinelog_logs", JSON.stringify(updated));
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((log) => log.id !== id);
    setLogs(updated);
    localStorage.setItem("cinelog_logs", JSON.stringify(updated));
  };

  // Helper to handle Quick Log from Home Screen
  const handleQuickLog = (movie: Movie) => {
    setPrepopulatedMovie(movie);
    setActiveTab("logger");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-100 font-sans selection:bg-gold-accent selection:text-neutral-950" id="app-root">
      {/* Dynamic Ambient Blur Background elements */}
      <div className="fixed top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gold-accent/3 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-white/2 blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur-md border-b border-white/5" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab("home")}
            id="brand-logo"
          >
            <div className="h-9 w-9 bg-gold-accent rounded-xl flex items-center justify-center shadow-lg shadow-gold-accent/10">
              <Film className="h-5 w-5 text-neutral-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif italic text-xl tracking-tighter text-white">Reel-Slate.</span>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-semibold text-white/40 ml-2.5">
                Private Archive
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="flex items-center gap-1.5" id="nav-menu">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeTab === "home"
                  ? "bg-white/5 text-gold-accent border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/3"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeTab === "quiz"
                  ? "bg-white/5 text-gold-accent border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/3"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              AI Critic Quiz
            </button>
            <button
              onClick={() => setActiveTab("logger")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeTab === "logger"
                  ? "bg-white/5 text-gold-accent border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/3"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Watch Journal
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeTab === "stats"
                  ? "bg-white/5 text-gold-accent border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/3"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {activeTab === "home" && <Home onQuickLog={handleQuickLog} />}
            {activeTab === "quiz" && (
              <Quiz 
                onAddLog={handleAddLog} 
                onNavigateToJournal={() => setActiveTab("logger")} 
              />
            )}
            {activeTab === "logger" && (
              <Logger
                logs={logs}
                onAddLog={handleAddLog}
                onDeleteLog={handleDeleteLog}
                prepopulatedMovie={prepopulatedMovie}
                clearPrepopulatedMovie={() => setPrepopulatedMovie(null)}
              />
            )}
            {activeTab === "stats" && <Stats logs={logs} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Simple Aesthetic Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-8 text-center text-xs text-neutral-600 mt-20" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="micro-label">DESIGNED FOR FILM ENTHUSIASTS © {new Date().getFullYear()}</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="micro-label">System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="micro-label">Mood: Noir</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
