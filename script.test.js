const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

function loadGame() {
  const elements = new Map();
  const context = {
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { textContent: '', setAttribute() {} });
        return elements.get(id);
      },
    },
    window: {},
    alert() {},
  };

  vm.runInNewContext(source, context);
  context.model.generateShipLocations();
  return context;
}

test('generated ships have no overlapping locations', () => {
  const { model } = loadGame();
  const locations = model.ships.flatMap((ship) => ship.locations);

  assert.equal(locations.length, model.numShips * model.shipLength);
  assert.equal(new Set(locations).size, locations.length);
});

test('a repeated shot does not count twice or sink a ship twice', () => {
  const { model } = loadGame();
  const ship = model.ships[0];

  ship.locations.forEach((location) => model.fire(location));
  assert.equal(model.shipSunk, 1);
  assert.equal(model.fire(ship.locations[ship.locations.length - 1]), null);
  assert.equal(model.shipSunk, 1);
});

test('a repeated miss is ignored', () => {
  const { model } = loadGame();
  const occupied = new Set(model.ships.flatMap((ship) => ship.locations));
  let miss = '00';
  while (occupied.has(miss)) {
    const row = Number(miss[0]);
    const column = Number(miss[1]) + 1;
    miss = column === model.boardSize ? `${row + 1}0` : `${row}${column}`;
  }

  assert.equal(model.fire(miss), false);
  assert.equal(model.fire(miss), null);
  assert.equal(model.shipSunk, 0);
});
