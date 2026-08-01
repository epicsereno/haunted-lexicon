import raw from "./horror-halloween-lexicon.json";

export type LexiconSet =
  | "sinister"
  | "halloween"
  | "nightmare"
  | "sensory"
  | "setting"
  | "body"
  | "creature"
  | "object"
  | "psychological"
  | "human"
  | "occult";

export type LexiconBlock = {
  id: number;
  name: string;
  set: LexiconSet;
  words: string[];
};

export type LexiconEntry = {
  key: string;
  word: string;
  blockId: number;
  blockName: string;
  set: LexiconSet;
};

type RawLexicon = {
  title: string;
  block_count: number;
  word_count: number;
  blocks: Array<{
    id: number;
    name: string;
    set: string;
    words: string[];
  }>;
};

const data = raw as RawLexicon;

export const LEXICON_TITLE = data.title;
export const LEXICON_STATS = {
  blocks: data.block_count,
  words: data.word_count,
};

export const SET_META: Record<
  LexiconSet,
  { label: string; blurb: string; order: number }
> = {
  sinister: {
    label: "Sinister",
    blurb: "Gothic malice, omen, and dominion.",
    order: 0,
  },
  halloween: {
    label: "Halloween",
    blurb: "Seasonal chill, creatures, and cozy mischief.",
    order: 1,
  },
  nightmare: {
    label: "Nightmare",
    blurb: "Psychological dread and wrongness.",
    order: 2,
  },
  sensory: {
    label: "Sensory",
    blurb: "Sight, smell, texture, silence, voice.",
    order: 3,
  },
  setting: {
    label: "Setting",
    blurb: "Places, weather, roads, and ruins.",
    order: 4,
  },
  body: {
    label: "Body",
    blurb: "Flesh, bone, blood, and betrayal.",
    order: 5,
  },
  creature: {
    label: "Creature",
    blurb: "Swarm, beast, bird, and growth.",
    order: 6,
  },
  object: {
    label: "Object",
    blurb: "Mirrors, photos, phones, warnings.",
    order: 7,
  },
  psychological: {
    label: "Mind",
    blurb: "Dreams and unraveling.",
    order: 8,
  },
  human: {
    label: "Human",
    blurb: "Cults, children, doubles, the old.",
    order: 9,
  },
  occult: {
    label: "Occult",
    blurb: "Names, debts, curses, prophecy.",
    order: 10,
  },
};

export const BLOCKS: LexiconBlock[] = data.blocks.map((b) => ({
  id: b.id,
  name: b.name,
  set: b.set as LexiconSet,
  words: b.words,
}));

export const ALL_SETS = (
  Object.keys(SET_META) as LexiconSet[]
).sort((a, b) => SET_META[a].order - SET_META[b].order);

export const ENTRIES: LexiconEntry[] = BLOCKS.flatMap((block) =>
  block.words.map((word) => ({
    key: `${block.id}:${word}`,
    word,
    blockId: block.id,
    blockName: block.name,
    set: block.set,
  })),
);

export function displayWord(word: string): string {
  return word.replace(/-/g, " ");
}

export function getBlock(id: number): LexiconBlock | undefined {
  return BLOCKS.find((b) => b.id === id);
}

export function filterBlocks(
  query: string,
  set: LexiconSet | "all",
  favoritedKeys: Set<string>,
  favoritesOnly: boolean,
): LexiconBlock[] {
  const q = query.trim().toLowerCase();
  return BLOCKS.filter((block) => {
    if (set !== "all" && block.set !== set) return false;
    if (favoritesOnly) {
      const anyFav = block.words.some((w) =>
        favoritedKeys.has(`${block.id}:${w}`),
      );
      if (!anyFav) return false;
    }
    if (!q) return true;
    if (block.name.toLowerCase().includes(q)) return true;
    if (block.set.includes(q)) return true;
    return block.words.some((w) => w.toLowerCase().includes(q));
  });
}

export function filterEntries(
  query: string,
  set: LexiconSet | "all",
  blockId: number | "all",
  favoritedKeys: Set<string>,
  favoritesOnly: boolean,
): LexiconEntry[] {
  const q = query.trim().toLowerCase();
  return ENTRIES.filter((e) => {
    if (favoritesOnly && !favoritedKeys.has(e.key)) return false;
    if (set !== "all" && e.set !== set) return false;
    if (blockId !== "all" && e.blockId !== blockId) return false;
    if (!q) return true;
    return (
      e.word.toLowerCase().includes(q) ||
      e.blockName.toLowerCase().includes(q) ||
      e.set.includes(q) ||
      displayWord(e.word).toLowerCase().includes(q)
    );
  });
}

const TEMPLATES: Array<(w: string[]) => string> = [
  (w) =>
    `The ${w[0]} place waited — ${w[1]}, ${w[2]}, and ${w[3]}. Something ${w[4]} moved in the ${w[5]}, and the air went ${w[6]}.`,
  (w) =>
    `They found a ${w[0]} threshold: ${w[1]} walls, a ${w[2]} silence, and the ${w[3]} sense that it was already ${w[4]} — ${w[5]}, almost ${w[6]}.`,
  (w) =>
    `Night after night the ${w[0]} returned: ${w[1]} footsteps, ${w[2]} breath, a ${w[3]} figure ${w[4]} in the ${w[5]}, leaving everything ${w[6]}.`,
  (w) =>
    `In the ${w[0]} hour, the house felt ${w[1]} and ${w[2]}. A ${w[3]} sound from below, then ${w[4]} — and the door stood ${w[5]}, ${w[6]}.`,
  (w) =>
    `What began as ${w[0]} became ${w[1]}: a ${w[2]} corridor, ${w[3]} light, and a ${w[4]} presence that was ${w[5]} and finally ${w[6]}.`,
  (w) =>
    `The record ends mid-line. Witnesses spoke of a ${w[0]}, ${w[1]} place — ${w[2]}, ${w[3]}, ${w[4]} — where the last thing heard was ${w[5]}, then ${w[6]}.`,
  (w) =>
    `Cross into the ${w[0]} grounds if you must. Expect ${w[1]} air, ${w[2]} ground, ${w[3]} shapes, and a ${w[4]} feeling that you are ${w[5]} and already ${w[6]}.`,
  (w) =>
    `It was not empty. It was ${w[0]}, ${w[1]}, ${w[2]} — a ${w[3]} quiet broken only by ${w[4]}, until something ${w[5]} made the whole room go ${w[6]}.`,
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export type SummonResult = {
  text: string;
  words: string[];
  set: LexiconSet | "mixed";
  blocks: string[];
};

export function summonDescription(options: {
  set?: LexiconSet | "all";
  blockId?: number | "all";
  count?: number;
}): SummonResult {
  const count = options.count ?? 7;
  let pool: LexiconEntry[] = ENTRIES;
  if (options.blockId && options.blockId !== "all") {
    pool = pool.filter((e) => e.blockId === options.blockId);
  } else if (options.set && options.set !== "all") {
    pool = pool.filter((e) => e.set === options.set);
  }
  if (pool.length < count) pool = ENTRIES;

  const picked = shuffle(pool).slice(0, count);
  const words = picked.map((e) => displayWord(e.word));
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]!;
  const sets = new Set(picked.map((e) => e.set));
  const set: LexiconSet | "mixed" =
    sets.size === 1 ? ([...sets][0] as LexiconSet) : "mixed";

  return {
    text: template(words),
    words,
    set,
    blocks: [...new Set(picked.map((e) => e.blockName))],
  };
}

export function dominionFromBlock(block: LexiconBlock): string {
  const words = block.words.map(displayWord);
  if (words.length === 0) return "";
  if (words.length === 1) return `It was ${words[0]}.`;
  const last = words[words.length - 1]!;
  const rest = words.slice(0, -1);
  return `${block.name}: it was ${rest.join(", ")}, and ${last}.`;
}

export function randomBlock(set: LexiconSet | "all" = "all"): LexiconBlock {
  const pool = set === "all" ? BLOCKS : BLOCKS.filter((b) => b.set === set);
  return pool[Math.floor(Math.random() * pool.length)] ?? BLOCKS[0]!;
}
