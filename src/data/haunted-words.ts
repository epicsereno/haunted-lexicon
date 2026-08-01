export type WordCategory =
  | "spectral"
  | "malice"
  | "decay"
  | "structure"
  | "sound"
  | "atmosphere"
  | "fate";

export type HauntedWord = {
  id: number;
  word: string;
  category: WordCategory;
  gloss: string;
};

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  spectral: "Spectral",
  malice: "Malice",
  decay: "Decay",
  structure: "Structure",
  sound: "Sound",
  atmosphere: "Atmosphere",
  fate: "Fate",
};

export const HAUNTED_WORDS: HauntedWord[] = [
  { id: 1, word: "eerie", category: "atmosphere", gloss: "Unsettling in a way that feels almost alive." },
  { id: 2, word: "spectral", category: "spectral", gloss: "Of or like a ghost; faintly luminous, barely there." },
  { id: 3, word: "ghostly", category: "spectral", gloss: "Pale and otherworldly, as if half-remembered." },
  { id: 4, word: "haunted", category: "spectral", gloss: "Marked by restless presence; never truly empty." },
  { id: 5, word: "cursed", category: "fate", gloss: "Bound by a dark vow that outlasts the living." },
  { id: 6, word: "forsaken", category: "fate", gloss: "Abandoned without hope of return." },
  { id: 7, word: "abandoned", category: "fate", gloss: "Left behind by all who once claimed it." },
  { id: 8, word: "decrepit", category: "decay", gloss: "Worn to the edge of collapse by time alone." },
  { id: 9, word: "crepuscular", category: "atmosphere", gloss: "Of twilight; the hour when shadows lengthen." },
  { id: 10, word: "malevolent", category: "malice", gloss: "Wishing harm; cold and intentional." },
  { id: 11, word: "sinister", category: "malice", gloss: "Suggesting evil waiting just out of sight." },
  { id: 12, word: "ominous", category: "atmosphere", gloss: "Heavy with warning of what comes next." },
  { id: 13, word: "macabre", category: "malice", gloss: "Drawn to death and the grotesque." },
  { id: 14, word: "ghastly", category: "spectral", gloss: "Shocking in its pallor and dread." },
  { id: 15, word: "wraithlike", category: "spectral", gloss: "Thin as vapor; a shape without weight." },
  { id: 16, word: "phantasmal", category: "spectral", gloss: "Illusory, yet somehow solid enough to chill." },
  { id: 17, word: "shadowed", category: "atmosphere", gloss: "Wrapped in darkness that does not lift." },
  { id: 18, word: "gloomy", category: "atmosphere", gloss: "Dim and heavy with quiet despair." },
  { id: 19, word: "oppressive", category: "atmosphere", gloss: "Pressing down on breath and thought alike." },
  { id: 20, word: "chilling", category: "atmosphere", gloss: "Cold that reaches past the skin." },
  { id: 21, word: "unholy", category: "malice", gloss: "Desecrated; set against the sacred." },
  { id: 22, word: "damned", category: "fate", gloss: "Condemned beyond any plea for mercy." },
  { id: 23, word: "desolate", category: "fate", gloss: "Empty of comfort, company, or life." },
  { id: 24, word: "barren", category: "fate", gloss: "Yielding nothing; stripped of growth." },
  { id: 25, word: "rotting", category: "decay", gloss: "In open collapse of flesh or timber." },
  { id: 26, word: "moldering", category: "decay", gloss: "Slowly crumbling into dust and damp." },
  { id: 27, word: "dilapidated", category: "decay", gloss: "Fallen into ruin through long neglect." },
  { id: 28, word: "tumultuous", category: "sound", gloss: "Roaring with restless, chaotic motion." },
  { id: 29, word: "whispering", category: "sound", gloss: "Full of soft voices that may not be wind." },
  { id: 30, word: "moaning", category: "sound", gloss: "Low and continuous, like grief given form." },
  { id: 31, word: "howling", category: "sound", gloss: "Crying out through empty corridors." },
  { id: 32, word: "sighing", category: "sound", gloss: "Exhaling as if the walls themselves tire." },
  { id: 33, word: "creaking", category: "sound", gloss: "Complaining under unseen weight." },
  { id: 34, word: "groaning", category: "sound", gloss: "Deep structural complaint of old wood and stone." },
  { id: 35, word: "ethereal", category: "spectral", gloss: "Light as air; almost too fine for this world." },
  { id: 36, word: "otherworldly", category: "spectral", gloss: "Belonging to a place beside our own." },
  { id: 37, word: "demonic", category: "malice", gloss: "Marked by infernal will." },
  { id: 38, word: "possessed", category: "malice", gloss: "Occupied by something that is not its owner." },
  { id: 39, word: "tormented", category: "fate", gloss: "Endlessly afflicted; never at rest." },
  { id: 40, word: "anguished", category: "fate", gloss: "Twisted by pain that has nowhere to go." },
  { id: 41, word: "bleak", category: "atmosphere", gloss: "Cold, bare, and without comfort." },
  { id: 42, word: "forlorn", category: "fate", gloss: "Pitifully alone and unlikely to be found." },
  { id: 43, word: "melancholic", category: "atmosphere", gloss: "Sunk in a quiet, lasting sadness." },
  { id: 44, word: "dreadful", category: "malice", gloss: "Inspiring fear that settles in the bones." },
  { id: 45, word: "terrifying", category: "malice", gloss: "Capable of pure, unreasoning panic." },
  { id: 46, word: "nightmarish", category: "malice", gloss: "As if dream-logic has replaced the real." },
  { id: 47, word: "labyrinthine", category: "structure", gloss: "Maze-like; easy to enter, hard to leave." },
  { id: 48, word: "maze-like", category: "structure", gloss: "Full of turns designed to confuse." },
  { id: 49, word: "claustrophobic", category: "structure", gloss: "Too close; air and space both scarce." },
  { id: 50, word: "cavernous", category: "structure", gloss: "Vast and hollow, swallowing sound." },
  { id: 51, word: "sepulchral", category: "structure", gloss: "Of the tomb; solemn and deathly still." },
  { id: 52, word: "tomb-like", category: "structure", gloss: "Enclosed as if for the forever-sleeping." },
  { id: 53, word: "cryptic", category: "structure", gloss: "Obscure; written in a language of secrets." },
  { id: 54, word: "funereal", category: "atmosphere", gloss: "Dressed for mourning; slow and grave." },
  { id: 55, word: "morbid", category: "malice", gloss: "Fixated on death and what follows it." },
  { id: 56, word: "grisly", category: "malice", gloss: "Horribly vivid; hard to look away from." },
  { id: 57, word: "gruesome", category: "malice", gloss: "Shocking in its violence or decay." },
  { id: 58, word: "bloodstained", category: "decay", gloss: "Marked by old violence that never washed clean." },
  { id: 59, word: "rancid", category: "decay", gloss: "Spoiled to the point of offense." },
  { id: 60, word: "fetid", category: "decay", gloss: "Rank with the smell of standing rot." },
  { id: 61, word: "dank", category: "decay", gloss: "Cold, wet, and unpleasantly close." },
  { id: 62, word: "musty", category: "decay", gloss: "Stale with closed air and old paper." },
  { id: 63, word: "cobwebbed", category: "decay", gloss: "Draped in silver threads no one has disturbed." },
  { id: 64, word: "dust-choked", category: "decay", gloss: "Filled with powder that once was something else." },
  { id: 65, word: "ruinous", category: "decay", gloss: "Fallen into pieces that no longer hold." },
  { id: 66, word: "collapsing", category: "structure", gloss: "In the act of giving way, now or soon." },
  { id: 67, word: "overgrown", category: "decay", gloss: "Reclaimed by vines that do not care who built it." },
  { id: 68, word: "entangled", category: "structure", gloss: "Caught in a snarl of roots, wire, or fate." },
  { id: 69, word: "thorny", category: "structure", gloss: "Armed with spines that punish approach." },
  { id: 70, word: "barbed", category: "structure", gloss: "Hooked to hold whatever tries to leave." },
  { id: 71, word: "veiled", category: "atmosphere", gloss: "Half-hidden behind a thin curtain of mist." },
  { id: 72, word: "shrouded", category: "atmosphere", gloss: "Wrapped as if prepared for burial." },
  { id: 73, word: "enshrouded", category: "atmosphere", gloss: "Completely enclosed in a burial cloth of fog." },
  { id: 74, word: "misty", category: "atmosphere", gloss: "Softened and blurred by floating vapor." },
  { id: 75, word: "fogbound", category: "atmosphere", gloss: "Held captive by a bank of white that will not lift." },
  { id: 76, word: "murky", category: "atmosphere", gloss: "Cloudy and hard to see through, even up close." },
  { id: 77, word: "stygian", category: "atmosphere", gloss: "Dark as the river that borders the dead." },
  { id: 78, word: "infernal", category: "malice", gloss: "Of the underworld; heat without light." },
  { id: 79, word: "diabolical", category: "malice", gloss: "Crafted with devilish intent." },
  { id: 80, word: "nefarious", category: "malice", gloss: "Wicked in a deliberate, scheming way." },
  { id: 81, word: "wicked", category: "malice", gloss: "Morally dark; ready to do harm." },
  { id: 82, word: "malefic", category: "malice", gloss: "Actively producing evil effects." },
  { id: 83, word: "baleful", category: "malice", gloss: "Threatening harm with a single look." },
  { id: 84, word: "pernicious", category: "malice", gloss: "Destructive in a gradual, hard-to-see way." },
  { id: 85, word: "menacing", category: "malice", gloss: "Standing ready to strike." },
  { id: 86, word: "threatening", category: "malice", gloss: "Promising violence if you stay." },
  { id: 87, word: "lurking", category: "spectral", gloss: "Hidden nearby, waiting for the right moment." },
  { id: 88, word: "stalking", category: "spectral", gloss: "Following with quiet, patient purpose." },
  { id: 89, word: "watching", category: "spectral", gloss: "Aware of you before you are of it." },
  { id: 90, word: "unseen", category: "spectral", gloss: "Present but never quite caught by the eye." },
  { id: 91, word: "invisible", category: "spectral", gloss: "Without form the living can hold." },
  { id: 92, word: "poltergeist-haunted", category: "spectral", gloss: "Troubled by a spirit that throws and breaks." },
  { id: 93, word: "revenant-filled", category: "spectral", gloss: "Crowded with those who returned from death." },
  { id: 94, word: "apparition-ridden", category: "spectral", gloss: "Plagued by sudden, silent appearances." },
  { id: 95, word: "echoing", category: "sound", gloss: "Repeating every footstep as if the stone remembers." },
  { id: 96, word: "resonant", category: "sound", gloss: "Deep-voiced; every sound rings longer than it should." },
  { id: 97, word: "hollow", category: "structure", gloss: "Empty inside; a shell of what it was." },
  { id: 98, word: "vacant", category: "fate", gloss: "Unoccupied — or so it seems." },
  { id: 99, word: "soulless", category: "fate", gloss: "Stripped of whatever once made it human." },
  { id: 100, word: "eternal", category: "fate", gloss: "Without end — and without exit." },
];

export const PLACE_TEMPLATES = [
  (words: string[]) =>
    `Beyond the last working streetlamp stands a ${words[0]} house — ${words[1]}, ${words[2]}, and ${words[3]}. Its halls are ${words[4]}, its air ${words[5]}, and every doorway feels ${words[6]}.`,
  (words: string[]) =>
    `They call it the ${words[0]} wing: a ${words[1]}, ${words[2]} corridor of ${words[3]} stone where the walls are ${words[4]} and the silence is never truly ${words[5]}.`,
  (words: string[]) =>
    `On the fogbound edge of the map lies a ${words[0]} manor, ${words[1]} and ${words[2]}, its gardens ${words[3]}, its windows ${words[4]}, its foundation ${words[5]} with secrets that will not die.`,
  (words: string[]) =>
    `Enter if you must: a ${words[0]}, ${words[1]} chapel whose pews are ${words[2]}, whose organ is ${words[3]}, and whose crypt remains ${words[4]} and ${words[5]}.`,
  (words: string[]) =>
    `The ${words[0]} asylum never closed. Its wards are ${words[1]}, its stairwells ${words[2]}, and the night shift reports rooms that are ${words[3]}, ${words[4]}, and quietly ${words[5]}.`,
  (words: string[]) =>
    `A ${words[0]} lighthouse on a ${words[1]} cliff — ${words[2]} glass, ${words[3]} stairs, and a keeper’s log that ends mid-sentence in a hand that looks ${words[4]} and ${words[5]}.`,
  (words: string[]) =>
    `Deep in the ${words[0]} woods the path becomes ${words[1]} and ${words[2]}, leading to a ${words[3]} cabin that is ${words[4]} by day and ${words[5]} by night.`,
  (words: string[]) =>
    `Under the city: a ${words[0]} tunnel system, ${words[1]} and ${words[2]}, where the walls are ${words[3]} and every distant drip sounds ${words[4]} — almost ${words[5]}.`,
];

export function pickRandomWords(count: number, exclude: Set<string> = new Set()): string[] {
  const pool = HAUNTED_WORDS.map((w) => w.word).filter((w) => !exclude.has(w));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function summonPlaceDescription(): { text: string; words: string[] } {
  const words = pickRandomWords(7);
  const template = PLACE_TEMPLATES[Math.floor(Math.random() * PLACE_TEMPLATES.length)]!;
  return { text: template(words), words };
}

export function allWordsDominionSentence(): string {
  const list = HAUNTED_WORDS.map((w) => w.word);
  const last = list.pop()!;
  return `It was ${list.join(", ")}, and ${last}.`;
}
