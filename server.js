if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
  getAndLogStats,
  getMoneyToSell,
  getMoneyByLocation,
  getDustByLocation,
  formInventory,
  formScrollInventory,
  getImage,
  generateTime,
} = require("./middleware");
const express = require("express");
const crypto = require("crypto");
const app = express();
const path = require("path");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
let fs = require("fs");
require("./objectComputation");
require("./time");
const {
  levelComputation,
  percentageComputation,
  percentageComputationByExp,
} = require("./exp");
const {
  createUser,
  getUserByEmail,
  getUserById,
  getMonInv,
  getUserByName,
  getEntry,
  insertPrize,
  getRoulette,
  getLog,
  insertLog,
  getRarity,
  createBank,
  getMoney,
  updateMoney,
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
  getMonData,
  getExpeditionByLocation,
  completeExpedition,
  getMonsByLocation,
  getLevelById,
  getExpById,
  updateLevelAndExpByIds,
  getDust,
  updateDust,
  getMonAlike,
  getEntryById,
  deleteMon,
  getEvolution,
  getIconEvolved,
  updateEvolved,
  updateName,
  updateEmail,
  getMail,
  updatePassword,
} = require("./queries");

const initializePassport = require("./passport-config");
initializePassport(passport, getUserByEmail, getUserById);

app.set("view-engine", "ejs");
app.use(express.urlencoded());
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static(path.resolve(__dirname, "public")));

app.get("/", checkAuthenticated, checkAdmin, async (req, res) => {
  const currentBalance = await getMoney(req.user.id);
  const currentDust = await getDust(req.user.id);
  let monInv = await getMonInv(req.user.id);
  const pages = await formInventory(monInv, 24);
  let newPath =
    "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
    req.user.id +
    ".png";
  const found = await getImage(newPath);
  console.log(monInv);
  res.render("index.ejs", {
    pages,
    user: req.user,
    currentBalance,
    currentDust,
    found,
  });
});

app.post("/", checkAuthenticated, checkAdmin, async (req, res) => {
  const { data } = req.body;
  console.log(data);
  let bal,
    muni = 0;
  let dataToSend = {
    stats: [],
    muni: 0,
  };
  const currentBalance = await getMoney(req.user.id);
  bal = currentBalance.pokecash;
  for (const mon of data.mons) {
    const rarity = await getRarityById(mon.id);
    console.log(rarity);
    muni += await getMoneyToSell(rarity[0].rarity);
    console.log(muni);
  }
  if (data.sell === true) {
    const stats = await getAndLogStats(data.mons[data.mons.length - 1].img);
    if (stats !== undefined) dataToSend.stats = Object.values(stats);
    dataToSend.muni = muni;
    res.json(dataToSend);
  } else if (data.confirm === true) {
    let current = {
      money: muni + bal,
      id: req.user.id,
    };
    for (const mon of data.mons) {
      await sellMonById(mon.id);
    }
    updateMoney(current);
  } else if (
    data.sell === false &&
    data.confirm === false &&
    data.form === false
  ) {
    const stat = await getAndLogStats(data.mons[data.mons.length - 1].img);
    let result = await getMonData(data.mons[data.mons.length - 1].id);
    if (result !== null) {
      result.percent = await percentageComputationByExp(
        result.exp,
        result.level
      );
      dataToSend.percentage = result.percent;
    } else {
      dataToSend.percentage = 0;
    }
    if (stat !== undefined) {
      dataToSend.stats = Object.values(stat);
      res.json(dataToSend);
    } else if (stat === undefined) {
      dataToSend.stats = [];
      res.json(dataToSend);
    }
  } else if (data.form === true) {
    let monInv = await getMonInv(req.user.id);
    const pages = await formInventory(monInv, 24);
    const flattenData = pages.flat();
    let array = [];
    flattenData.forEach((element) => {
      if (!element.empty && element.busy === true) {
        array.push(element);
      }
    });
    res.json(array);
  }
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/roulette", checkAuthenticated, async (req, res) => {
  const user = await getUserByName(req.user.id);
  const currentDust = await getDust(req.user.id);
  const roulette = await getRoulette();
  const uid = await getLog(req.user.id);
  const currentBalance = await getMoney(req.user.id);
  let newPath =
    "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
    req.user.id +
    ".png";
  const found = await getImage(newPath);
  let string = "";
  if (uid.length === 0) string = "free";
  else string = "$1";
  res.render("roulette.ejs", {
    user,
    roulette,
    string,
    currentBalance,
    currentDust,
    id: req.user.id,
    found,
  });
});

app.post("/roulette", checkAuthenticated, async (req, res) => {
  const { data } = req.body;
  const rarity = await getRarity(data[0].icon);
  const action = data[0].event;
  const shiny = data[0].shiny;
  if (action === "unknown") {
    let log = [
      {
        id: crypto.randomUUID(),
        uid: req.user.id,
        name: data[0].name,
      },
    ];
    let current = {
      money: data[0].bal,
      id: req.user.id,
    };
    updateMoney(current);
    insertLog(log);
  } else if (action === "Inventory") {
    const entry = await getEntry(data[0].icon);
    let prize = [
      {
        id: crypto.randomUUID(),
        pokEntry: entry.entry,
        userId: req.user.id,
        shiny: shiny,
        level: 5,
        exp: 0,
      },
    ];
    console.log(prize);
    let current = {
      money: data[0].bal,
      id: req.user.id,
    };
    updateMoney(current);
    insertPrize(prize);
  } else if (action === "Sell") {
    let current = {
      money: (await getMoney(req.user.id)).pokecash + data[0].money,
      id: req.user.id,
    };
    console.log(current);
    updateMoney(current);
  }
  res.json(rarity);
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/expedition", checkAuthenticated, async (req, res) => {
  const expeditions = await getExpeditions(req.user.id);
  const currentBalance = await getMoney(req.user.id);
  const currentDust = await getDust(req.user.id);
  let monInv = await getMonInv(req.user.id);
  const pages = await formScrollInventory(monInv, 13);
  let newPath =
    "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
    req.user.id +
    ".png";
  const found = await getImage(newPath);
  res.render("expedition.ejs", {
    pages,
    user: req.user,
    currentBalance,
    expeditions,
    currentDust,
    found,
  });
});

app.post("/expedition", checkAuthenticated, async (req, res) => {
  const { data } = req.body;
  console.log(data);
  let currentBalance;
  let collected = 0;
  let money = [];
  let exists;
  let dust = [];
  let adv = [];
  let explorers = [];
  let filled = false;
  let allExpeditions = await getAllExpeditions(req.user.id);
  let expedition = await getExpeditions(req.user.id);
  const promises = data.array.map(async (element) => {
    let isBusy;
    if (data.check === true) {
      isBusy = await getStatus(element);
    } else {
      isBusy = await getStatus(element.id);
    }
    return isBusy.busy;
  });

  const status = await Promise.all(promises);
  let count = 0;
  status.forEach((element) => {
    if (element === true) count++;
  });
  let percentage = [];
  if (data.check === false) {
    let toPercentage = [];
    for (const element of data.array) {
      const lvl = await getLevelById(element.id);
      const exp = await getExpById(element.id);
      console.log(lvl);
      const temp = {
        level: lvl.level,
        exp: exp.exp,
        id: element.id,
      };
      toPercentage.push(temp);
    }
    percentage = await percentageComputation(toPercentage);
    console.log(percentage);
  }
  while (data.array.length < 3) data.array.push("");
  if (data.check === true && expedition[0].expeditions > 0 && count === 0) {
    const exp = {
      id: req.user.id,
      pokOne: data.array[0],
      pokTwo: data.array[1],
      pokThree: data.array[2],
      location: data.location,
      time: await generateTime(data.location),
    };
    console.log(exp);
    updateExpeditions(req.user.id, --expedition[0].expeditions);
    await insertExpedition(exp);
    data.array.forEach(async (element) => {
      if (element != "") await setStatus(req.user.id, element, "true");
    });
    expedition = await getExpeditions(req.user.id);
    allExpeditions = await getAllExpeditions(req.user.id);
  }
  if (data.checkAdventurers === true) {
    const temp = await getExpeditionByLocation(data.location, req.user.id);
    if (temp === null) {
      adv.push({ empty: true });
      adv.push({ empty: true });
      adv.push({ empty: true });
    } else {
      let result = await getMonData(temp.pokemon_id_one);
      if (result !== null)
        result.percent = await percentageComputationByExp(
          result.exp,
          result.level
        );
      adv.push(result !== null ? result : { empty: true });
      result = await getMonData(temp.pokemon_id_two);
      if (result !== null)
        result.percent = await percentageComputationByExp(
          result.exp,
          result.level
        );
      adv.push(result !== null ? result : { empty: true });
      result = await getMonData(temp.pokemon_id_three);
      if (result !== null)
        result.percent = await percentageComputationByExp(
          result.exp,
          result.level
        );
      adv.push(result !== null ? result : { empty: true });
      exists = adv.filter((element) => element.empty);
      if (exists.length !== 3) filled = true;
    }
  }
  if (data.collect === true && exists != undefined) {
    console.log("here u bozo");
    console.log(data);
    currentBalance = await getMoney(req.user.id);
    const currentDust = await getDust(req.user.id);
    money = await getMoneyByLocation(data.location);
    dust = await getDustByLocation(data.location);
    console.log(currentBalance);
    console.log("this is money " + money);
    currentBalance.pokecash = parseFloat(
      (currentBalance.pokecash + money).toFixed(2)
    );
    console.log("this is value after" + currentBalance);
    currentDust.pokedust = parseInt(currentDust.pokedust) + dust;
    const muni = {
      money: currentBalance.pokecash,
      id: req.user.id,
    };
    console.log(muni);
    updateDust(currentDust.pokedust, req.user.id);
    updateMoney(muni);
    const temp = await getExpeditionByLocation(data.location, req.user.id);
    explorers = [];
    console.log("reached this point");
    if (temp != null && temp.time <= 0) {
      const ids = await getMonsByLocation(data.location, req.user.id);
      if (ids.pokemon_id_one != "") {
        await setStatus(req.user.id, ids.pokemon_id_one, false);
        const lvl = await getLevelById(ids.pokemon_id_one);
        const exp = await getExpById(ids.pokemon_id_one);
        const sum = {
          id: ids.pokemon_id_one,
          level: lvl.level,
          exp: exp.exp,
          bars: 0,
          percent: 0,
          maxExp: 0,
        };
        console.log(sum);
        explorers.push(sum);
      }
      if (ids.pokemon_id_two != "") {
        await setStatus(req.user.id, ids.pokemon_id_two, false);
        const lvl = await getLevelById(ids.pokemon_id_two);
        const exp = await getExpById(ids.pokemon_id_two);
        const sum = {
          id: ids.pokemon_id_two,
          level: lvl.level,
          exp: exp.exp,
          bars: 0,
          percent: 0,
          maxExp: 0,
        };
        explorers.push(sum);
      }
      if (ids.pokemon_id_three != "") {
        await setStatus(req.user.id, ids.pokemon_id_three, false);
        const lvl = await getLevelById(ids.pokemon_id_three);
        const exp = await getExpById(ids.pokemon_id_three);
        const sum = {
          id: ids.pokemon_id_three,
          level: lvl.level,
          exp: exp.exp,
          bars: 0,
          percent: 0,
          maxExp: 0,
        };
        explorers.push(sum);
      }
      await completeExpedition(req.user.id, data.location);
      if (expedition[0].expeditions < 3)
        updateExpeditions(req.user.id, ++expedition[0].expeditions);
      await levelComputation(explorers);
      console.log(explorers);
      explorers.forEach(async (element) => {
        await updateLevelAndExpByIds(element.level, element.exp, element.id);
      });
    }
    allExpeditions = await getAllExpeditions(req.user.id);
    collected = 1;
  }

  const differentInventories = {
    inv1: await getMonsByCriteria(req.user.id, 5, 20),
    inv2: await getMonsByCriteria(req.user.id, 10, 25),
    inv3: await getMonsByCriteria(req.user.id, 20, 35),
    inv4: await getMonsByCriteria(req.user.id, 30, 45),
    inv5: await getMonsBySpecial(req.user.id, 2),
    inv6: await getMonsByCriteria(req.user.id, 40, 55),
    inv7: await getMonsByCriteria(req.user.id, 50, 65),
    inv8: await getMonsBySpecial(req.user.id, 3),
    inv9: await getMonsByCriteria(req.user.id, 60, 75),
    inv10: await getMonsByCriteria(req.user.id, 70, 100),
    inv11: await getLegOrMyth(req.user.id),
    expedition: expedition[0].expeditions,
    status: status,
    allExpeditions: allExpeditions,
    adv: adv,
    filled: filled,
    explorers: explorers,
    percentage: percentage,
    money: money,
    dust: dust,
    currentBalance: currentBalance,
    collected: collected,
  };
  res.json(differentInventories);
});

app.get("/evolution", checkAuthenticated, async (req, res) => {
  const currentBalance = await getMoney(req.user.id);
  const currentDust = await getDust(req.user.id);
  let monInv = await getMonInv(req.user.id);
  const pages = await formInventory(monInv, 25);
  let newPath =
    "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
    req.user.id +
    ".png";
  const found = await getImage(newPath);
  console.log(pages);
  res.render("evolution.ejs", {
    pages,
    user: req.user,
    currentBalance,
    currentDust,
    found,
  });
});

app.post("/evolution", checkAuthenticated, async (req, res) => {
  const { data } = req.body;
  console.log(data);
  if (data.checkSearch === true) {
    let monInv;
    if (data.search != "") {
      monInv = await getMonAlike(req.user.id, data.search);
    } else {
      monInv = await getMonInv(req.user.id);
    }
    let pages = await formInventory(monInv, 25);
    res.json(pages);
  } else if (data.evolve === true) {
    let temp = {
      pass: false,
      icon: "",
      id: data.toEvolve,
    };
    if (data.material.length === 3) {
      const entryPromises = data.material.map(async (material) => {
        return await getEntryById(material);
      });

      const entries = await Promise.all(entryPromises);

      const toEvolve = await getEntryById(data.toEvolve);

      let condition = true;

      entries.forEach((entry) => {
        if (entry.entry !== toEvolve.entry) {
          condition = false;
        }
      });
      if (condition === true) {
        data.material.forEach(async (material) => {
          await deleteMon(material);
        });
        await updateDust(data.dust, req.user.id);
        const entry = await getEntryById(data.toEvolve);
        const evolution = await getEvolution(entry.entry);
        const icon = await getIconEvolved(evolution.evolution);
        await updateEvolved(data.toEvolve, evolution.evolution);
        temp = {
          pass: true,
          icon: icon.icon,
          id: data.toEvolve,
        };
      }
    }
    res.json(temp);
  } else if (data.checkDust === true) {
    const dust = await getDust(req.user.id);
    console.log(dust);
    res.json(dust.pokedust);
  }
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    if (req.body.password === req.body.passwordRepeat) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        id: crypto.randomUUID(),
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      };

      await createUser(user);
      await createBank(user.id);
      console.log(user);
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});

app.get("/settings", checkAuthenticated, async (req, res) => {
  const currentBalance = await getMoney(req.user.id);
  const currentDust = await getDust(req.user.id);
  let newPath =
    "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
    req.user.id +
    ".png";
  const found = await getImage(newPath);
  res.render("settings.ejs", {
    user: req.user,
    currentBalance,
    currentDust,
    found,
  });
});

app.post("/settings", checkAuthenticated, async (req, res) => {
  const { data } = req.body;
  const user = req.user;
  console.log(data);
  if (data.nameCheck === true) {
    await updateName(req.user.id, data.name);
  } else if (data.loggingCheck === true) {
    let logging = false;
    if (
      data.email === user.email &&
      (await bcrypt.compare(data.password, user.password))
    ) {
      logging = true;
    }
    console.log(logging);
    res.json(logging);
  } else if (data.newMailCheck === true) {
    let success = false;
    const email = await getMail(req.user.id);
    console.log(email);
    if (email.email != data.newMail) {
      success = true;
      await updateEmail(req.user.id, data.newMail);
    }
    res.json(success);
  } else if (data.newPasswordCheck === true) {
    const hashPassword = await bcrypt.hash(data.newPassword, 10);
    await updatePassword(req.user.id, hashPassword);
  }
});

app.post("/upload", checkAuthenticated, async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, function (error, fields, file) {
    let filePath = file.inputFile[0].filepath;
    let newPath =
      "C:/Users/maria/OneDrive/Desktop/Pokemon/public/images/" +
      req.user.id +
      ".png";
    fs.access(newPath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(newPath, function (err) {
          console.log(err);
        });
        fs.rename(filePath, newPath, function () {
          res.end();
        });
      } else {
        fs.rename(filePath, newPath, function () {
          res.end();
        });
      }
    });
  });
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.all("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found</h1>");
});

app.listen(3000, (error) => {
  console.log(error ? error : "Server listening on http://localhost:" + 3000);
});
