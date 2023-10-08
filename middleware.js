const { getStats } = require("./queries");
const fs = require("fs");
const util = require("util");

const access = util.promisify(fs.access);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function authRole(isadmin) {
  return (req, res, next) => {
    if (req.user.isadmin !== isadmin) {
      res.status(401);
      return res.send("Not authorized");
    }
    next();
  };
}

function checkAdmin(req, res, next) {
  if (req.user.isadmin === true) {
    return res.redirect("/admin");
  }
  next();
}
async function getAndLogStats(data) {
  const stats = await getStats(data);
  if (stats == null) return;
  return stats;
}

function getShiny(mon) {
  console.log("Original icon:", mon.icon);
  const shinyIcon = mon.icon.replace("/normal/", "/shiny/");
  console.log("Shiny icon:", shinyIcon);
  return shinyIcon;
}

async function getMoneyToSell(rarity) {
  switch (rarity) {
    case "common":
      return 0.75;
    case "uncommon":
      return 1.75;
    case "rare":
      return 3.25;
    case "epic":
      return 7.25;
    case "mythic":
      return 75.0;
    case "legendary":
      return 75.0;
    default:
      return 0;
  }
}

async function getMoneyByLocation(location) {
  switch (location) {
    case 1:
      return Math.floor((Math.random() * (0.5 - 0.1) + 0.1) * 100) / 100;
    case 2:
      return Math.Floor((Math.random() * (1 - 0.5) + 0.5) * 100) / 100;
    case 3:
      return Math.Floor((Math.random() * (1.5 - 1) + 1) * 100) / 100;
    case 4:
      return Math.Floor((Math.random() * (2 - 1.5) + 1.5) * 100) / 100;
    case 5:
      return Math.Floor((Math.random() * (2.5 - 2) + 2) * 100) / 100;
    case 6:
      return Math.Floor((Math.random() * (3 - 2.5) + 2.5) * 100) / 100;
    case 7:
      return Math.Floor((Math.random() * (3.5 - 3) + 3) * 100) / 100;
    case 8:
      return Math.Floor((Math.random() * (4 - 3.5) + 3.5) * 100) / 100;
    case 9:
      return Math.Floor((Math.random() * (4.5 - 4) + 4) * 100) / 100;
    case 10:
      return Math.Floor((Math.random() * (5 - 4.5) + 4.5) * 100) / 100;
    case 11:
      return Math.Floor((Math.random() * (10 - 9) + 9) * 100) / 100;
  }
}

async function getDustByLocation(location) {
  switch (location) {
    case 1:
      return Math.floor(Math.random() * (5 - 1) + 1);
    case 2:
      return Math.floor(Math.random() * (10 - 5) + 5);
    case 3:
      return Math.floor(Math.random() * (15 - 10) + 10);
    case 4:
      return Math.floor(Math.random() * (20 - 15) + 15);
    case 5:
      return Math.floor(Math.random() * (25 - 20) + 20);
    case 6:
      return Math.floor(Math.random() * (30 - 25) + 25);
    case 7:
      return Math.floor(Math.random() * (35 - 30) + 30);
    case 8:
      return Math.floor(Math.random() * (40 - 35) + 35);
    case 9:
      return Math.floor(Math.random() * (45 - 40) + 40);
    case 10:
      return Math.floor(Math.random() * (50 - 45) + 45);
    case 11:
      return Math.floor(Math.random() * (55 - 50) + 50);
  }
}

async function formInventory(inventory, slots) {
  let pages = [];

  if (inventory.length === 0) {
    const emptyObject = { empty: true };
    const emptyPage = Array(slots).fill(emptyObject);
    pages.push(emptyPage);
    return pages;
  }
  inventory.forEach((mon) => {
    if (mon.shiny === true) {
      mon.icon = getShiny(mon);
    }
  });

  inventory.forEach((mon, idx) => {
    if (idx % slots == 0) pages.push([]);

    pages[pages.length - 1].push(mon);
  });

  while (pages[pages.length - 1].length != slots)
    pages[pages.length - 1].push({ empty: true });

  return pages;
}

async function formScrollInventory(inventory, slots) {
  let pages = [];

  if (inventory.length === 0) {
    const emptyObject = { empty: true };
    for (let i = 0; i <= slots; i++) {
      pages.push(emptyObject);
    }
    return pages;
  }

  inventory.forEach((mon) => {
    if (mon.shiny === true) {
      mon.icon = getShiny(mon);
    }
  });

  inventory.forEach((mon) => {
    pages.push(mon);
  });

  while (pages.length - 1 < 13) {
    pages.push({ empty: true });
  }
  return pages;
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateTime(location) {
  switch (location) {
    case 1:
      return getRandomNumber(300, 600);
    case 2:
      return getRandomNumber(600, 1200);
    case 3:
      return getRandomNumber(1200, 2400);
    case 4:
      return getRandomNumber(2400, 3000);
    case 5:
      return getRandomNumber(3000, 4000);
    case 6:
      return getRandomNumber(4000, 4500);
    case 7:
      return getRandomNumber(4000, 5000);
    case 8:
      return getRandomNumber(5000, 6000);
    case 9:
      return getRandomNumber(6000, 7000);
    case 10:
      return getRandomNumber(7000, 8000);
    case 11:
      return 10000;
    default:
      break;
  }
}

async function getImage(path) {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
  checkAdmin,
  getAndLogStats,
  getShiny,
  getMoneyToSell,
  getMoneyByLocation,
  getDustByLocation,
  formInventory,
  formScrollInventory,
  getImage,
  generateTime,
};
