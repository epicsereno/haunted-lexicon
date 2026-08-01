import { useMemo, useState, useCallback, useEffect } from "react";
import {
  BookOpen,
  Copy,
  Check,
  Flame,
  Heart,
  Search,
  Shuffle,
  Skull,
  Sparkles,
  X,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  HAUNTED_WORDS,
  type HauntedWord,
  type WordCategory,
  allWordsDominionSentence,
  summonPlaceDescription,
} from "@/data/haunted-words";
import { Button, Badge, Input } from "@/components/ui-primitives";
import { cn } from "@/lib/utils";

const FAVORITES_KEY = "haunted-lexicon-favorites";

type Tab = "lexicon" | "summon" | "dominion";

export function HauntedApp() {
  const [tab, setTab] = useState<Tab>("lexicon");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WordCategory | "all">("all");
  const [selected, setSelected] = useState<HauntedWord | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [summoned, setSummoned] = useState<{ text: string; words: string[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw) as number[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persistFavorites = useCallback((next: number[]) => {
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      const next = favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      persistFavorites(next);
    },
    [favorites, persistFavorites],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HAUNTED_WORDS.filter((w) => {
      if (favoritesOnly && !favorites.includes(w.id)) return false;
      if (category !== "all" && w.category !== category) return false;
      if (!q) return true;
      return (
        w.word.includes(q) ||
        w.gloss.toLowerCase().includes(q) ||
        w.category.includes(q)
      );
    });
  }, [query, category, favoritesOnly, favorites]);

  const handleSummon = () => {
    setSummoned(summonPlaceDescription());
    setCopied(false);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const dominion = useMemo(() => allWordsDominionSentence(), []);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="fog-layer fixed inset-0 z-0" aria-hidden />
      <div className="grain fixed inset-0 z-0 opacity-40" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-8 sm:mb-14">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-[var(--color-fg-muted)]">
              <Skull className="size-5 text-[var(--color-fg)]" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-[0.22em]">
                Haunted Lexicon
              </span>
            </div>
            <Badge className="tabular-nums">100 words</Badge>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--color-fg)] text-balance">
              Words for places that should not exist
            </h1>
            <p className="mt-4 max-w-xl text-base text-[var(--color-fg-muted)] sm:text-lg">
              A living dictionary of one hundred haunted descriptors — browse them,
              favor the ones that chill you, and summon place descriptions from the full set.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-2"
            aria-label="Primary"
          >
            {(
              [
                { id: "lexicon" as const, label: "Lexicon", icon: BookOpen },
                { id: "summon" as const, label: "Summon a place", icon: Flame },
                { id: "dominion" as const, label: "All the above", icon: Sparkles },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={tab === id ? "primary" : "secondary"}
                size="md"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {label}
              </Button>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          {tab === "lexicon" && (
            <section className="animate-fade-up space-y-6" aria-labelledby="lexicon-heading">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="lexicon-heading"
                    className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
                  >
                    The lexicon
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                    {filtered.length} of {HAUNTED_WORDS.length} words
                    {favorites.length > 0 ? ` · ${favorites.length} favored` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative min-w-[min(100%,18rem)]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search words or meanings…"
                      className="pl-9"
                      aria-label="Search haunted words"
                    />
                  </div>
                  <Button
                    variant={favoritesOnly ? "primary" : "secondary"}
                    size="md"
                    onClick={() => setFavoritesOnly((v) => !v)}
                    aria-pressed={favoritesOnly}
                  >
                    <Heart
                      className={cn("size-4", favoritesOnly && "fill-current")}
                      strokeWidth={1.75}
                    />
                    Favored
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                <FilterChip
                  active={category === "all"}
                  onClick={() => setCategory("all")}
                  label="All"
                />
                {(Object.keys(CATEGORY_LABELS) as WordCategory[]).map((c) => (
                  <FilterChip
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(c)}
                    label={CATEGORY_LABELS[c]}
                  />
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-16 text-center">
                  <p className="font-display text-xl text-[var(--color-fg-muted)]">
                    Nothing answers that call.
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-fg-subtle)]">
                    Clear filters or try another search.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((word, i) => {
                    const favored = favorites.includes(word.id);
                    return (
                      <li key={word.id} style={{ animationDelay: `${Math.min(i, 12) * 20}ms` }}>
                        <button
                          type="button"
                          onClick={() => setSelected(word)}
                          className={cn(
                            "group flex w-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-left transition-[border-color,background-color,transform] duration-200 ease-out hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                            selected?.id === word.id && "border-[var(--color-border-strong)] ring-1 ring-[var(--color-border-strong)]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-xl font-medium capitalize leading-tight tracking-tight text-[var(--color-fg)]">
                                {word.word}
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                                {CATEGORY_LABELS[word.category]}
                              </p>
                            </div>
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label={favored ? "Remove from favorites" : "Add to favorites"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(word.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(word.id);
                                }
                              }}
                              className={cn(
                                "rounded-[var(--radius-xs)] p-2 text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]",
                                favored && "text-[var(--color-ember)] hover:text-[var(--color-ember)]",
                              )}
                            >
                              <Heart
                                className={cn("size-4", favored && "fill-current")}
                                strokeWidth={1.75}
                              />
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm text-[var(--color-fg-muted)]">
                            {word.gloss}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {tab === "summon" && (
            <section className="animate-fade-up space-y-6" aria-labelledby="summon-heading">
              <div className="max-w-2xl">
                <h2
                  id="summon-heading"
                  className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
                >
                  Summon a place
                </h2>
                <p className="mt-2 text-[var(--color-fg-muted)]">
                  Seven words from the lexicon are woven into a single haunted locale.
                  Summon again for a new arrangement.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" onClick={handleSummon}>
                  <Shuffle className="size-4" strokeWidth={1.75} />
                  {summoned ? "Summon another" : "Summon"}
                </Button>
                {summoned && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => copyText(summoned.text)}
                  >
                    {copied ? (
                      <Check className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Copy className="size-4" strokeWidth={1.75} />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>

              {summoned ? (
                <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
                  <p className="font-display text-xl leading-relaxed text-[var(--color-fg)] sm:text-2xl sm:leading-relaxed">
                    {summoned.text}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-5">
                    {summoned.words.map((w) => (
                      <Badge key={w} className="capitalize">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </article>
              ) : (
                <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/60 px-6 py-20 text-center">
                  <Flame className="mx-auto size-8 text-[var(--color-fg-subtle)]" strokeWidth={1.25} />
                  <p className="mt-4 font-display text-xl text-[var(--color-fg-muted)]">
                    The veil is still intact
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-fg-subtle)]">
                    Press Summon to draw a place from the lexicon.
                  </p>
                </div>
              )}
            </section>
          )}

          {tab === "dominion" && (
            <section className="animate-fade-up space-y-6" aria-labelledby="dominion-heading">
              <div className="max-w-2xl">
                <h2
                  id="dominion-heading"
                  className="font-display text-2xl font-medium tracking-tight sm:text-3xl"
                >
                  The ultimate haunted dominion
                </h2>
                <p className="mt-2 text-[var(--color-fg-muted)]">
                  All one hundred words in a single sentence — the place where every
                  haunted descriptor gathers at once.
                </p>
              </div>

              <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-10">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--color-ember-soft)] blur-3xl animate-drift"
                  aria-hidden
                />
                <p className="relative font-display text-lg leading-relaxed text-[var(--color-fg)] sm:text-xl sm:leading-relaxed">
                  {dominion}
                </p>
                <div className="relative mt-8 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => copyText(dominion)}>
                    {copied ? (
                      <Check className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Copy className="size-4" strokeWidth={1.75} />
                    )}
                    {copied ? "Copied" : "Copy the dominion"}
                  </Button>
                </div>
              </article>
            </section>
          )}
        </main>

        <footer className="mt-16 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-fg-subtle)]">
          Haunted Lexicon · one hundred words for unquiet places
        </footer>
      </div>

      {selected && (
        <WordDetail
          word={selected}
          favored={favorites.includes(selected.id)}
          onClose={() => setSelected(null)}
          onToggleFavorite={() => toggleFavorite(selected.id)}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 rounded-full border px-3.5 text-sm font-medium transition-[background-color,border-color,color] duration-150",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] bg-transparent text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
      )}
    >
      {label}
    </button>
  );
}

function WordDetail({
  word,
  favored,
  onClose,
  onToggleFavorite,
}: {
  word: HauntedWord;
  favored: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-bg)_72%,transparent)] backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-fade-up rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {CATEGORY_LABELS[word.category]} · #{word.id}
            </p>
            <h3
              id="word-detail-title"
              className="mt-1 font-display text-3xl font-medium capitalize tracking-tight"
            >
              {word.word}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-xs)] p-2 text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            aria-label="Close detail"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          {word.gloss}
        </p>
        <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-display text-lg italic leading-relaxed text-[var(--color-fg)]">
          “The {word.word} place waited — not empty, only unfinished.”
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onToggleFavorite}>
            <Heart
              className={cn("size-4", favored && "fill-current text-[var(--color-ember)]")}
              strokeWidth={1.75}
            />
            {favored ? "Favored" : "Favor"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
