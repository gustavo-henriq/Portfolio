# Stack crossword

No runtime libraries were added. `src/Crossword.jsx` owns keyboard/mobile input, selection, checking, reveals, reset and completion. It starts solved.

`src/crossword-model.js` derives the rectangular grid, black squares and standard scan-order numbers from `src/crossword-entries.json`. It validates conflicting letters and undeclared adjacent runs on load.

To add a skill, update the word list and translated clues in `scripts/generate-crossword.mjs`, then run `node scripts/generate-crossword.mjs`. The backtracking generator searches a 15×15 board, prioritizes compact candidates and writes the JSON. Its bounded search reports omitted words, if any; it does not claim a globally optimal solution when the search budget expires. The current layout includes all ten requested words, with none omitted.

Click a square or clue to select it; type letters or digits to fill it. Arrows navigate; Backspace erases and moves backward when empty. Space/Tab switch direction at crossings; Escape leaves the grid for the controls. The visually hidden input opens the mobile keyboard. Check marks incorrect letters; Reveal word and Reveal all fill their targets. Play/Reset start an empty game. Every skill remains readable in the linked answer key.
