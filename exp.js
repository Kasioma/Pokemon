const experienceNeeded = {
  2: 15,
  3: 37,
  4: 70,
  5: 115,
  6: 169,
  7: 231,
  8: 305,
  9: 384,
  10: 474,
  11: 569,
  12: 672,
  13: 781,
  14: 897,
  15: 1018,
  16: 1144,
  17: 1274,
  18: 1409,
  19: 1547,
  20: 1689,
  21: 1832,
  22: 1978,
  23: 2127,
  24: 2275,
  25: 2425,
  26: 2575,
  27: 2725,
  28: 2873,
  29: 3022,
  30: 3168,
  31: 3311,
  32: 3453,
  33: 3591,
  34: 3726,
  35: 3856,
  36: 3982,
  37: 4103,
  38: 4219,
  39: 4328,
  40: 4431,
  41: 4526,
  42: 4616,
  43: 4695,
  44: 4769,
  45: 4831,
  46: 4885,
  47: 4930,
  48: 4963,
  49: 4986,
  50: 4999,
  51: 6324,
  52: 6471,
  53: 6615,
  54: 6755,
  55: 6891,
  56: 7023,
  57: 7150,
  58: 7274,
  59: 7391,
  60: 7506,
  61: 7613,
  62: 7715,
  63: 7812,
  64: 7903,
  65: 7988,
  66: 8065,
  67: 8137,
  68: 8201,
  69: 9572,
  70: 9052,
  71: 9870,
  72: 10030,
  73: 9409,
  74: 10307,
  75: 10457,
  76: 9724,
  77: 10710,
  78: 10847,
  79: 9995,
  80: 11073,
  81: 11197,
  82: 10216,
  83: 11393,
  84: 11504,
  85: 10382,
  86: 11667,
  87: 11762,
  88: 10488,
  89: 11889,
  90: 11968,
  91: 10532,
  92: 12056,
  93: 12115,
  94: 10508,
  95: 12163,
  96: 12202,
  97: 10411,
  98: 12206,
  99: 8343,
  100: 8118,
};

async function levelComputation(array) {
  let middleLevel = 0;
  array.forEach((pokemon) => {
    middleLevel += pokemon.level;
  });
  if (array.length > 0) middleLevel = Math.floor(middleLevel / array.length);
  const exp = experienceNeeded[middleLevel];

  let random = Math.floor(
    Math.random() * (Math.floor(0.4 * exp) - Math.floor(0.2 * exp) + 1) +
      Math.floor(0.2 * exp)
  );
  const randChance = Math.floor(Math.random() * 100) + 1;
  if (randChance < 5) random *= 2;

  array.forEach((pokemon) => {
    if (pokemon.level < 100) {
      pokemon.exp = pokemon.exp + random;
      while (pokemon.exp - experienceNeeded[pokemon.level] >= 0) {
        pokemon.exp = pokemon.exp - experienceNeeded[pokemon.level];
        pokemon.level++;
        pokemon.bars++;
      }
      pokemon.percent = Math.floor(
        (pokemon.exp * 100) / experienceNeeded[pokemon.level]
      );
      pokemon.maxExp = experienceNeeded[pokemon.level];
    }
  });
}

async function percentageComputation(array) {
  let percentage = [];
  array.forEach((pokemon) => {
    let temp = {
      percentage: Math.floor(
        (pokemon.exp * 100) / experienceNeeded[pokemon.level]
      ),
      level: pokemon.level,
      id: pokemon.id,
      exp: pokemon.exp,
      maxExp: experienceNeeded[pokemon.level],
    };
    percentage.push(temp);
  });
  return percentage;
}

async function percentageComputationByExp(exp, lvl) {
  return Math.floor((exp * 100) / experienceNeeded[lvl]);
}

module.exports = {
  levelComputation,
  percentageComputation,
  percentageComputationByExp,
};
