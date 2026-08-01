import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Dice5,
  Flame,
  Heart,
  Layers,
  Search,
  Shuffle,
  Skull,
  Sparkles,
  X,
} from "lucide-react";
import {
  ALL_SETS,
  BLOCKS,
  ENTRIES,
  LEXICON_STATS,
  LEXICON_TITLE,
  SET_META,
  type LexiconBlock,
  type LexiconEntry,
  type LexiconSet,
  type SummonResult,
  displayWord,
  dominionFromBlock,
  filterBlocks,
  filterEntries,
  randomBlock,
  summonDescription,
} from "@/data/lexicon";
import { Button, Badge, Input } from "@/components/ui-primitives";
import { cn } from "@/lib/utils";

const FAV_KEY = "haunted-lexicon-fav-v2";
const HISTORY_KEY = "haunted-lexicon-summon-history";

type Tab = "blocks" | "words" | "summon" | "ritual";

export function HauntedApp() {
  const [tab, setTab] = useState<Tab>("blocks");
  const [query, setQuery] = useState("");
  const [setFilter, setSetFilter] = useState<LexiconSet | "all">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<LexiconBlock | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<LexiconEntry | null>(null);
  const [summonSet, setSummonSet] = useState<LexiconSet | "all">("all");
  const [summoned, setSummoned] = useState<SummonResult | null>(null);
  const [history, setHistory] = useState<SummonResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [ritualBlock, setRitualBlock] = useState<LexiconBlock>(() => BLOCKS[0]!);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const fav = localStorage.getItem(FAV_KEY);
      if (fav) setFavorites(JSON.parse(fav) as string[]);
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist) as SummonResult[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT"))
          return;
        e.preventDefault();
        setTab((prev) => (prev === "summon" || prev === "ritual" ? "blocks" : prev));
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const persistFav = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFav = useCallback(
    (key: string) => {
      const next = favSet.has(key)
        ? favorites.filter((k) => k !== key)
        : [...favorites, key];
      persistFav(next);
    },
    [favorites, favSet, persistFav],
  );

  const filteredBlocks = useMemo(
    () => filterBlocks(query, setFilter, favSet, favoritesOnly),
    [query, setFilter, favSet, favoritesOnly],
  );

  const filteredEntries = useMemo(
    () => filterEntries(query, setFilter, "all", favSet, favoritesOnly),
    [query, setFilter, favSet, favoritesOnly],
  );

  const setCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BLOCKS.length };
    for (const s of ALL_SETS) {
      counts[s] = BLOCKS.filter((b) => b.set === s).length;
    }
    return counts;
  }, []);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  const handleSummon = () => {
    const result = summonDescription({ set: summonSet, count: 7 });
    setSummoned(result);
    setCopied(false);
    const next = [result, ...history].slice(0, 8);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const openRandomBlock = () => {
    const b = randomBlock(setFilter);
    setSelectedBlock(b);
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="fog-layer fixed inset-0 z-0" aria-hidden />
      <div className="grain fixed inset-0 z-0 opacity-40" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-6 sm:mb-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-[var(--color-fg-muted)]">
              <Skull className="size-5 text-[var(--color-fg)]" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-[0.22em]">
                {LEXICON_TITLE}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge className="tabular-nums">{LEXICON_STATS.blocks} blocks</Badge>
              <Badge className="tabular-nums">~{LEXICON_STATS.words} words</Badge>
              {favorites.length > 0 && (
                <Badge className="tabular-nums text-[var(--color-ember)]">
                  {favorites.length} favored
                </Badge>
              )}
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              A vault of unquiet language
            </h1>
            <p className="mt-3 max-w-xl text-[var(--color-fg-muted)] sm:text-lg">
              One hundred one themed blocks across eleven moods — from gothic
              malice to hospital night shifts. Browse, favor, and summon places
              that should stay closed.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Primary">
            {(
              [
                { id: "blocks" as const, label: "Blocks", icon: Layers },
                { id: "words" as const, label: "All words", icon: BookOpen },
                { id: "summon" as const, label: "Summoner", icon: Flame },
                { id: "ritual" as const, label: "Ritual", icon: Sparkles },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]",
                  tab === id
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </header>

        {(tab === "blocks" || tab === "words") && (
          <div className="mb-5 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                <Input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search blocks or words…  (press /)"
                  className="pl-9 pr-10"
                  aria-label="Search lexicon"
                />
                {query && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={favoritesOnly ? "primary" : "secondary"}
                  onClick={() => setFavoritesOnly((v) => !v)}
                  aria-pressed={favoritesOnly}
                >
                  <Heart
                    className={cn("size-4", favoritesOnly && "fill-current")}
                    strokeWidth={1.75}
                  />
                  Favored
                </Button>
                {tab === "blocks" && (
                  <Button variant="secondary" onClick={openRandomBlock}>
                    <Dice5 className="size-4" strokeWidth={1.75} />
                    Random
                  </Button>
                )}
              </div>
            </div>

            <div
              className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter by set"
            >
              <SetChip
                active={setFilter === "all"}
                onClick={() => setSetFilter("all")}
                label="All sets"
                count={setCounts.all}
              />
              {ALL_SETS.map((s) => (
                <SetChip
                  key={s}
                  active={setFilter === s}
                  onClick={() => setSetFilter(s)}
                  label={SET_META[s].label}
                  count={setCounts[s] ?? 0}
                />
              ))}
            </div>
          </div>
        )}

        <main className="flex-1">
          {tab === "blocks" && (
            <section className="animate-fade-up space-y-4" aria-label="Blocks">
              <p className="text-sm text-[var(--color-fg-subtle)]">
                {filteredBlocks.length} block
                {filteredBlocks.length === 1 ? "" : "s"}
                {setFilter !== "all" ? ` · ${SET_META[setFilter].blurb}` : ""}
              </p>
              {filteredBlocks.length === 0 ? (
                <EmptyState title="No blocks answer." hint="Clear filters or try another search." />
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBlocks.map((block) => {
                    const favCount = block.words.filter((w) =>
                      favSet.has(`${block.id}:${w}`),
                    ).length;
                    return (
                      <li key={block.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedBlock(block)}
                          className="group flex h-full w-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-left transition-[border-color,background-color] duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                                {SET_META[block.set].label}
                              </p>
                              <h2 className="mt-1 font-display text-xl font-medium leading-tight tracking-tight">
                                {block.name}
                              </h2>
                            </div>
                            <ChevronRight className="mt-1 size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-0.5" />
                          </div>
                          <p className="line-clamp-2 text-sm text-[var(--color-fg-muted)]">
                            {block.words
                              .slice(0, 5)
                              .map(displayWord)
                              .join(" · ")}
                            {block.words.length > 5 ? "…" : ""}
                          </p>
                          <div className="mt-auto flex items-center justify-between text-xs text-[var(--color-fg-subtle)]">
                            <span className="tabular-nums">
                              {block.words.length} words
                            </span>
                            {favCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[var(--color-ember)]">
                                <Heart className="size-3 fill-current" />
                                {favCount}
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {tab === "words" && (
            <section className="animate-fade-up space-y-4" aria-label="Words">
              <p className="text-sm text-[var(--color-fg-subtle)]">
                {filteredEntries.length.toLocaleString()} word
                {filteredEntries.length === 1 ? "" : "s"}
                {filteredEntries.length > 240
                  ? " · showing first 240 — refine search"
                  : ""}
              </p>
              {filteredEntries.length === 0 ? (
                <EmptyState title="Silence." hint="Nothing matches that call." />
              ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEntries.slice(0, 240).map((entry) => {
                    const favored = favSet.has(entry.key);
                    return (
                      <li key={entry.key}>
                        <button
                          type="button"
                          onClick={() => setSelectedEntry(entry)}
                          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-3 text-left transition-[border-color,background-color] duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-lg font-medium capitalize leading-tight">
                              {displayWord(entry.word)}
                            </p>
                            <p className="truncate text-xs text-[var(--color-fg-subtle)]">
                              {entry.blockName} · {SET_META[entry.set].label}
                            </p>
                          </div>
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label={favored ? "Unfavor" : "Favor"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFav(entry.key);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFav(entry.key);
                              }
                            }}
                            className={cn(
                              "rounded p-2 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]",
                              favored && "text-[var(--color-ember)]",
                            )}
                          >
                            <Heart
                              className={cn("size-4", favored && "fill-current")}
                              strokeWidth={1.75}
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {tab === "summon" && (
            <section className="animate-fade-up space-y-6" aria-label="Summon a place">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                  Summon a place
                </h2>
                <p className="mt-2 text-[var(--color-fg-muted)]">
                  Draw seven words from the vault and weave them into a single
                  haunted locale. Narrow by set for a tighter mood.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="flex min-w-[12rem] flex-1 flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  Mood set
                  <select
                    value={summonSet}
                    onChange={(e) =>
                      setSummonSet(e.target.value as LexiconSet | "all")
                    }
                    className="h-11 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-sm font-normal normal-case tracking-normal text-[var(--color-fg)] outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
                  >
                    <option value="all">All sets (mixed)</option>
                    {ALL_SETS.map((s) => (
                      <option key={s} value={s}>
                        {SET_META[s].label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-2 sm:pt-5">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSummon}
                    aria-label="Draw summon words"
                  >
                    <Shuffle className="size-4" strokeWidth={1.75} />
                    {summoned ? "Draw again" : "Draw words"}
                  </Button>
                  {summoned && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => copyText(summoned.text)}
                    >
                      {copied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>
              </div>

              {summoned ? (
                <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge>
                      {summoned.set === "mixed"
                        ? "Mixed sets"
                        : SET_META[summoned.set].label}
                    </Badge>
                    {summoned.blocks.slice(0, 4).map((b) => (
                      <Badge key={b}>{b}</Badge>
                    ))}
                  </div>
                  <p className="font-display text-xl leading-relaxed text-[var(--color-fg)] sm:text-2xl">
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
                <EmptyState
                  title="The veil is still intact"
                  hint="Choose a mood and draw words."
                  icon={Flame}
                />
              )}

              {history.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    Recent summons
                  </h3>
                  <ul className="space-y-2">
                    {history.map((h, i) => (
                      <li key={`${h.text}-${i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setSummoned(h);
                            setCopied(false);
                          }}
                          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-left transition-colors hover:border-[var(--color-border-strong)]"
                        >
                          <p className="line-clamp-2 text-sm text-[var(--color-fg-muted)]">
                            {h.text}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {tab === "ritual" && (
            <section className="animate-fade-up space-y-6" aria-label="Ritual">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                  Block ritual
                </h2>
                <p className="mt-2 text-[var(--color-fg-muted)]">
                  Speak every word in a block as one unbroken sentence — a small
                  dominion of its own.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  Block
                  <select
                    value={ritualBlock.id}
                    onChange={(e) => {
                      const b = BLOCKS.find(
                        (x) => x.id === Number(e.target.value),
                      );
                      if (b) setRitualBlock(b);
                    }}
                    className="h-11 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 text-sm font-normal normal-case tracking-normal text-[var(--color-fg)] outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
                  >
                    {BLOCKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {SET_META[b.set].label} — {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  variant="secondary"
                  onClick={() => setRitualBlock(randomBlock())}
                >
                  <Dice5 className="size-4" />
                  Random
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    copyText(
                      `${dominionFromBlock(ritualBlock)}\n\n${ritualBlock.words.map(displayWord).join(", ")}`,
                    )
                  }
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  Copy
                </Button>
              </div>

              <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-10">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--color-ember-soft)] blur-3xl animate-drift"
                  aria-hidden
                />
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  {SET_META[ritualBlock.set].label} · {ritualBlock.words.length}{" "}
                  words
                </p>
                <h3 className="mt-2 font-display text-3xl font-medium tracking-tight">
                  {ritualBlock.name}
                </h3>
                <p className="relative mt-6 font-display text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
                  {dominionFromBlock(ritualBlock)}
                </p>
                <div className="relative mt-8 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-6">
                  {ritualBlock.words.map((w) => {
                    const key = `${ritualBlock.id}:${w}`;
                    const favored = favSet.has(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleFav(key)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm capitalize transition-colors",
                          favored
                            ? "border-[var(--color-ember)] bg-[var(--color-ember-soft)] text-[var(--color-fg)]"
                            : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
                        )}
                      >
                        {displayWord(w)}
                      </button>
                    );
                  })}
                </div>
              </article>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                  Vault inventory
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Blocks" value={String(LEXICON_STATS.blocks)} />
                  <Stat label="Words" value={`~${LEXICON_STATS.words}`} />
                  <Stat label="Sets" value={String(ALL_SETS.length)} />
                  <Stat label="Entries" value={ENTRIES.length.toLocaleString()} />
                </dl>
              </div>
            </section>
          )}
        </main>

        <footer className="mt-14 border-t border-[var(--color-border)] pt-5 text-center text-xs text-[var(--color-fg-subtle)]">
          {LEXICON_TITLE} · press / to search · favorites stay on this device
        </footer>
      </div>

      {selectedBlock && (
        <BlockDrawer
          block={selectedBlock}
          favSet={favSet}
          onToggleFav={toggleFav}
          onClose={() => setSelectedBlock(null)}
          onCopy={copyText}
          copied={copied}
        />
      )}

      {selectedEntry && (
        <EntryDrawer
          entry={selectedEntry}
          favored={favSet.has(selectedEntry.key)}
          onToggleFav={() => toggleFav(selectedEntry.key)}
          onOpenBlock={() => {
            const b = BLOCKS.find((x) => x.id === selectedEntry.blockId);
            setSelectedEntry(null);
            if (b) setSelectedBlock(b);
          }}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}

function SetChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-150",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
      )}
    >
      {label}
      <span className={cn("tabular-nums text-xs opacity-70", active && "opacity-80")}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  title,
  hint,
  icon: Icon,
}: {
  title: string;
  hint: string;
  icon?: typeof Flame;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/60 px-6 py-16 text-center">
      {Icon && (
        <Icon
          className="mx-auto size-8 text-[var(--color-fg-subtle)]"
          strokeWidth={1.25}
        />
      )}
      <p className={cn("font-display text-xl text-[var(--color-fg-muted)]", Icon && "mt-4")}>
        {title}
      </p>
      <p className="mt-2 text-sm text-[var(--color-fg-subtle)]">{hint}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-3">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-medium tabular-nums tracking-tight">
        {value}
      </dd>
    </div>
  );
}

function BlockDrawer({
  block,
  favSet,
  onToggleFav,
  onClose,
  onCopy,
  copied,
}: {
  block: LexiconBlock;
  favSet: Set<string>;
  onToggleFav: (key: string) => void;
  onClose: () => void;
  onCopy: (t: string) => void;
  copied: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const list = block.words.map(displayWord).join(", ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-bg)_72%,transparent)] backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-soft)] animate-fade-up sm:rounded-[var(--radius-xl)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {SET_META[block.set].label} · #{block.id}
            </p>
            <h3
              id="block-drawer-title"
              className="mt-1 font-display text-3xl font-medium tracking-tight"
            >
              {block.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              {SET_META[block.set].blurb}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            aria-label="Close drawer"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <ul className="flex flex-wrap gap-2">
            {block.words.map((w) => {
              const key = `${block.id}:${w}`;
              const favored = favSet.has(key);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => onToggleFav(key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm capitalize transition-colors",
                      favored
                        ? "border-[var(--color-ember)] bg-[var(--color-ember-soft)] text-[var(--color-fg)]"
                        : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
                    )}
                  >
                    {displayWord(w)}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 font-display text-base italic leading-relaxed text-[var(--color-fg)]">
            {dominionFromBlock(block)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] p-5 sm:p-6">
          <Button variant="secondary" onClick={() => onCopy(list)}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            Copy words
          </Button>
          <Button variant="ghost" onClick={() => onCopy(dominionFromBlock(block))}>
            Copy sentence
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function EntryDrawer({
  entry,
  favored,
  onToggleFav,
  onOpenBlock,
  onClose,
}: {
  entry: LexiconEntry;
  favored: boolean;
  onToggleFav: () => void;
  onOpenBlock: () => void;
  onClose: () => void;
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
      aria-labelledby="entry-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-bg)_72%,transparent)] backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-fade-up rounded-[var(--radius-xl)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {SET_META[entry.set].label} · {entry.blockName}
            </p>
            <h3
              id="entry-drawer-title"
              className="mt-1 font-display text-3xl font-medium capitalize tracking-tight"
            >
              {displayWord(entry.word)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)]"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-4 font-display text-lg italic leading-relaxed text-[var(--color-fg-muted)]">
          “A {displayWord(entry.word)} presence — filed under {entry.blockName}.”
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onToggleFav}>
            <Heart
              className={cn("size-4", favored && "fill-current text-[var(--color-ember)]")}
              strokeWidth={1.75}
            />
            {favored ? "Favored" : "Favor"}
          </Button>
          <Button variant="ghost" onClick={onOpenBlock}>
            Open block
          </Button>
        </div>
      </div>
    </div>
  );
}
