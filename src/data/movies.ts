import { Movie, QuizQuestion } from "../types";

export const POPULAR_MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Action", "Thriller"],
    duration: 148,
    rating: 4.8,
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"]
  },
  {
    id: "m2",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    genres: ["Action", "Crime", "Drama"],
    duration: 152,
    rating: 4.9,
    posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Maggie Gyllenhaal"]
  },
  {
    id: "m3",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon Ho",
    genres: ["Thriller", "Drama", "Comedy"],
    duration: 132,
    rating: 4.7,
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"]
  },
  {
    id: "m4",
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    duration: 169,
    rating: 4.8,
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    synopsis: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
  },
  {
    id: "m5",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    genres: ["Crime", "Drama"],
    duration: 154,
    rating: 4.6,
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"]
  },
  {
    id: "m6",
    title: "Spirited Away",
    year: 2001,
    director: "Hayao Miyazaki",
    genres: ["Animation", "Fantasy", "Family"],
    duration: 125,
    rating: 4.8,
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki", "Takashi Naito"]
  },
  {
    id: "m7",
    title: "La La Land",
    year: 2016,
    director: "Damien Chazelle",
    genres: ["Romance", "Musical", "Drama"],
    duration: 128,
    rating: 4.5,
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    synopsis: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    cast: ["Ryan Gosling", "Emma Stone", "Rosemarie DeWitt", "J.K. Simmons"]
  },
  {
    id: "m8",
    title: "Whiplash",
    year: 2014,
    director: "Damien Chazelle",
    genres: ["Drama", "Music"],
    duration: 106,
    rating: 4.7,
    posterUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    synopsis: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser", "Melissa Benoist"]
  },
  {
    id: "m9",
    title: "Knives Out",
    year: 2019,
    director: "Rian Johnson",
    genres: ["Mystery", "Comedy", "Crime"],
    duration: 130,
    rating: 4.4,
    posterUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&auto=format&fit=crop&q=80",
    synopsis: "A detective investigates the death of the patriarch of an eccentric, combative family.",
    cast: ["Daniel Craig", "Chris Evans", "Ana de Armas", "Jamie Lee Curtis"]
  },
  {
    id: "m10",
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    director: "Bob Persichetti",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    duration: 117,
    rating: 4.8,
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80",
    synopsis: "Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld", "Mahershala Ali"]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "genres",
    text: "Which genres are you in the mood for?",
    category: "genres",
    multipleSelect: true,
    options: [
      { value: "Action", label: "Action", description: "High octane, stunts, and thrills", icon: "Swords" },
      { value: "Sci-Fi", label: "Sci-Fi", description: "Futuristic concepts, space, and tech", icon: "Rocket" },
      { value: "Drama", label: "Drama", description: "Emotional depth and strong characters", icon: "Theater" },
      { value: "Comedy", label: "Comedy", description: "Laughter, wit, and lightheartedness", icon: "Laugh" },
      { value: "Thriller", label: "Thriller", description: "Suspense, mystery, and edge-of-your-seat tension", icon: "Flame" },
      { value: "Romance", label: "Romance", description: "Love stories, connection, and feelings", icon: "Heart" },
      { value: "Animation", label: "Animation", description: "Stunning visuals and imaginative storytelling", icon: "Sparkles" },
      { value: "Horror", label: "Horror", description: "Scary, spooky, or psychological dread", icon: "Ghost" }
    ]
  },
  {
    id: "mood",
    text: "How are you feeling right now?",
    category: "mood",
    options: [
      { value: "uplifting", label: "Uplifting & Inspiring", description: "Make me feel happy and motivated", icon: "Sun" },
      { value: "thought-provoking", label: "Thought-Provoking", description: "Give me something to ponder long after", icon: "Brain" },
      { value: "escapist", label: "Fun & Escapist", description: "Help me turn my brain off and have fun", icon: "Compass" },
      { value: "emotional", label: "Emotional & Deep", description: "I'm ready for a good cry or heavy feelings", icon: "CloudRain" },
      { value: "intense", label: "Intense & Thrilling", description: "I want an adrenaline rush", icon: "Zap" }
    ]
  },
  {
    id: "era",
    text: "Which film eras do you prefer?",
    category: "era",
    multipleSelect: true,
    options: [
      { value: "modern", label: "Ultra Modern (2020s)", description: "Recent and contemporary cinema", icon: "Tv" },
      { value: "millennial", label: "Golden Millennial (2000s - 2010s)", description: "Nolan, Fincher, peak indie era", icon: "Film" },
      { value: "classic-modern", label: "90s / 80s Icons", description: "Spielberg, Tarantino, synth, pop culture", icon: "Video" },
      { value: "vintage", label: "Vintage Classics (Pre-1980)", description: "Hitchcock, Kubrick, noir, black & white", icon: "Clapperboard" }
    ]
  },
  {
    id: "tempo",
    text: "What pace are you looking for?",
    category: "tempo",
    options: [
      { value: "fast", label: "Fast-Paced", description: "Quick cuts, non-stop momentum", icon: "FastForward" },
      { value: "moderate", label: "Moderate & Balanced", description: "Steady progression of plot and character", icon: "Play" },
      { value: "slow", label: "Slow Burn", description: "Atmospheric, deliberate, deeply immersive", icon: "Hourglass" }
    ]
  },
  {
    id: "viewingType",
    text: "Who are you watching this with?",
    category: "viewingType",
    options: [
      { value: "alone", label: "Solo Watch", description: "A deep dive just for me", icon: "User" },
      { value: "partner", label: "Date Night", description: "A romantic or engaging watch for two", icon: "Users2" },
      { value: "friends", label: "With Friends", description: "Crowd pleaser, fun and chatty", icon: "PartyPopper" },
      { value: "family", label: "Family Night", description: "Suitable and fun for all age ranges", icon: "Home" }
    ]
  }
];
