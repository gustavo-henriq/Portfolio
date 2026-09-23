# Chess Column

The compact newspaper puzzle uses `chess.js` for legal moves, check and checkmate. Its four bundled positions come from the [Lichess open puzzle database](https://database.lichess.org/#puzzles), which is released under CC0. The twelve transparent `engraved-*.png` assets preserve the owner-supplied piece silhouettes and add a flat halftone newspaper finish. Light and dark armies use separate artwork, so the board does not rely on CSS inversion.

## Add a puzzle

Add one object to `puzzles.json` with `id`, the Lichess `fen`, the complete UCI `moves` list, `rating`, and `themes`. Lichess stores the FEN before the opponent's move, so the first move in `moves` is applied before the player sees the board. Run `node --test tests/chess-puzzles.test.mjs` afterward; every move must be legal and the final position must be checkmate.

Promotion is automatically made to a queen. The bundled mate-in-one positions do not promote, and auto-queen keeps the small portfolio card free of a modal while matching the overwhelmingly common puzzle case.

## Update the displayed rating

Edit the single `chessProfile` object in `chessConfig.js`. `mode`, `rating`, and `updatedAt` are static and never fetched from an external service.
