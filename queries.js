const { Client } = require("pg");
const crypto = require("crypto");
const { query } = require("express");
const pg = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "postgres",
});

pg.connect();

const runQuery = function (query, cb) {
  pg.query(query, (err, res) => {
    if (err) return console.log(err);

    console.log({
      query: query
        .split("\n")
        .map((str) => str.trim())
        .filter((str) => str.length != 0)
        .join(" "),
    });
    if (cb != undefined) cb(res.rows);
  });
};

function createUser(user) {
  const query = `insert into users(id, nickname, email, password)
  values('${user.id}','${user.name}', '${user.email}', '${user.password}')`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function createBank(id) {
  const query = `insert into currency(user_id, pokecash, pokedust) values ('${id}', '${1.0}', '${0}')`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getUserByEmail(email) {
  const query = `select * from users where email = '${email}'`;
  console.log({ query });
  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getUserById(id) {
  const query = `select * from users where id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getUserByName(id) {
  const query = `select nickname from users where id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getMonInv(userId) {
  const query = `select pokemons.*, moninv.shiny as shiny, moninv.id as id from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${userId}' order by pok_entry`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteCommon() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'common'
   order by random()
   limit 20`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteUncommon() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'uncommon'
   order by random()
   limit 12`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteRare() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'rare'
   order by random()
   limit 7`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteEpic() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'epic'
   order by random()
   limit 3`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteMythic() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'mythic'
   order by random()
   limit 1`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRouletteLegendary() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'legendary'
   order by random()
   limit 1`;
  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function insertMons(user_id, pok_entry, shiny) {
  const id = crypto.createRandomUUID();
  const query = `insert into moninv(id, user_id, pok_entry, shiny)
  values('${id}', '${user_id}, '${pok_entry}, '${shiny}')`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getStats(img) {
  const query = `select HP, Attack, Defence, Sp_Attack, Sp_Defence, Speed from monstats join pokemons on pokemons.name = monstats.name
   where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}
function getEntry(img) {
  const query = `select entry from pokemons where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function insertPrize(mon) {
  const query = `insert into moninv(id, user_id, pok_entry, shiny, level, exp) values (
    '${mon[0].id}', 
    '${mon[0].userId}', 
    '${mon[0].pokEntry}',
    '${mon[0].shiny}', 
    '${mon[0].level}',
    '${mon[0].exp}')`;
  runQuery(query);
}

function updateMoney(bank) {
  console.log(bank.money);
  const query = `update currency set pokecash = '${bank.money}' where user_id = '${bank.id}'`;

  runQuery(query);
}

async function getMoney(id) {
  const query = `select pokecash from currency where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function emptyRoulette() {
  const query = `truncate table roulette`;

  runQuery(query);
}
function insertRoulette(roul) {
  const query = `insert into roulette(icon, name) values (
    '${roul.icon}',
    '${roul.name}')`;

  runQuery(query);
}

function getRoulette() {
  const query = `select * from roulette`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function getRarity(img) {
  const query = `select rarity from pokemons where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function clearLogs() {
  const query = `truncate table roulettelogs`;

  runQuery(query);
}

function getLog(id) {
  const query = `select user_id from roulettelogs where user_id = '${id}'`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

function insertLog(user) {
  const query = `insert into roulettelogs(id, user_id, name) values ('${user[0].id}','${user[0].uid}', '${user[0].name}')`;

  runQuery(query);
}

async function getRarityById(id) {
  const query = `select rarity from pokemons join moninv on pokemons.entry = moninv.pok_entry where moninv.id = '${id}'`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

async function sellMonById(id) {
  const query = `delete from moninv where id = '${id}'`;

  runQuery(query);
}

async function getMonsByCriteria(id, criteria) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and moninv.level >='${criteria}' order by pok_entry`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

async function getMonsBySpecial(id, criteria) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and pokemons.evo >='${criteria}' order by pok_entry`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

async function getLegOrMyth(id) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and (pokemons.rarity ='legendary' or pokemons.rarity = 'mythic') order by pok_entry`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getMonInv,
  runQuery,
  getUserByName,
  getRouletteCommon,
  getRouletteUncommon,
  getRouletteRare,
  getRouletteEpic,
  getRouletteMythic,
  getRouletteLegendary,
  insertMons,
  getStats,
  getEntry,
  insertPrize,
  emptyRoulette,
  insertRoulette,
  getRoulette,
  clearLogs,
  getLog,
  insertLog,
  getRarity,
  createBank,
  updateMoney,
  getMoney,
  getRarityById,
  sellMonById,
  getMonsByCriteria,
  getMonsBySpecial,
  getLegOrMyth,
};
