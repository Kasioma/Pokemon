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

const runQueryNoComment = function (query, cb) {
  pg.query(query, (err, res) => {
    if (err) return console.log(err);

    if (cb != undefined) cb(res.rows);
  });
};

function createUser(user) {
  const query = `insert into users(id, nickname, email, password)
  values('${user.id}','${user.name}', '${user.email}', '${user.password}')`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function createBank(id) {
  const query = `insert into currency(user_id, pokecash, pokedust) values ('${id}', '${1.0}', '${0}')`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getUserByEmail(email) {
  const query = `select * from users where email = '${email}'`;
  console.log({ query });
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getUserById(id) {
  const query = `select * from users where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getUserByName(id) {
  const query = `select nickname from users where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function getMonInv(userId) {
  const query = `select pokemons.*, moninv.shiny as shiny, moninv.id as id, moninv.level as level, moninv.busy as busy from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${userId}' order by pok_entry`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteCommon() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'common'
   order by random()
   limit 20`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteUncommon() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'uncommon'
   order by random()
   limit 12`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteRare() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'rare'
   order by random()
   limit 7`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteEpic() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'epic'
   order by random()
   limit 3`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteMythic() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'mythic'
   order by random()
   limit 1`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRouletteLegendary() {
  const query = `select icon, name from pokemons where pokemons.rarity = 'legendary'
   order by random()
   limit 1`;
  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function insertMons(user_id, pok_entry, shiny) {
  const id = crypto.createRandomUUID();
  const query = `insert into moninv(id, user_id, pok_entry, shiny)
  values('${id}', '${user_id}, '${pok_entry}, '${shiny}')`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getStats(img) {
  const query = `select HP, Attack, Defence, Sp_Attack, Sp_Defence, Speed from monstats join pokemons on pokemons.name = monstats.name
   where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}
function getEntry(img) {
  const query = `select entry from pokemons where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}
async function getEntryById(id) {
  const query = `select pok_entry as entry from moninv where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
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
  runQueryNoComment(query);
}

function updateMoney(bank) {
  const query = `update currency set pokecash = '${bank.money}' where user_id = '${bank.id}'`;

  runQuery(query);
}

async function getMoney(id) {
  const query = `select pokecash from currency where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function updateDust(dust, id) {
  const query = `update currency set pokedust = '${dust}' where user_id = '${id}'`;

  runQuery(query);
}

async function getDust(id) {
  const query = `select pokedust from currency where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function emptyRoulette() {
  const query = `truncate table roulette`;

  runQueryNoComment(query);
}
function insertRoulette(roul) {
  const query = `insert into roulette(icon, name) values (
    '${roul.icon}',
    '${roul.name}')`;

  runQueryNoComment(query);
}

function getRoulette() {
  const query = `select * from roulette`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function getRarity(img) {
  const query = `select rarity from pokemons where pokemons.icon = '${img}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

function clearLogs() {
  const query = `truncate table roulettelogs`;

  runQueryNoComment(query);
}

function getLog(id) {
  const query = `select user_id from roulettelogs where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

function insertLog(user) {
  const query = `insert into roulettelogs(id, user_id, name) values ('${user[0].id}','${user[0].uid}', '${user[0].name}')`;

  runQueryNoComment(query);
}

async function getRarityById(id) {
  const query = `select rarity from pokemons join moninv on pokemons.entry = moninv.pok_entry where moninv.id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function sellMonById(id) {
  const query = `delete from moninv where id = '${id}'`;

  runQueryNoComment(query);
}

async function getMonsByCriteria(id, criteria, secondCriteria) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and moninv.level >='${criteria}' and moninv.level <= '${secondCriteria}' order by pok_entry`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function getMonsBySpecial(id, criteria) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and pokemons.evo >='${criteria}' order by pok_entry`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function getLegOrMyth(id) {
  const query = `select pokemons.icon, moninv.id as id, moninv.level as level, moninv.exp as exp from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and (pokemons.rarity ='legendary' or pokemons.rarity = 'mythic') order by pok_entry`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function getExpeditions(id) {
  const query = `select expeditions from currency where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function updateExpeditions(id, exp) {
  const query = `update currency set expeditions = '${exp}' where user_id = '${id}'`;

  runQueryNoComment(query);
}

async function insertExpedition(obj) {
  const query = `insert into expeditions (user_id, pokemon_id_one, pokemon_id_two, pokemon_id_three, location, time) values(
    '${obj.id}','${obj.pokOne}', '${obj.pokTwo}', '${obj.pokThree}', '${obj.location}', '${obj.time}'
  )`;

  runQueryNoComment(query);
}

async function getStatus(id) {
  const query = `select busy from moninv where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function getAllExpeditions(id) {
  const query = `select * from expeditions where user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => resolve(data))
  );
}

async function setStatus(id, monId, status) {
  const query = `update moninv set busy = '${status}' where user_id = '${id}' and id = '${monId}' `;

  runQueryNoComment(query);
}

async function updateTime() {
  const query = `update expeditions set time = time - 1 where time > 0`;

  runQueryNoComment(query);
}

async function getMonData(id) {
  const query = `select moninv.id, moninv.shiny, moninv.level, moninv.exp, moninv.busy, pokemons.icon from moninv join pokemons on pokemons.entry = moninv.pok_entry where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}
async function getExpeditionByLocation(location, id) {
  const query = `select * from expeditions where location = '${location}' and user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function completeExpedition(id, location) {
  const query = `delete from expeditions where location = '${location}' and user_id = '${id}'`;

  runQueryNoComment(query);
}

async function getMonsByLocation(location, id) {
  const query = `select pokemon_id_one, pokemon_id_two, pokemon_id_three from expeditions where location = '${location}' and user_id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function getLevelById(id) {
  const query = `select level from moninv where id = '${id}'`;

  return new Promise((resolve) =>
    runQueryNoComment(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function getExpById(id) {
  const query = `select exp from moninv where id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function updateLevelAndExpByIds(level, exp, id) {
  const query = `update moninv set level = '${level}', exp = '${exp}' where id = '${id}'`;

  runQueryNoComment(query);
}

async function getMonAlike(id, string) {
  const query = `select pokemons.name, pokemons.icon, pokemons.evo, moninv.shiny as shiny, moninv.id as id, moninv.level as level, moninv.busy as busy from moninv join pokemons on pokemons.entry = moninv.pok_entry where user_id = '${id}' and pokemons.name ILIKE '${string}%' and pokemons.evo <= 2 order by pok_entry`;

  return new Promise((resolve) => runQuery(query, (data) => resolve(data)));
}

async function deleteMon(id) {
  const query = `delete from moninv where id = '${id}'`;

  runQuery(query);
}

async function getEvolution(entry) {
  const query = `select evolution from pokemons where entry = '${entry}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function getIconEvolved(entry) {
  const query = `select icon from pokemons where entry = '${entry}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function updateEvolved(id, entry) {
  const query = `update moninv set pok_entry = '${entry}' where id = '${id}'`;

  runQuery(query);
}

async function updateName(id, name) {
  const query = `update users set nickname = '${name}' where id = '${id}'`;

  runQuery(query);
}

async function updateEmail(id, mail) {
  const query = `update users set email = '${mail}' where id = '${id}'`;

  runQuery(query);
}

async function getMail(id) {
  const query = `select email from users where id = '${id}'`;

  return new Promise((resolve) =>
    runQuery(query, (data) => {
      if (data.length) resolve(data[0]);
      else resolve(null);
    })
  );
}

async function updatePassword(id, password) {
  const query = `update users set password = '${password}' where id = '${id}'`;

  runQuery(query);
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getMonInv,
  runQuery,
  runQueryNoComment,
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
  getExpeditions,
  updateExpeditions,
  insertExpedition,
  getStatus,
  getAllExpeditions,
  setStatus,
  updateTime,
  getMonData,
  getExpeditionByLocation,
  completeExpedition,
  getMonsByLocation,
  getLevelById,
  getExpById,
  updateLevelAndExpByIds,
  updateDust,
  getDust,
  getMonAlike,
  getEntryById,
  deleteMon,
  getEvolution,
  getIconEvolved,
  updateEvolved,
  updateName,
  updateEmail,
  updatePassword,
  getMail,
};
