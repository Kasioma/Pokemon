const { getStats } = require("./queries");

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

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
  checkAdmin,
  getAndLogStats,
  getShiny,
  getMoneyToSell,
};
