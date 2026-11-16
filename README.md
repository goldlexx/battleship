# Battleship

A small browser version of the classic Battleship guessing game, built with vanilla JavaScript, HTML, and CSS. Ships are placed randomly on a 7 × 7 board.

## Play

Open [the live game](https://goldlexx.github.io/battleship/), enter a coordinate such as `A0`, and select **Fire!**. The game reports hits, misses, and when all ships have been sunk.

## Run locally

Open `index.html` in a browser. No build step or package installation is required.

## Tests

Run the game logic tests with Node.js:

```sh
node --test
```

The tests cover ship placement and repeated shots. The game does not use a backend or external services.
