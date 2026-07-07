import { LogEntry } from "../types";
import { POPULAR_MOVIES } from "../data/movies";
import { BarChart3, Clock, Star, Users, Trophy, Award, Landmark, Eye, Heart } from "lucide-react";
import { motion } from "motion/react";

interface StatsProps {
  logs: LogEntry[];
}

export default function Stats({ logs }: StatsProps) {
  // Helpers
  const totalLogged = logs.length;

  const averageRating = totalLogged > 0
    ? (logs.reduce((sum, log) => sum + log.rating, 0) / totalLogged).toFixed(1)
    : "0.0";

  // Calculate estimated total watch time (minutes)
  const totalMinutes = logs.reduce((sum, log) => {
    const matched = POPULAR_MOVIES.find((m) => m.title.toLowerCase() === log.movieTitle.toLowerCase());
    return sum + (matched ? matched.duration : 115); // Default to 115 min if custom
  }, 0);
  const totalHours = Math.round(totalMinutes / 60);

  // Social Companion frequencies
  const companions: { [key: string]: number } = { Alone: 0, Partner: 0, Friends: 0, Family: 0 };
  logs.forEach((log) => {
    const key = log.watchedWith;
    if (key in companions) {
      companions[key]++;
    } else {
      // Handle custom or alternate casings
      companions.Alone++;
    }
  });

  // Calculate top genres
  const genreCounts: { [key: string]: number } = {};
  logs.forEach((log) => {
    // Check if linked to catalog
    const matched = POPULAR_MOVIES.find((m) => m.title.toLowerCase() === log.movieTitle.toLowerCase());
    const genres = matched ? matched.genres : (log.tags?.filter(t => !["Streaming", "In Theater", "Late Night", "Classic", "AI Recommendation"].includes(t)) || ["Drama"]);
    
    genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 1;

  // Badge unlock calculation
  const badges = [
    {
      id: "b1",
      title: "First Frame",
      desc: "Log your very first watched movie",
      unlocked: totalLogged >= 1,
      icon: Eye,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      id: "b2",
      title: "Cinephile Apprentice",
      desc: "Log at least 5 movies",
      unlocked: totalLogged >= 5,
      icon: Award,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      id: "b3",
      title: "Star Critic",
      desc: "Write detailed reviews for 3+ movies",
      unlocked: logs.filter((l) => l.review.trim().length > 15).length >= 3,
      icon: Trophy,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: "b4",
      title: "Social Viewer",
      desc: "Log 3+ movies watched with friends or family",
      unlocked: (companions.Friends + companions.Family) >= 3,
      icon: Users,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      id: "b5",
      title: "Loyal Enthusiast",
      desc: "Log a rewatch movie",
      unlocked: logs.some((l) => l.isRewatch),
      icon: Heart,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      id: "b6",
      title: "Arthouse Scholar",
      desc: "Generate recommendations via the AI quiz 1+ times",
      unlocked: logs.some((l) => l.tags?.includes("AI Recommendation")),
      icon: Landmark,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8" id="stats-view">
      {/* High-level Numeric Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-bento-numerical">
        <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-gold-accent/10 text-gold-accent rounded-xl border border-gold-accent/10">
            <BarChart3 className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Total Logged</p>
            <p className="serif text-2xl font-light text-white mt-0.5">{totalLogged}</p>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-gold-accent/10 text-gold-accent rounded-xl border border-gold-accent/10">
            <Clock className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Watch Time</p>
            <p className="serif text-2xl font-light text-white mt-0.5">{totalHours} <span className="text-xs text-neutral-500 font-normal">hrs</span></p>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-gold-accent/10 text-gold-accent rounded-xl border border-gold-accent/10">
            <Star className="h-5.5 w-5.5 fill-gold-accent/10" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Average Rating</p>
            <p className="serif text-2xl font-light text-white mt-0.5">{averageRating} <span className="text-xs text-neutral-500 font-normal">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-gold-accent/10 text-gold-accent rounded-xl border border-gold-accent/10">
            <Trophy className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Badges Earned</p>
            <p className="serif text-2xl font-light text-white mt-0.5">{unlockedBadgesCount} <span className="text-xs text-neutral-500 font-normal">/ {badges.length}</span></p>
          </div>
        </div>
      </div>

      {/* Analytical charts & metrics breakdown */}
      {totalLogged > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="stats-charts-breakdown">
          {/* Top Genres Breakdown */}
          <div className="bg-[#121212] p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <div>
              <h3 className="serif text-white font-medium text-base">Top Genres</h3>
              <p className="text-neutral-500 text-xs">Frequencies of genres you watch most</p>
            </div>

            <div className="space-y-3 pt-2">
              {sortedGenres.length > 0 ? (
                sortedGenres.map(([genre, count]) => {
                  const widthPercent = Math.max(10, Math.round((count / maxGenreCount) * 100));
                  return (
                    <div key={genre} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-300">{genre}</span>
                        <span className="text-neutral-500 font-semibold">{count} film{count > 1 ? "s" : ""}</span>
                      </div>
                      <div className="bg-black h-2 w-full rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="bg-gold-accent h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-neutral-500">No genre logs calculated.</p>
              )}
            </div>
          </div>

          {/* Social Companion Spread */}
          <div className="bg-[#121212] p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <div>
              <h3 className="serif text-white font-medium text-base">Social Companions</h3>
              <p className="text-neutral-500 text-xs">With whom you watch films</p>
            </div>

            <div className="space-y-3.5 pt-2 text-xs">
              {Object.entries(companions).map(([comp, count]) => {
                const percent = totalLogged > 0 ? Math.round((count / totalLogged) * 100) : 0;
                return (
                  <div key={comp} className="flex items-center gap-4">
                    <span className="font-semibold text-neutral-400 w-24">{comp === "Partner" ? "Date Night" : comp === "Alone" ? "Solo Watch" : `With ${comp}`}</span>
                    <div className="flex-1 bg-black h-2 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-gold-accent h-full rounded-full opacity-80"
                      ></motion.div>
                    </div>
                    <span className="text-neutral-300 font-bold w-10 text-right">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-neutral-500 bg-black/20 rounded-3xl border border-dashed border-white/5" id="stats-empty-placeholder">
          <p className="text-xs">Once you log your movies in the Watch Journal, personalized statistical breakdowns will populate here.</p>
        </div>
      )}

      {/* Badges / Milestones Section */}
      <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-6" id="stats-badges-milestones">
        <div>
          <h3 className="serif text-white font-medium text-base">Aesthetic Milestones</h3>
          <p className="text-neutral-500 text-xs">Earn badges as you explore and track films</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`flex gap-4 p-4 rounded-2xl border transition duration-200 ${
                  badge.unlocked
                    ? "bg-[#161616] border-white/10 hover:border-white/15"
                    : "bg-black/25 border-white/5 opacity-35"
                }`}
              >
                <div className={`p-2.5 h-11 w-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                  badge.unlocked 
                    ? "text-gold-accent bg-gold-accent/10 border-gold-accent/20" 
                    : "text-neutral-600 bg-black border-white/5"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-0.5">
                  <p className={`serif text-xs font-medium ${badge.unlocked ? "text-neutral-100" : "text-neutral-500"}`}>
                    {badge.title}
                  </p>
                  <p className="text-neutral-500 text-[10px] leading-snug">
                    {badge.desc}
                  </p>
                  {badge.unlocked && (
                    <span className="inline-block text-[8px] uppercase tracking-wider text-gold-accent font-semibold bg-gold-accent/5 px-2 py-0.5 rounded border border-gold-accent/10 mt-1">
                      Unlocked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
