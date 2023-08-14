const {
  getRouletteCommon,
  insertRoulette,
  emptyRoulette,
  getRouletteUncommon,
  getRouletteRare,
  getRouletteEpic,
  getRouletteMythic,
  getRouletteLegendary,
  clearLogs,
} = require("./queries");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function empty() {
  return emptyRoulette();
}

async function clear() {
  return clearLogs();
}

async function creation(...arrays) {
  let roulette = [];
  for (let i = 0; i < 50; i++) {
    let r = rand(0, 19);
    roulette.push(arrays[0][r]);
  }
  for (let i = 50; i < 75; i++) {
    let r = rand(0, 11);
    roulette.push(arrays[1][r]);
  }
  for (let i = 75; i < 90; i++) {
    let r = rand(0, 6);
    roulette.push(arrays[2][r]);
  }
  for (let i = 90; i < 98; i++) {
    let r = rand(0, 2);
    roulette.push(arrays[3][r]);
  }
  roulette.push(arrays[4][0]);
  roulette.push(arrays[5][0]);
  return roulette;
}

async function shuffle(array) {
  const shuffle = array.slice();

  for (let i = shuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
  }
  return shuffle;
}

function scheduler() {
  let now = new Date();
  let untilMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
    now;
  setTimeout(async function () {
    await empty();
    await clear();
    const common = await getRouletteCommon();
    const uncommon = await getRouletteUncommon();
    const rare = await getRouletteRare();
    const epic = await getRouletteEpic();
    const mythic = await getRouletteMythic();
    const legendary = await getRouletteLegendary();
    let rouletteMons = await creation(
      common,
      uncommon,
      rare,
      epic,
      mythic,
      legendary
    );
    const shuffledArray = await shuffle(rouletteMons);
    shuffledArray.forEach((entry) => {
      insertRoulette(entry);
    });
    scheduler();
  }, 3600000);
}

scheduler();
