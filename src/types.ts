export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  duration: number; // in minutes
  rating: number; // average rating out of 10 or 5? Let's use 5 stars.
  posterUrl: string;
  synopsis: string;
  cast: string[];
}

export interface LogEntry {
  id: string;
  movieId?: string; // Optional link to catalog movie
  movieTitle: string;
  movieYear: number;
  moviePosterUrl?: string;
  dateWatched: string; // YYYY-MM-DD
  rating: number; // 1-5 stars
  review: string;
  isRewatch: boolean;
  watchedWith: string; // e.g. "Alone", "Friends", "Family", "Partner"
  durationMinutes?: number;
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  category: string;
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
  multipleSelect?: boolean;
}

export interface Recommendation {
  title: string;
  year: number;
  director: string;
  genres: string[];
  synopsis: string;
  whyRecommend: string;
  matchScore: number; // percentage out of 100
  posterUrl?: string;
}

export interface QuizAnswers {
  genres: string[];
  mood: string;
  era: string[];
  tempo: string;
  viewingType: string;
  additionalNotes?: string;
}
