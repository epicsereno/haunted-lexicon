# Haunted Lexicon

An interactive dark lexicon of **100 haunted words for places** — browse, filter, favor, and **summon** atmospheric place descriptions.

Built with React 19, TanStack Start, Vite, and Tailwind CSS.

## Features

- **Lexicon** — searchable, category-filtered grid of 100 haunted descriptors
- **Favorites** — heart words (saved in `localStorage`)
- **Word detail** — gloss + atmospheric line for each entry
- **Summon a place** — weave 7 random words into a haunted locale
- **All the above** — the ultimate dominion sentence with every word

## Run locally

```bash
npm install
npm run dev
```

App serves at `http://localhost:8080`.

```bash
npm run build
npm run typecheck
```

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Tailwind CSS v4
- Lucide icons

## Data

Core place words live in [`src/data/haunted-words.ts`](src/data/haunted-words.ts).

A larger multi-set Horror & Halloween lexicon (101 themed blocks, ~1,120 words) is included as [`src/data/horror-halloween-lexicon.json`](src/data/horror-halloween-lexicon.json) for future expansion.

## License

MIT
