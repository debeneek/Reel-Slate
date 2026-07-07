import { useState } from "react";
import { QUIZ_QUESTIONS } from "../data/movies";
import { QuizAnswers, Recommendation, Movie } from "../types";
import { 
  Sparkles, Swords, Rocket, Theater, Laugh, Flame, Heart, Ghost, 
  Sun, Brain, Compass, CloudRain, Zap, Tv, Film, Video, Clapperboard,
  FastForward, Play, Hourglass, User, Users2, PartyPopper, Home as HomeIcon,
  ChevronRight, ChevronLeft, RotateCcw, Star, Film as MovieIcon, Check, Plus, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Icon mapping helper
const iconMap: { [key: string]: any } = {
  Swords, Rocket, Theater, Laugh, Flame, Heart, Sparkles, Ghost,
  Sun, Brain, Compass, CloudRain, Zap, Tv, Film, Video, Clapperboard,
  FastForward, Play, Hourglass, User, Users2, PartyPopper, Home: HomeIcon
};

interface QuizProps {
  onAddLog: (log: any) => void;
  onNavigateToJournal: () => void;
}

export default function Quiz({ onAddLog, onNavigateToJournal }: QuizProps) {
  // Navigation & Answers State
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    genres: [],
    mood: "",
    era: [],
    tempo: "",
    viewingType: "",
    additionalNotes: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedRecommendationTitles, setLoggedRecommendationTitles] = useState<string[]>([]);

  // Loading rotation phrases
  const loadingPhrases = [
    "Opening our cinematic vaults...",
    "Analyzing film catalog structures...",
    "Consulting director filmographies and pacing models...",
    "Aligning screenplays with your current emotional profile...",
    "Assembling a customized short-list of masterpieces..."
  ];

  const handleOptionSelect = (category: string, value: string, multipleSelect?: boolean) => {
    if (multipleSelect) {
      const currentValues = (answers as any)[category] as string[];
      if (currentValues.includes(value)) {
        setAnswers({
          ...answers,
          [category]: currentValues.filter((v) => v !== value)
        });
      } else {
        setAnswers({
          ...answers,
          [category]: [...currentValues, value]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [category]: value
      });
    }
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Run loading animation loop
  const startLoadingAnimation = () => {
    setLoading(true);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingPhrases.length);
    }, 2800);
    return interval;
  };

  // Submit profile to Backend
  const handleSubmitQuiz = async () => {
    const loadingInterval = startLoadingAnimation();
    setError(null);
    setRecommendations(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error("Failed to consult the AI film critic. Please try again.");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      clearInterval(loadingInterval);
      setLoading(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentStep(0);
    setAnswers({
      genres: [],
      mood: "",
      era: [],
      tempo: "",
      viewingType: "",
      additionalNotes: ""
    });
    setRecommendations(null);
    setLoggedRecommendationTitles([]);
    setError(null);
  };

  // Quick log a recommended movie
  const handleLogRecommendation = (rec: Recommendation) => {
    const newLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      movieTitle: rec.title,
      movieYear: rec.year,
      moviePosterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
      dateWatched: new Date().toISOString().split("T")[0],
      rating: 5, // Default to 5 star for recommended match
      review: `Recommended by CineLog AI. Match score: ${rec.matchScore}%. why it fits: "${rec.whyRecommend}"`,
      isRewatch: false,
      watchedWith: answers.viewingType ? (answers.viewingType.charAt(0).toUpperCase() + answers.viewingType.slice(1)) : "Alone",
      tags: ["AI Recommendation", ...answers.genres]
    };

    onAddLog(newLog);
    setLoggedRecommendationTitles([...loggedRecommendationTitles, rec.title]);
  };

  // Calculate current progress
  const progressPercentage = Math.round((currentStep / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="quiz-view">
      {/* Quiz Progress & Navigation Header */}
      {!recommendations && !loading && (
        <div className="flex items-center justify-between gap-4 bg-[#121212] px-6 py-4 rounded-2xl border border-white/5 shadow-sm" id="quiz-header">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gold-accent/10 text-gold-accent rounded-lg border border-gold-accent/20">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold-accent">AI Film Critic</span>
              <h2 className="serif text-sm font-light text-white">Recommendation Wizard</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
            <span>Step {currentStep + 1} of {QUIZ_QUESTIONS.length + 1}</span>
            <div className="w-24 bg-black h-2 rounded-full overflow-hidden border border-white/10">
              <div 
                className="bg-gold-accent h-full transition-all duration-300 rounded-full" 
                style={{ width: `${Math.max(10, ((currentStep + 1) / (QUIZ_QUESTIONS.length + 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main card viewport */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* loading state */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center shadow-xl space-y-8 min-h-[380px] flex flex-col justify-center items-center"
              id="quiz-loading-view"
            >
              <div className="relative">
                {/* Rotating film logo */}
                <div className="h-20 w-20 border-t-2 border-r-2 border-gold-accent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MovieIcon className="h-7 w-7 text-gold-accent" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="serif text-lg font-light text-white tracking-wide">Evaluating Film Profile</h3>
                <p className="text-neutral-400 text-xs italic min-h-[40px] px-4 animate-pulse">
                  &ldquo;{loadingPhrases[loadingStep]}&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          {/* Error view */}
          {error && (
            <motion.div
              key="error"
              className="bg-[#121212] border border-white/5 rounded-3xl p-8 text-center space-y-6"
            >
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="serif text-lg font-light text-white">Curator Network Offline</h3>
                <p className="text-neutral-400 text-xs max-w-md mx-auto">{error}</p>
              </div>
              <button
                onClick={handleResetQuiz}
                className="py-2.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-full border border-white/10 transition flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart Quiz
              </button>
            </motion.div>
          )}

          {/* Recommendations Display */}
          {recommendations && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              id="quiz-results-view"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gold-accent/10 to-transparent p-6 rounded-3xl border border-gold-accent/15">
                <div>
                  <h2 className="serif text-2xl font-light italic text-white tracking-tight flex items-center gap-2.5">
                    <Sparkles className="h-6 w-6 text-gold-accent" />
                    Curated For You
                  </h2>
                  <p className="text-neutral-400 text-xs mt-1">Based on your mood, preferred genre structures, film era preferences, and narrative pacing.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleResetQuiz}
                    className="py-2 px-4 bg-neutral-900 border border-white/10 text-neutral-300 text-xs font-semibold rounded-full hover:bg-neutral-850 hover:border-neutral-700 transition flex items-center gap-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retake Quiz
                  </button>
                  <button
                    onClick={onNavigateToJournal}
                    className="py-2 px-4 bg-gold-accent text-black text-xs font-bold rounded-full hover:bg-gold-hover transition"
                  >
                    Open Journal
                  </button>
                </div>
              </div>

              {/* Recommendations list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="quiz-recommendations-list">
                {recommendations.map((rec, index) => {
                  const isLogged = loggedRecommendationTitles.includes(rec.title);
                  
                  return (
                    <motion.div
                      key={rec.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.15 } }}
                      className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden hover:border-white/10 transition-colors"
                    >
                      {/* Decorative gradient corner */}
                      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-gold-accent/5 to-transparent pointer-events-none"></div>

                      <div className="space-y-4">
                        {/* Header metadata */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="serif text-lg font-medium text-white leading-snug">{rec.title}</h3>
                            <p className="text-xs text-neutral-500">Dir: {rec.director} • {rec.year}</p>
                          </div>

                          {/* Match score gauge */}
                          <div className="flex flex-col items-end">
                            <div className="text-sm font-black text-gold-accent flex items-center gap-1">
                              <span>{rec.matchScore}%</span>
                            </div>
                            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Match</span>
                          </div>
                        </div>

                        {/* Genre Tags */}
                        <div className="flex flex-wrap gap-1">
                          {rec.genres.map((g) => (
                            <span key={g} className="text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-black text-neutral-400 border border-white/5">
                              {g}
                            </span>
                          ))}
                        </div>

                        {/* Synopsis block */}
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Synopsis</span>
                          <p className="text-neutral-300 text-xs leading-relaxed line-clamp-3">{rec.synopsis}</p>
                        </div>

                        {/* Personalized "Why it fits" Callout */}
                        <div className="p-3 bg-gold-accent/[0.03] border border-gold-accent/10 rounded-2xl space-y-1">
                          <span className="text-[10px] font-bold text-gold-accent/95 uppercase tracking-wide flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Why It Fits Your Profile
                          </span>
                          <p className="text-neutral-300 text-xs leading-relaxed italic">
                            &ldquo;{rec.whyRecommend}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Log Quick Action */}
                      <div className="pt-2">
                        {isLogged ? (
                          <div className="w-full py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 font-semibold rounded-full text-xs flex items-center justify-center gap-2">
                            <Check className="h-4 w-4 stroke-[2.5]" />
                            Logged in Watch History
                          </div>
                        ) : (
                          <button
                            onClick={() => handleLogRecommendation(rec)}
                            className="w-full py-2.5 bg-black hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white font-semibold rounded-full text-xs transition flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Log as Watched
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {/* Questionnaire Steps */}
          {!recommendations && !loading && !error && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6"
            >
              {currentStep < QUIZ_QUESTIONS.length ? (
                // Step Question Card
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Question {currentStep + 1}</span>
                    <h3 className="serif text-xl md:text-2xl font-light italic text-white mt-1 leading-tight">
                      {QUIZ_QUESTIONS[currentStep].text}
                    </h3>
                    {QUIZ_QUESTIONS[currentStep].multipleSelect && (
                      <p className="text-neutral-500 text-xs mt-1">Select multiple option tiles that correspond to your tastes.</p>
                    )}
                  </div>

                  {/* Grid of options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUIZ_QUESTIONS[currentStep].options.map((opt) => {
                      const category = QUIZ_QUESTIONS[currentStep].category;
                      const isSelected = QUIZ_QUESTIONS[currentStep].multipleSelect
                        ? (answers as any)[category].includes(opt.value)
                        : (answers as any)[category] === opt.value;
                      
                      const IconComponent = opt.icon ? iconMap[opt.icon] : null;

                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleOptionSelect(category, opt.value, QUIZ_QUESTIONS[currentStep].multipleSelect)}
                          className={`flex items-start text-left p-4 rounded-2xl border transition group cursor-pointer ${
                            isSelected
                              ? "bg-gold-accent/10 border-gold-accent text-gold-accent shadow-lg shadow-gold-accent/[0.02]"
                              : "bg-black border-white/5 text-neutral-400 hover:border-white/10 hover:text-neutral-200"
                          }`}
                        >
                          <div className="flex gap-4">
                            {IconComponent && (
                              <div className={`p-2.5 rounded-xl border transition ${
                                isSelected 
                                  ? "bg-gold-accent/10 border-gold-accent/20 text-gold-accent" 
                                  : "bg-neutral-900 border-white/5 text-neutral-500 group-hover:text-neutral-300"
                              }`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <p className={`serif font-medium text-sm ${isSelected ? "text-gold-accent" : "text-neutral-200"}`}>
                                {opt.label}
                              </p>
                              {opt.description && (
                                <p className="text-neutral-500 text-xs leading-normal">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Step 6: Custom Requirements
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Step 6 of 6</span>
                    <h3 className="serif text-xl md:text-2xl font-light italic text-white mt-1 leading-tight">
                      Any specific notes or quirks?
                    </h3>
                    <p className="text-neutral-500 text-xs mt-1">Specify things like &ldquo;no jump scares&rdquo;, &ldquo;amazing sound design&rdquo;, or list a favorite director.</p>
                  </div>

                  <textarea
                    placeholder="e.g. I want a thriller with a massive plot twist, or looking for French arthouse cinema, or something starring Cillian Murphy..."
                    className="w-full min-h-[150px] p-4 bg-black border border-white/10 rounded-2xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 text-sm transition resize-none"
                    value={answers.additionalNotes}
                    onChange={(e) => setAnswers({ ...answers, additionalNotes: e.target.value })}
                  />
                </div>
              )}

              {/* Navigation Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                    currentStep === 0
                      ? "opacity-40 cursor-not-allowed text-neutral-600 border-white/5 bg-transparent"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border-white/5"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep < QUIZ_QUESTIONS.length ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      QUIZ_QUESTIONS[currentStep].multipleSelect
                        ? (answers as any)[QUIZ_QUESTIONS[currentStep].category].length === 0
                        : !(answers as any)[QUIZ_QUESTIONS[currentStep].category]
                    }
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-gold-accent hover:bg-gold-hover text-black font-bold rounded-full text-xs uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gold-accent hover:bg-gold-hover text-black font-bold rounded-full text-xs uppercase tracking-wider transition shadow-lg shadow-gold-accent/10"
                  >
                    <Sparkles className="h-4 w-4 fill-black" />
                    Generate AI Recs
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
