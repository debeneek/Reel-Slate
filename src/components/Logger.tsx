import { useState, useEffect, FormEvent } from "react";
import { LogEntry, Movie } from "../types";
import { POPULAR_MOVIES } from "../data/movies";
import { Star, Calendar, Users, RefreshCw, Plus, Trash2, Search, SlidersHorizontal, Eye, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoggerProps {
  logs: LogEntry[];
  onAddLog: (log: LogEntry) => void;
  onDeleteLog: (id: string) => void;
  prepopulatedMovie: Movie | null;
  clearPrepopulatedMovie: () => void;
}

export default function Logger({
  logs,
  onAddLog,
  onDeleteLog,
  prepopulatedMovie,
  clearPrepopulatedMovie,
}: LoggerProps) {
  // Form State
  const [movieTitle, setMovieTitle] = useState("");
  const [movieYear, setMovieYear] = useState<number | "">("");
  const [moviePosterUrl, setMoviePosterUrl] = useState("");
  const [dateWatched, setDateWatched] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isRewatch, setIsRewatch] = useState(false);
  const [watchedWith, setWatchedWith] = useState("Alone");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | "All">("All");
  const [filterCompanion, setFilterCompanion] = useState<string | "All">("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common tags
  const defaultTags = ["Streaming", "In Theater", "Late Night", "Classic", "Mind-bending", "Comfort Watch"];

  // Populate from quick log
  useEffect(() => {
    if (prepopulatedMovie) {
      setMovieTitle(prepopulatedMovie.title);
      setMovieYear(prepopulatedMovie.year);
      setMoviePosterUrl(prepopulatedMovie.posterUrl);
      // Reset other form fields
      setRating(5);
      setReview("");
      setIsRewatch(false);
      setWatchedWith("Alone");
      setSelectedTags([]);
      
      // Clear after populating
      clearPrepopulatedMovie();
    }
  }, [prepopulatedMovie, clearPrepopulatedMovie]);

  // Handle suggestion click
  const handleSuggestionSelect = (movie: Movie) => {
    setMovieTitle(movie.title);
    setMovieYear(movie.year);
    setMoviePosterUrl(movie.posterUrl);
    setShowSuggestions(false);
  };

  // Movie suggestions filtering
  const suggestions = POPULAR_MOVIES.filter(
    (m) =>
      movieTitle &&
      m.title.toLowerCase().includes(movieTitle.toLowerCase()) &&
      m.title.toLowerCase() !== movieTitle.toLowerCase()
  );

  // Handle Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    const newLog: LogEntry = {
      id: "log_" + Date.now(),
      movieTitle: movieTitle.trim(),
      movieYear: Number(movieYear) || new Date().getFullYear(),
      moviePosterUrl: moviePosterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
      dateWatched,
      rating,
      review: review.trim(),
      isRewatch,
      watchedWith,
      tags: selectedTags,
    };

    onAddLog(newLog);

    // Reset Form (except date watched)
    setMovieTitle("");
    setMovieYear("");
    setMoviePosterUrl("");
    setRating(5);
    setReview("");
    setIsRewatch(false);
    setWatchedWith("Alone");
    setSelectedTags([]);
  };

  // Toggle dynamic tags
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add custom tag
  const handleAddCustomTag = (e: FormEvent) => {
    e.preventDefault();
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCustomTag("");
    }
  };

  // Filtered log entries
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.review.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === "All" || log.rating === filterRating;
    
    const matchesCompanion = filterCompanion === "All" || log.watchedWith === filterCompanion;

    return matchesSearch && matchesRating && matchesCompanion;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="logger-view">
      {/* Logging Form Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#121212] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl" id="log-form-container">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gold-accent/10 text-gold-accent rounded-xl border border-gold-accent/20">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h2 className="serif text-xl italic font-light text-white">Log a Movie</h2>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Record your cinematic journey</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="movie-log-form">
            {/* Title & Autocomplete suggestions */}
            <div className="relative">
              <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                Movie Title <span className="text-gold-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inception, Gladiator..."
                className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition"
                value={movieTitle}
                onChange={(e) => {
                  setMovieTitle(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              
              {/* Autocomplete Suggestions Box */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-20 w-full mt-1.5 bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto"
                  >
                    {suggestions.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSuggestionSelect(m)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-900 transition text-xs border-b border-neutral-900/40 last:border-b-0"
                      >
                        <img src={m.posterUrl} alt="" referrerPolicy="no-referrer" className="w-8 h-10 object-cover rounded" />
                        <div>
                          <p className="serif font-semibold text-neutral-200">{m.title}</p>
                          <p className="text-neutral-500 text-[10px]">{m.year} • Dir: {m.director}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Year Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                  Release Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2010"
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition"
                  value={movieYear}
                  onChange={(e) => setMovieYear(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>

              {/* Date Watched */}
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                  Date Watched
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition"
                  value={dateWatched}
                  onChange={(e) => setDateWatched(e.target.value)}
                />
              </div>
            </div>

            {/* Poster URL (Optional but cool) */}
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                Custom Poster Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/poster.jpg"
                className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition"
                value={moviePosterUrl}
                onChange={(e) => setMoviePosterUrl(e.target.value)}
              />
            </div>

            {/* Interactive Rating (Stars) */}
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5 bg-black p-3 rounded-xl border border-white/10 w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 hover:scale-110 transition duration-150"
                  >
                    <Star
                      className={`h-6.5 w-6.5 ${
                        star <= rating
                          ? "fill-gold-accent text-gold-accent"
                          : "text-neutral-700 hover:text-neutral-500"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-neutral-400 ml-2.5">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Watched With & Rewatch Toggle */}
            <div className="grid grid-cols-2 gap-4 pt-1.5">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                  Social Context
                </label>
                <select
                  className="w-full px-3 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-gold-accent/50 transition cursor-pointer"
                  value={watchedWith}
                  onChange={(e) => setWatchedWith(e.target.value)}
                >
                  <option value="Alone">Solo Watch</option>
                  <option value="Partner">With Partner</option>
                  <option value="Friends">With Friends</option>
                  <option value="Family">With Family</option>
                </select>
              </div>

              {/* Rewatch Toggle */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setIsRewatch(!isRewatch)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                    isRewatch
                      ? "bg-gold-accent/10 border-gold-accent/40 text-gold-accent"
                      : "bg-black border-white/10 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRewatch ? "animate-spin" : ""}`} style={{ animationDuration: isRewatch ? "4s" : "0s" }} />
                  {isRewatch ? "Rewatched Film" : "First Time Watch"}
                </button>
              </div>
            </div>

            {/* Review / Journal Notes */}
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                Review & Personal Notes
              </label>
              <textarea
                placeholder="What did you think of the directing, pacing, cinematography? Any memorable scenes?..."
                className="w-full min-h-[100px] px-4 py-3 bg-black border border-white/10 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition resize-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wide">
                Select Custom Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {defaultTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition ${
                        isSelected
                          ? "bg-gold-accent/10 border-gold-accent/50 text-gold-accent"
                          : "bg-black border-white/5 text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create new tag..."
                  className="flex-1 px-3 py-1.5 bg-black border border-white/10 rounded-full text-neutral-300 placeholder-neutral-600 text-xs focus:outline-none focus:ring-1 focus:ring-gold-accent/50 transition"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full text-neutral-300 font-semibold text-xs transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gold-accent text-black font-bold rounded-full hover:bg-gold-hover transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              Save to Journal
            </button>
          </form>
        </div>
      </div>

      {/* Watch Journal List Section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="serif text-xl italic font-light text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold-accent" />
              Watch Journal ({filteredLogs.length})
            </h2>
            <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Your chronological history of watched movies</p>
          </div>

          {/* Quick Logs Control Panel */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-8.5 pr-3 py-1.5 bg-[#121212] border border-white/10 rounded-full text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold-accent/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition ${
                showFilters || filterRating !== "All" || filterCompanion !== "All"
                  ? "bg-gold-accent/10 border-gold-accent/40 text-gold-accent"
                  : "bg-[#121212] border-white/10 text-neutral-400 hover:text-white"
              }`}
              title="Filter journal entries"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#121212] border border-white/10 rounded-2xl mb-4 text-xs">
                <div>
                  <label className="block text-neutral-500 font-semibold uppercase tracking-wider text-[9px] mb-1">Filter by Rating</label>
                  <select
                    className="w-full p-2 bg-black border border-white/5 rounded-lg text-neutral-300"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value === "All" ? "All" : Number(e.target.value))}
                  >
                    <option value="All">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-500 font-semibold uppercase tracking-wider text-[9px] mb-1">Filter by Companion</label>
                  <select
                    className="w-full p-2 bg-black border border-white/5 rounded-lg text-neutral-300"
                    value={filterCompanion}
                    onChange={(e) => setFilterCompanion(e.target.value)}
                  >
                    <option value="All">All Companions</option>
                    <option value="Alone">Solo Watches</option>
                    <option value="Partner">With Partner</option>
                    <option value="Friends">With Friends</option>
                    <option value="Family">With Family</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Entries List */}
        <div className="space-y-4 max-h-[850px] overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-[#121212] border border-white/5 rounded-2xl p-4 md:p-5 flex gap-4 md:gap-5 shadow-md relative group hover:border-white/10 transition-colors"
              >
                {/* Poster column */}
                <div className="w-16 md:w-20 aspect-[2/3] bg-black rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                  <img src={log.moviePosterUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>

                {/* Info column */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="serif text-white font-medium text-sm md:text-base leading-tight flex flex-wrap items-center gap-x-2 gap-y-1">
                        {log.movieTitle}
                        <span className="text-neutral-500 text-xs font-normal">({log.movieYear})</span>
                      </h3>
                      
                      {/* Watch metadata tags */}
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {log.dateWatched}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {log.watchedWith}
                        </span>
                        {log.isRewatch && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-gold-accent/85 font-semibold bg-gold-accent/5 px-2 py-0.5 rounded border border-gold-accent/10">
                              <RefreshCw className="h-2.5 w-2.5" />
                              Rewatch
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Delete */}
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="text-neutral-600 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition"
                      title="Delete journal entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Rating Stars displaying */}
                  <div className="flex items-center gap-0.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= log.rating
                            ? "fill-gold-accent text-gold-accent"
                            : "text-neutral-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Notes Box */}
                  {log.review && (
                    <p className="text-neutral-300 text-xs leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5 font-light">
                      &ldquo;{log.review}&rdquo;
                    </p>
                  )}

                  {/* Log specific tags */}
                  {log.tags && log.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {log.tags.map((t) => (
                        <span key={t} className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLogs.length === 0 && (
            <div className="py-20 text-center text-neutral-500 bg-black/20 rounded-2xl border border-dashed border-white/5">
              <FileText className="h-10 w-10 mx-auto text-neutral-700 mb-3" />
              <h3 className="serif italic text-lg text-neutral-300">Your journal is empty</h3>
              <p className="text-neutral-500 text-xs mt-1">
                {searchQuery || filterRating !== "All" || filterCompanion !== "All"
                  ? "No logs match your filter criteria."
                  : "Begin tracking movies you watch by logging them in the form on the left."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
