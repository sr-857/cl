export interface YouTubeLink {
  title: string;
  searchQuery: string;  // used to generate YouTube search URL
  videoId?: string;     // optional real video ID for direct embed
}

export interface Story {
  id: number;
  title: string;
  subject: string;
  readTime: string;
  story: string;
  concept: string;
  keyPoints: string[];
  questions: { q: string; a: string }[];
  quiz: { question: string; options: string[]; answer: number }[];
  youtubeLinks: YouTubeLink[];
}

export const stories: Story[] = [
  {
    id: 1,
    title: "The Car Race and Velocity",
    subject: "Physics",
    readTime: "8 min",
    story: "Two cars lined up at the starting line. Car A roared forward at 60 km/h heading north. Car B moved at 60 km/h heading east. Both had the same speed — but were they moving the same way? Not at all! This is the essence of velocity: it's not just how fast you move, but in which direction.",
    concept: "Velocity is a vector quantity that describes both the speed and direction of motion. Unlike speed (a scalar), velocity requires both magnitude and direction to be fully described. Two objects can have equal speeds but completely different velocities if they move in different directions.",
    keyPoints: [
      "Velocity = Speed + Direction",
      "Velocity is a vector quantity; speed is a scalar",
      "Same speed ≠ same velocity",
      "Velocity can change even if speed stays constant (if direction changes)",
      "Unit of velocity: m/s or km/h with a direction"
    ],
    questions: [
      { q: "Can two objects have the same speed but different velocities?", a: "Yes! If they move in different directions, their velocities differ even if speeds are equal." },
      { q: "Is velocity a scalar or vector quantity?", a: "Velocity is a vector quantity — it has both magnitude (speed) and direction." },
      { q: "What happens to velocity when only direction changes?", a: "The velocity changes even if speed stays constant, because velocity includes direction." }
    ],
    quiz: [
      { question: "Velocity is different from speed because velocity includes:", options: ["Mass", "Direction", "Time", "Weight"], answer: 1 },
      { question: "A car going 60 km/h north has the same velocity as a car going:", options: ["60 km/h east", "60 km/h north", "60 km/h south", "60 km/h west"], answer: 1 },
      { question: "Which is a vector quantity?", options: ["Speed", "Distance", "Velocity", "Temperature"], answer: 2 }
    ],
    youtubeLinks: [
      { title: "Velocity vs Speed Explained", searchQuery: "velocity vs speed physics vector scalar explained" },
      { title: "Intro to Vectors & Scalars", searchQuery: "introduction vectors scalars physics khan academy" }
    ]
  },
  {
    id: 2,
    title: "The Bouncing Ball and Newton's Laws",
    subject: "Physics",
    readTime: "10 min",
    story: "A basketball player bounces the ball on the court. With every bounce, the ball hits the floor and comes back up. Newton watched an apple fall and realized something profound — every action has an equal and opposite reaction. The floor pushes the ball back just as hard as the ball pushes the floor.",
    concept: "Newton's Three Laws of Motion govern how objects move. The First Law (inertia) says objects stay at rest or in motion unless acted on by an external force. The Second Law relates force, mass, and acceleration (F=ma). The Third Law states every action has an equal and opposite reaction.",
    keyPoints: [
      "First Law: An object at rest stays at rest unless acted upon by a force",
      "Second Law: F = ma (Force equals mass times acceleration)",
      "Third Law: Every action has an equal and opposite reaction",
      "Inertia is the resistance to change in motion",
      "The greater the mass, the greater the force needed to accelerate"
    ],
    questions: [
      { q: "What does Newton's First Law describe?", a: "Inertia — objects resist changes in their state of motion." },
      { q: "Write Newton's Second Law as a formula.", a: "F = ma, where F is force, m is mass, and a is acceleration." },
      { q: "Give an example of Newton's Third Law.", a: "When you push off a wall, the wall pushes back equally — rocket engines are another example." }
    ],
    quiz: [
      { question: "F = ma represents Newton's:", options: ["First Law", "Second Law", "Third Law", "Fourth Law"], answer: 1 },
      { question: "Inertia is described by Newton's:", options: ["First Law", "Second Law", "Third Law", "Law of Gravity"], answer: 0 },
      { question: "A rocket propels forward because of:", options: ["First Law", "Second Law", "Third Law", "Gravity"], answer: 2 }
    ],
    youtubeLinks: [
      { title: "Newton's Three Laws of Motion", searchQuery: "Newton three laws of motion physics explained" },
      { title: "Inertia and F=ma Explained", searchQuery: "Newton second law F=ma inertia explained simply" }
    ]
  },
  {
    id: 3,
    title: "The Burning Candle and Combustion",
    subject: "Chemistry",
    readTime: "7 min",
    story: "Light a candle. Watch it burn. The wax melts, the wick glows, and a warm flame dances. But what is actually happening? The wax (a hydrocarbon) reacts with oxygen in the air. This chemical reaction releases energy as heat and light, producing carbon dioxide and water as byproducts.",
    concept: "Combustion is a chemical reaction between a fuel and oxygen that releases energy in the form of heat and light. Complete combustion produces carbon dioxide and water. Incomplete combustion occurs when oxygen is limited, producing carbon monoxide and soot.",
    keyPoints: [
      "Combustion requires fuel, oxygen, and heat (the fire triangle)",
      "Complete combustion: fuel + O2 → CO2 + H2O + energy",
      "Incomplete combustion produces CO (carbon monoxide) and soot",
      "Hydrocarbons are common fuels (wax, petrol, wood)",
      "Exothermic reaction: releases more energy than it absorbs"
    ],
    questions: [
      { q: "What are the three elements required for combustion?", a: "Fuel, oxygen, and heat — together they form the 'fire triangle'." },
      { q: "What is produced in complete combustion?", a: "Carbon dioxide (CO2) and water (H2O), along with heat and light energy." },
      { q: "Why is incomplete combustion dangerous?", a: "It produces carbon monoxide (CO), a colorless and odorless poisonous gas." }
    ],
    quiz: [
      { question: "What does complete combustion produce?", options: ["CO and soot", "CO2 and H2O", "Only heat", "Oxygen"], answer: 1 },
      { question: "The fire triangle includes fuel, oxygen, and:", options: ["Water", "Heat", "Carbon", "Light"], answer: 1 },
      { question: "Combustion is an example of:", options: ["Endothermic reaction", "Exothermic reaction", "Neutralization", "Decomposition"], answer: 1 }
    ],
    youtubeLinks: [
      { title: "Combustion Reactions Explained", searchQuery: "combustion reaction chemistry complete incomplete explained" },
      { title: "The Fire Triangle", searchQuery: "fire triangle combustion chemistry fuel oxygen heat" }
    ]
  },
  {
    id: 4,
    title: "The Garden and Photosynthesis",
    subject: "Biology",
    readTime: "9 min",
    story: "Every morning, the leaves of a garden turn toward the sun. They are not just soaking up warmth — they are factories, converting sunlight into food. Chlorophyll in the leaves captures light energy, and using water from roots and carbon dioxide from air, the plant manufactures glucose.",
    concept: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. This occurs in chloroplasts, specifically using chlorophyll as the light-absorbing pigment.",
    keyPoints: [
      "Photosynthesis equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2",
      "Occurs in chloroplasts within plant cells",
      "Chlorophyll is the green pigment that absorbs light",
      "Products: glucose (food) and oxygen (released into air)",
      "Reactants: carbon dioxide and water"
    ],
    questions: [
      { q: "Where does photosynthesis take place in a plant cell?", a: "In the chloroplasts, which contain the green pigment chlorophyll." },
      { q: "Write the equation for photosynthesis.", a: "6CO2 + 6H2O + light energy → C6H12O6 + 6O2" },
      { q: "What is the role of chlorophyll?", a: "Chlorophyll absorbs light energy (particularly red and blue light) to power photosynthesis." }
    ],
    quiz: [
      { question: "Photosynthesis occurs in:", options: ["Mitochondria", "Nucleus", "Chloroplasts", "Ribosomes"], answer: 2 },
      { question: "Oxygen in photosynthesis is produced from:", options: ["CO2", "Water", "Glucose", "Sunlight"], answer: 1 },
      { question: "Chlorophyll is:", options: ["A product of photosynthesis", "A light-absorbing pigment", "A type of sugar", "An enzyme"], answer: 1 }
    ],
    youtubeLinks: [
      { title: "Photosynthesis — Biology Explained", searchQuery: "photosynthesis biology explained chlorophyll chloroplast" },
      { title: "How Plants Make Food", searchQuery: "how plants make food photosynthesis simple" }
    ]
  },
  {
    id: 5,
    title: "The Roller Coaster and Potential Energy",
    subject: "Physics",
    readTime: "8 min",
    story: "At the top of a roller coaster, before the car plunges down, there is a moment of suspense. The car is stationary. Yet it holds enormous energy — stored, waiting. As it descends, this stored potential energy converts into kinetic energy, propelling riders faster and faster.",
    concept: "Energy exists in many forms. Potential energy is stored energy based on position (gravitational PE = mgh). Kinetic energy is energy of motion (KE = ½mv²). The Law of Conservation of Energy states that energy cannot be created or destroyed, only converted from one form to another.",
    keyPoints: [
      "Potential Energy (PE) = mgh (mass × gravity × height)",
      "Kinetic Energy (KE) = ½mv² (half × mass × velocity squared)",
      "Energy is conserved: PE + KE = constant (ignoring friction)",
      "Higher position = more potential energy",
      "Faster speed = more kinetic energy"
    ],
    questions: [
      { q: "What is the formula for gravitational potential energy?", a: "PE = mgh, where m = mass, g = gravitational acceleration (9.8 m/s²), h = height." },
      { q: "What happens to potential energy as a roller coaster descends?", a: "Potential energy converts into kinetic energy — the car speeds up as it loses height." },
      { q: "State the law of conservation of energy.", a: "Energy cannot be created or destroyed, only transformed from one form to another." }
    ],
    quiz: [
      { question: "PE = mgh. What does 'h' represent?", options: ["Heat", "Height", "Horizontal distance", "Humidity"], answer: 1 },
      { question: "At the bottom of a roller coaster, energy is mostly:", options: ["Potential", "Chemical", "Kinetic", "Nuclear"], answer: 2 },
      { question: "The Law of Conservation of Energy says energy is:", options: ["Created by motion", "Destroyed by friction", "Neither created nor destroyed", "Always kinetic"], answer: 2 }
    ],
    youtubeLinks: [
      { title: "Potential & Kinetic Energy Explained", searchQuery: "potential kinetic energy conservation physics explained" },
      { title: "Roller Coaster Physics", searchQuery: "roller coaster physics energy conservation" }
    ]
  },
  {
    id: 6,
    title: "The Periodic Table and Atomic Structure",
    subject: "Chemistry",
    readTime: "11 min",
    story: "Dmitri Mendeleev arranged known elements in order of atomic mass and noticed patterns repeating. Today we have 118 elements arranged by atomic number. Each element is unique because of its atoms — tiny structures with a nucleus of protons and neutrons, surrounded by orbiting electrons.",
    concept: "An atom consists of protons (positive charge) and neutrons (no charge) in the nucleus, surrounded by electrons (negative charge) in shells. Atomic number = number of protons. Mass number = protons + neutrons. Elements in the same group have similar chemical properties because they have the same number of valence electrons.",
    keyPoints: [
      "Atomic number = number of protons (defines the element)",
      "Mass number = protons + neutrons",
      "Electrons orbit in shells (energy levels): 2, 8, 8...",
      "Valence electrons determine chemical behavior",
      "Elements in same group have same valence electrons"
    ],
    questions: [
      { q: "What determines which element an atom belongs to?", a: "The number of protons (atomic number) determines the element." },
      { q: "How do you calculate mass number?", a: "Mass number = number of protons + number of neutrons." },
      { q: "Why do elements in the same group behave similarly?", a: "They have the same number of valence electrons, which determines chemical reactivity." }
    ],
    quiz: [
      { question: "The atomic number equals the number of:", options: ["Neutrons", "Electrons", "Protons", "Isotopes"], answer: 2 },
      { question: "Mass number = protons + :", options: ["Electrons", "Neutrons", "Protons", "Quarks"], answer: 1 },
      { question: "Valence electrons are found in the:", options: ["Nucleus", "Inner shells", "Outermost shell", "Proton layer"], answer: 2 }
    ],
    youtubeLinks: [
      { title: "Atomic Structure and the Periodic Table", searchQuery: "atomic structure periodic table protons neutrons electrons" },
      { title: "Valence Electrons Explained", searchQuery: "valence electrons explained chemistry" }
    ]
  },
  {
    id: 7,
    title: "The DNA Blueprint and Genetics",
    subject: "Biology",
    readTime: "10 min",
    story: "Every living thing carries a blueprint written in a molecule called DNA. Inside the nucleus of almost every cell, billions of base pairs are coiled into 46 chromosomes — your personal instruction manual. When cells divide, this code is copied with extraordinary precision, passing life's instructions to the next generation.",
    concept: "DNA (Deoxyribonucleic Acid) is the molecule that carries the genetic information of all living organisms. It has a double-helix structure made of nucleotides — each with a sugar, phosphate, and one of four bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). A pairs with T, and G pairs with C.",
    keyPoints: [
      "DNA is a double helix made of two complementary strands",
      "Four bases: Adenine (A), Thymine (T), Guanine (G), Cytosine (C)",
      "Base pairing rules: A-T and G-C",
      "Genes are segments of DNA that code for specific proteins",
      "Humans have approximately 3 billion base pairs in their genome"
    ],
    questions: [
      { q: "What is the structure of DNA?", a: "DNA has a double-helix structure made of two complementary strands wound around each other." },
      { q: "What are the four bases in DNA and how do they pair?", a: "Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C)." },
      { q: "What is a gene?", a: "A gene is a segment of DNA that contains the instructions for making a specific protein." }
    ],
    quiz: [
      { question: "Which bases are complementary in DNA?", options: ["A-G and T-C", "A-T and G-C", "A-C and G-T", "A-A and T-T"], answer: 1 },
      { question: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Nucleotide Arrangement", "Double Nucleic Acid"], answer: 0 },
      { question: "How many chromosomes do human cells typically contain?", options: ["23", "46", "92", "48"], answer: 1 }
    ],
    youtubeLinks: [
      { title: "DNA Structure and Function", searchQuery: "DNA structure double helix genetics biology explained" },
      { title: "What is a Gene?", searchQuery: "what is a gene DNA genetics biology" }
    ]
  },
  {
    id: 8,
    title: "The Bridge and Probability",
    subject: "Mathematics",
    readTime: "9 min",
    story: "An engineer designs a bridge and wants to know: what are the chances it will experience extreme wind on any given day? A weather analyst rolls two dice and tracks the sums. Whether it's dice, weather, or disease — probability is the language nature uses to describe uncertainty, and mathematicians have learned to read it fluently.",
    concept: "Probability is a measure of how likely an event is to occur, expressed as a number between 0 (impossible) and 1 (certain). The probability of an event A is: P(A) = Number of favorable outcomes / Total number of outcomes. For independent events, P(A and B) = P(A) × P(B).",
    keyPoints: [
      "Probability ranges from 0 (impossible) to 1 (certain)",
      "P(event) = Favorable outcomes / Total outcomes",
      "Complementary rule: P(not A) = 1 − P(A)",
      "Independent events: P(A and B) = P(A) × P(B)",
      "Mutually exclusive events: P(A or B) = P(A) + P(B)"
    ],
    questions: [
      { q: "What is the probability of rolling a 6 on a fair die?", a: "P(6) = 1/6 ≈ 0.167, since there is 1 favorable outcome out of 6 total." },
      { q: "What does 'mutually exclusive' mean?", a: "Two events are mutually exclusive if they cannot both occur at the same time. For example, a coin cannot be both heads and tails." },
      { q: "What is the probability of getting heads twice in a row?", a: "P(HH) = P(H) × P(H) = 0.5 × 0.5 = 0.25 (since flips are independent)." }
    ],
    quiz: [
      { question: "A bag has 3 red and 7 blue balls. What is P(red)?", options: ["0.3", "0.7", "3/7", "0.5"], answer: 0 },
      { question: "If P(A) = 0.4, what is P(not A)?", options: ["0.4", "0.6", "1.4", "0.04"], answer: 1 },
      { question: "For two independent events A and B, P(A and B) = ?", options: ["P(A) + P(B)", "P(A) − P(B)", "P(A) × P(B)", "P(A) / P(B)"], answer: 2 }
    ],
    youtubeLinks: [
      { title: "Probability Basics Explained", searchQuery: "probability basics math explained simple" },
      { title: "Independent vs Mutually Exclusive Events", searchQuery: "independent mutually exclusive events probability math" }
    ]
  }
];

export const mockStudentData = {
  name: "Rahul",
  accuracy: 72,
  completed: 10,
  weakTopics: ["Thermodynamics", "Organic Chemistry", "Optics"],
  weeklyPerformance: [
    { day: "Mon", score: 65 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 68 },
    { day: "Thu", score: 75 },
    { day: "Fri", score: 72 },
    { day: "Sat", score: 80 },
    { day: "Sun", score: 78 }
  ]
};

export const mockTeacherData = {
  totalStudents: 50,
  avgScore: 68,
  atRiskCount: 12,
  weeklyPerformance: [
    { week: "Week 1", avgScore: 62 },
    { week: "Week 2", avgScore: 65 },
    { week: "Week 3", avgScore: 68 },
    { week: "Week 4", avgScore: 71 },
    { week: "Week 5", avgScore: 68 }
  ],
  students: [
    { name: "Rahul Sharma",    score: 85, status: "good"    },
    { name: "Priya Patel",     score: 72, status: "good"    },
    { name: "Amit Kumar",      score: 45, status: "at-risk" },
    { name: "Sneha Roy",       score: 38, status: "at-risk" },
    { name: "Raj Verma",       score: 91, status: "good"    },
    { name: "Anita Desai",     score: 55, status: "average" },
    { name: "Vikram Singh",    score: 42, status: "at-risk" },
    { name: "Meera Joshi",     score: 78, status: "good"    },
    { name: "Karan Malhotra",  score: 33, status: "at-risk" },
    { name: "Divya Nair",      score: 67, status: "average" }
  ]
};
