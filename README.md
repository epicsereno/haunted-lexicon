# Horror & Halloween Lexicon

Interactive vault of **101 themed word blocks** (~1,120 horror words) across eleven moods — sinister, halloween, nightmare, sensory, setting, body, creature, object, mind, human, and occult.

Built with React 19, TanStack Start, Vite, and Tailwind CSS.

## Features

- **Blocks** — browse all 101 themed lists; filter by set; open a drawer to favor & copy
- **All words** — flat search across the entire vault
- **Summon** — weave 7 words into a haunted place description (set-aware); recent history
- **Ritual** — speak an entire block as one dominion sentence
- **Favorites** — persist on-device via `localStorage`
- **Keyboard** — press `/` to focus search

## Data

- Source: [`src/data/horror-halloween-lexicon.json`](src/data/horror-halloween-lexicon.json)
- Accessors & summon logic: [`src/data/lexicon.ts`](src/data/lexicon.ts)
- Legacy place-word set: [`src/data/haunted-words.ts`](src/data/haunted-words.ts)

## Run locally

```bash
npm install
npm run dev
```

Serves at `http://localhost:8080`.

```bash
npm run build
npm run typecheck
```

## License

MIT
