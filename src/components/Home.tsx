import { useState } from "react";
import { Movie } from "../types";
import { POPULAR_MOVIES } from "../data/movies";
import { Search, Filter, Clock, Star, Plus, Film, X, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HomeProps {
  onQuickLog: (movie: Movie) => void;
}

export default function Home({ onQuickLog }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Get all unique genres
  const allGenres = ["All", ...Array.from(new Set(POPULAR_MOVIES.flatMap((m) => m.genres)))];

  // Filter movies
  const filteredMovies = POPULAR_MOVIES.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGenre = selectedGenre === "All" || movie.genres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-8" id="home-view">
      {/* Hero Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-[#090909] p-8 md:p-12 border border-white/10 shadow-2xl"
        id="hero-banner"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-accent/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop')] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-accent/10 px-4 py-1 border border-gold-accent/20">
            <span className="flex h-1.5 w-1.5 rounded-full bg-gold-accent animate-pulse"></span>
            <span className="micro-label text-gold-accent">Curated Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl serif italic font-light leading-tight text-white tracking-tight">
            Your Personal Film Journal & Taste Archive
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl font-light">
            Chronicle every cinematic masterpiece you encounter, catalog deep reflections, and query the AI critic to curate recommendations tailored to your unique taste.
          </p>
        </div>
      </div>

      {/* Control Bar (Search & Filter) */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-[#121212] p-4 rounded-2xl border border-white/5" id="controls-bar">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
          <input
            type="text"
            id="movie-search-input"
            placeholder="Search by title, director, or cast..."
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 focus:border-gold-accent/50 text-xs tracking-wide transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Genre Tags Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" id="genre-filters">
          <Filter className="text-neutral-500 h-4 w-4 flex-shrink-0 mr-1 hidden md:block" />
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition whitespace-nowrap font-semibold ${
                selectedGenre === genre
                  ? "bg-gold-accent text-neutral-950"
                  : "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 border border-white/5"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" id="movies-grid">
        {filteredMovies.map((movie) => (
          <motion.div
            key={movie.id}
            layoutId={`movie-card-${movie.id}`}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col bg-[#121212] rounded-xl border border-white/5 overflow-hidden cursor-pointer shadow-lg hover:border-white/15 transition-colors"
            onClick={() => setSelectedMovie(movie)}
          >
            {/* Poster container */}
            <div className="relative aspect-[2/3] w-full bg-black overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              
              {/* Quick Log Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickLog(movie);
                }}
                id={`quick-log-${movie.id}`}
                className="absolute top-3 right-3 p-2 bg-black/85 backdrop-blur-md text-gold-accent rounded-xl border border-white/10 hover:bg-gold-accent hover:text-black hover:border-gold-accent transition shadow-lg"
                title="Log this movie"
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* Movie rating pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/85 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg text-[10px] text-gold-accent font-semibold tracking-wide">
                <Star className="h-3 w-3 fill-gold-accent text-gold-accent" />
                {movie.rating.toFixed(1)}
              </div>
            </div>

            {/* Movie metadata */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 bg-black/20">
              <div>
                <h3 className="serif font-semibold text-neutral-200 group-hover:text-gold-accent transition text-sm line-clamp-1 leading-snug">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mt-1">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.duration} min</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.genres.slice(0, 2).map((g) => (
                  <span key={g} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredMovies.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-500 bg-[#121212] rounded-2xl border border-dashed border-white/10" id="no-search-results">
            <Film className="h-10 w-10 mx-auto text-neutral-600 mb-3" />
            <h3 className="serif italic text-lg text-neutral-300">No movies found</h3>
            <p className="text-neutral-500 text-xs mt-1">Try refining your search keyword or selecting another genre filter.</p>
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" id="movie-details-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative w-full max-w-3xl bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition border border-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Poster Block */}
                <div className="md:w-2/5 relative aspect-[2/3] md:aspect-auto md:h-[450px] bg-black">
                  <img
                    src={selectedMovie.posterUrl}
                    alt={selectedMovie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale md:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#121212] via-transparent to-transparent"></div>
                </div>

                {/* Content Block */}
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMovie.genres.map((g) => (
                          <span key={g} className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-gold-accent/10 text-gold-accent border border-gold-accent/20">
                            {g}
                          </span>
                        ))}
                      </div>
                      <h2 className="serif text-3xl font-light italic text-white leading-tight">
                        {selectedMovie.title}
                      </h2>
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                          {selectedMovie.year}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-neutral-500" />
                          {selectedMovie.duration}m
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-gold-accent">
                          <Star className="h-3.5 w-3.5 fill-gold-accent text-gold-accent" />
                          {selectedMovie.rating.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-xs md:text-sm leading-relaxed font-light">
                      {selectedMovie.synopsis}
                    </p>

                    {/* Metadata items */}
                    <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                      <div className="flex items-start">
                        <span className="text-neutral-500 w-20 flex-shrink-0 font-semibold uppercase tracking-wider text-[10px]">Director:</span>
                        <span className="text-neutral-200 serif">{selectedMovie.director}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-neutral-500 w-20 flex-shrink-0 font-semibold uppercase tracking-wider text-[10px]">Starring:</span>
                        <span className="text-neutral-200 font-light">{selectedMovie.cast.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        onQuickLog(selectedMovie);
                        setSelectedMovie(null);
                      }}
                      id="modal-quick-log-btn"
                      className="flex-1 py-3 px-4 bg-gold-accent text-black font-semibold rounded-full hover:bg-gold-hover transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      Log Watched Film
                    </button>
                    <button
                      onClick={() => setSelectedMovie(null)}
                      className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-full transition text-xs uppercase tracking-wider border border-white/5"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
