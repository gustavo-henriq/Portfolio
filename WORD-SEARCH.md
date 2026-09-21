# Stack word search

The active portfolio puzzle is `src/WordSearch.jsx`, not the earlier crossword.
No game library is required. React hooks, pointer events and an SVG overlay provide the interaction.

Add one entry to `src/stack.js`: `{ word: 'PYTHON', category: 'Languages', projects: ['jobhunter'] }`.
Project IDs must match a real section. Skills without a published project remain plain text rather than linking to a fabricated case study.

`generateGrid(words, { cols: 11, rows: 13, seed: 2026 })` is pure and deterministic. It uses seeded placement with backtracking and weighted random filler, scanning all eight directions to reject duplicate occurrences. It throws rather than silently dropping words when the requested dimensions cannot be satisfied within its bounded search.

The default is solved. PLAY/Reset clears markings. Shuffle changes the seed and starts a new game. Reveal all restores all markings. Drag in any direction, or focus the grid, use arrows, and press Space at both endpoints. Escape cancels keyboard selection. Tab leaves the grid. Reduced-motion settings disable drawing animation.

Tests: `node --test tests/word-search.test.mjs`.
