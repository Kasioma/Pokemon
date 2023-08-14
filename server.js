if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
  checkAdmin,
  getAndLogStats,
  getShiny,
  getMoneyToSell,
} = require("./middleware");
const express = require("express");
const crypto = require("crypto");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("./objectComputation");
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
  let monInv = [];
  monInv = await getMonInv(req.user.id);
  const pages = [];
  const pageLength = 24;
  const currentBalance = await getMoney(req.user.id);
  if (monInv.length === 0) {
    const emptyObject = { empty: true };
    const emptyPage = Array(pageLength).fill(emptyObject);
    pages.push(emptyPage);

    res.render("index.ejs", { pages, user: req.user, currentBalance });
    return;
  }
  monInv.forEach((mon) => {
    console.log(mon);
    if (mon.shiny === true) {
      console.log("Before replacement:", mon.icon);
      mon.icon = getShiny(mon);
      console.log("After replacement:", mon.icon);
    }
  });
  monInv.forEach((mon, idx) => {
    if (idx % pageLength == 0) pages.push([]);

    pages[pages.length - 1].push(mon);
  });

  while (pages[pages.length - 1].length != pageLength)
    pages[pages.length - 1].push({ empty: true });

  console.log(monInv);
  res.render("index.ejs", {
    pages,
    user: req.user,
    currentBalance,
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
  } else if (data.sell === false && data.confirm === false) {
    const stat = await getAndLogStats(data.mons[data.mons.length - 1].img);
    if (stat !== undefined) {
      dataToSend.stats = Object.values(stat);
      res.json(dataToSend);
    } else if (stat === undefined) {
      dataToSend.stats = [];
      res.json(dataToSend);
    }
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
  const roulette = await getRoulette();
  const uid = await getLog(req.user.id);
  const currentBalance = await getMoney(req.user.id);
  const bal = currentBalance.pokecash;
  let string = "";
  if (uid.length === 0) string = "free";
  else string = "$1";
  console.log(string);
  res.render("roulette.ejs", { user, roulette, string, bal });
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

app.get("/admin", checkAuthenticated, authRole(true), (req, res) => {
  res.render("admin.ejs");
});

app.get("/expedition", checkAuthenticated, async (req, res) => {
  console.log("this is expedition page");
  let monInv = [];
  let pages = [];
  const pageLength = 13;
  monInv = await getMonInv(req.user.id);
  const currentBalance = await getMoney(req.user.id);

  if (monInv.length === 0) {
    const emptyObject = { empty: true };
    for (let i = 0; i <= pageLength; i++) {
      pages.push(emptyObject);
    }
    console.log(pages);
    res.render("expedition.ejs", { pages, user: req.user, currentBalance });
    return;
  }
  monInv.forEach((mon) => {
    console.log(mon);
    if (mon.shiny === true) {
      console.log("Before replacement:", mon.icon);
      mon.icon = getShiny(mon);
      console.log("After replacement:", mon.icon);
    }
  });

  monInv.forEach((mon) => {
    pages.push(mon);
  });

  while (pages.length - 1 < 13) {
    pages.push({ empty: true });
  }
  console.log(pages);
  res.render("expedition.ejs", { pages, user: req.user, currentBalance });
});
app.post("/expedition", checkAuthenticated, async (req, res) => {
  const differentInventories = {
    inv1: await getMonsByCriteria(req.user.id, 5),
    inv2: await getMonsByCriteria(req.user.id, 10),
    inv3: await getMonsByCriteria(req.user.id, 20),
    inv4: await getMonsByCriteria(req.user.id, 30),
    inv5: await getMonsBySpecial(req.user.id, 2),
    inv6: await getMonsByCriteria(req.user.id, 40),
    inv7: await getMonsByCriteria(req.user.id, 50),
    inv8: await getMonsBySpecial(req.user.id, 3),
    inv9: await getMonsByCriteria(req.user.id, 60),
    inv10: await getMonsByCriteria(req.user.id, 70),
    inv11: await getLegOrMyth(req.user.id),
  };
  res.json(differentInventories);
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
