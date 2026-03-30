// Business logic utilities

import { StoryProgress } from './storage';

// Compute overall accuracy % from all progress entries
export function computeAccuracy(progress: Record<string, StoryProgress>): number {
  const entries = Object.values(progress);
  if (entries.length === 0) return 0;
  const totalScore = entries.reduce((sum, p) => sum + p.score, 0);
  const totalPossible = entries.reduce((sum, p) => sum + p.total, 0);
  return totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
}

// Simple keyword-based doubt response logic
export function getDoubtResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('velocity')) return 'Velocity is speed with a specific direction. It\'s a vector quantity — 60 km/h is speed, but 60 km/h North is velocity.';
  if (q.includes('acceleration')) return 'Acceleration is how fast velocity changes over time. Speeding up, slowing down, or changing direction all count as acceleration!';
  if (q.includes('force')) return 'Force = mass × acceleration (F = ma). It is a push or pull that causes an object to accelerate. Newton\'s second law.';
  if (q.includes('inertia')) return 'Inertia is the tendency of an object to resist changes in its motion. Heavy objects have more inertia.';
  if (q.includes('energy') || q.includes('potential') || q.includes('kinetic')) return 'Energy is the capacity to do work. Potential energy is stored (e.g. height), kinetic energy is motion. They can convert into each other.';
  if (q.includes('atom')) return 'Atoms are the basic units of matter! They consist of a nucleus (protons & neutrons) with electrons orbiting around it.';
  if (q.includes('photosynthesis')) return 'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants use sunlight, water, and CO₂ to make glucose and oxygen.';
  if (q.includes('combustion')) return 'Combustion is a chemical reaction between fuel and oxygen that releases energy. Complete combustion produces CO₂ + H₂O.';
  if (q.includes('gravity') || q.includes('gravitational')) return 'Gravity is the force of attraction between masses. Near Earth\'s surface, g ≈ 9.8 m/s² downward.';
  if (q.includes('cell')) return 'Cells are the basic structural units of all living organisms. Plant cells have a cell wall and chloroplasts; animal cells do not.';
  if (q.includes('scalar') || q.includes('vector')) return 'A scalar has only magnitude (e.g. speed, mass, temperature). A vector has both magnitude and direction (e.g. velocity, force, acceleration).';
  if (q.includes('newton')) return 'Newton\'s three laws: 1) Objects resist change in motion (inertia). 2) F = ma. 3) Every action has an equal and opposite reaction.';
  return "That's a great question! It connects to the core principles we've been studying. Try highlighting the specific term in the story and clicking 'Ask Doubt' for a targeted answer!";
}

// Simplify a selected piece of text using keyword matching
export function getSimplification(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('velocity') || t.includes('speed')) return `"${text.slice(0, 60)}..." — Simply put: velocity is like speed but with a GPS direction attached. Imagine telling a friend "I'm going 60 km/h" vs "I'm going 60 km/h towards Mumbai." The second one is velocity!`;
  if (t.includes('vector') || t.includes('scalar')) return `"${text.slice(0, 60)}..." — A vector is any quantity that needs both a number AND a direction to make sense (like velocity). A scalar just needs a number (like temperature). Think: "10 degrees" makes sense alone; "10 m/s" without a direction leaves you guessing where!`;
  if (t.includes('newton') || t.includes('inertia') || t.includes('force')) return `"${text.slice(0, 60)}..." — Newton showed us that things don't just start or stop moving on their own. Something has to push or pull them. The harder you push, and the lighter the object, the faster it moves. It's just common sense, made into math!`;
  if (t.includes('combustion') || t.includes('oxygen') || t.includes('reaction')) return `"${text.slice(0, 60)}..." — Combustion is basically controlled burning. Fuel (like wax or wood) grabs oxygen from the air and the two react together, releasing the stored chemical energy as heat and light. No oxygen = no fire!`;
  if (t.includes('photosynthesis') || t.includes('chlorophyll') || t.includes('glucose')) return `"${text.slice(0, 60)}..." — Plants are food factories! They take sunlight (energy), water from the soil, and CO₂ from air, then combine them inside their leaves to make sugar (glucose) they use as food. Oxygen is released as a bonus — that's why plants are great for our air!`;
  if (t.includes('energy') || t.includes('potential') || t.includes('kinetic')) return `"${text.slice(0, 60)}..." — Energy is simply the "ability to do work." Think of a stretched rubber band — it has stored (potential) energy. When released, that energy becomes motion (kinetic energy). Energy never disappears; it just switches forms!`;
  if (t.includes('atom') || t.includes('proton') || t.includes('electron') || t.includes('neutron')) return `"${text.slice(0, 60)}..." — An atom is like a tiny solar system! The nucleus (protons + neutrons) is the sun at the center, and electrons are the planets orbiting around it. The number of protons tells you which element it is.`;
  return `"${text.slice(0, 60)}..." — In simple terms: this concept describes a fundamental relationship in nature. The key idea is that when one thing changes, it directly affects another in a predictable, measurable way. Strip away the technical terms and that's the core of it!`;
}

// Format a timestamp to a friendly relative string
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
