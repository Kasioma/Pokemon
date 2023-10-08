let send = {
  array: [],
  location: [],
  check: false,
  checkAdventurers: false,
  collect: false,
};

const body = document.body;

function changeClass() {
  document.getElementById("gear").className = "fa fa-gear fa-spin icons";
}
function changeBack() {
  document.getElementById("gear").className = "fa fa-gear icons";
}

let data;
let reachable = [];
let inventories = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let locationOne = document.querySelector(".location-one");
let locationTwo = document.querySelector(".location-two");
let locationThree = document.querySelector(".location-three");
let locationFour = document.querySelector(".location-four");
let locationFive = document.querySelector(".location-five");
let locationSix = document.querySelector(".location-six");
let locationSeven = document.querySelector(".location-seven");
let locationEight = document.querySelector(".location-eight");
let locationNine = document.querySelector(".location-nine");
let locationTen = document.querySelector(".location-ten");
let locationEleven = document.querySelector(".location-eleven");
const explore = document.getElementById("explore");
const collect = document.getElementById("collect");
const adventurers = document
  .querySelector(".selected")
  .querySelectorAll(".slot");

let selected = [];
let ind = [];
let times = [];
let upCheck = 0;
function formArray(array) {
  for (let i = 1; i <= 11; i++) {
    let propName = "inv" + i;
    array.push(data[propName]);
  }
}
let allLocations = [];
document.addEventListener("DOMContentLoaded", async function () {
  await fetchMons();
  console.log(data);
  data.allExpeditions.forEach((element) => {
    ind.push(element.location);
    times.push(element.time);
  });
  formArray(allLocations);
  console.log(allLocations);
  getZones();
  upp();
  timer();
  explore.disable = true;
});

async function relocateInventory(page) {
  send.check = false;
  send.collect = false;
  let ok = 0;
  for (let i = 0; i < ind.length; i++) {
    console.log(ind[i]);
    console.log(reachable[i].time);
    if (ind[i] != lastClicked || reachable[i].time > 0) ok = 0;
    else {
      ok = 1;
      break;
    }
  }
  console.log(ok);
  if (
    ok == 0 &&
    document.getElementById("explore").classList.contains("invisible")
  ) {
    document.getElementById("explore").classList.remove("invisible");
    document.getElementById("collect").classList.add("invisible");
  } else if (
    ok == 1 &&
    document.getElementById("collect").classList.contains("invisible")
  ) {
    document.getElementById("explore").classList.add("invisible");
    document.getElementById("collect").classList.remove("invisible");
  }

  selected = [];
  let i = 0;
  let index = 0;
  console.log(data);
  adventurers.forEach((elements) => {
    elements.innerHTML = "";
  });
  console.log(adventurers);
  adventurers.forEach((elements) => {
    if (data.adv[index].empty !== true) {
      console.log(data.adv);
      let img = document.createElement("img");
      img.setAttribute("src", data.adv[index].icon);
      img.setAttribute("data-info", data.adv[index].id);
      let bar = document.createElement("div");
      bar.classList.add("progress");
      bar.style.zIndex = 1;
      let text = document.createElement("span");
      text.classList.add("progress_text");
      text.innerHTML = data.adv[index].percent + "%";
      let fill = document.createElement("div");
      fill.classList.add("progress_fill");
      fill.style.width = data.adv[index].percent + "%";
      bar.appendChild(fill);
      bar.appendChild(text);
      const lvl = document.createElement("span");
      lvl.classList.add("level");
      lvl.innerHTML = data.adv[index].level;
      elements.appendChild(lvl);
      elements.appendChild(bar);
      elements.appendChild(img);
      index++;
    } else {
      elements.innerHTML = "";
      index++;
    }
  });

  const inventory = document.getElementById("inventory");
  if (inventory) {
    inventory.remove();
  }
  const container = document.querySelector(".container");
  const replacement = document.createElement("div");
  replacement.id = "inventory";
  if (data.filled === true) replacement.style.pointerEvents = "none";
  replacement.classList.add("inventory");
  console.log(page);
  page.forEach((element) => {
    let div = document.createElement("div");
    div.classList.add("slot");
    if (!element.empty) {
      const img = document.createElement("img");
      img.setAttribute("src", element.icon);
      img.classList.add("monster");
      img.setAttribute("alt", element.name);
      img.setAttribute("data-info", element.id);
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-clock";
      if (data.status[i++] === true) {
        icon.style.opacity = 1;
        div.style.pointerEvents = "none";
      }
      const lvl = document.createElement("span");
      lvl.classList.add("level");
      lvl.innerHTML = element.level;
      div.appendChild(lvl);
      div.appendChild(icon);
      div.appendChild(img);
    }
    replacement.appendChild(div);
  });
  container.appendChild(replacement);

  explore.disable = false;
  clickedNumber();
}

let lastClicked;

locationOne.addEventListener(
  "click",
  (inventories[0] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv1.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv1.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 1;
    send.array = data.inv1;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 1;
    relocateInventory(page);
  })
);

locationTwo.addEventListener(
  "click",
  (inventories[1] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv2.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv2.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 2;
    send.array = data.inv2;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 2;
    relocateInventory(page);
  })
);

locationThree.addEventListener(
  "click",
  (inventories[2] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv3.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv3.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 3;
    send.array = data.inv3;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 3;
    relocateInventory(page);
  })
);

locationFour.addEventListener(
  "click",
  (inventories[3] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv4.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv4.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 4;
    send.array = data.inv4;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 4;
    relocateInventory(page);
  })
);

locationFive.addEventListener(
  "click",
  (inventories[4] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv5.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv5.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 5;
    send.array = data.inv5;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 5;
    relocateInventory(page);
  })
);

locationSix.addEventListener(
  "click",
  (inventories[5] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv6.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv6.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 6;
    send.array = data.inv6;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 6;
    relocateInventory(page);
  })
);

locationSeven.addEventListener(
  "click",
  (inventories[6] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv7.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv7.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 7;
    send.array = data.inv7;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 7;
    relocateInventory(page);
  })
);

locationEight.addEventListener(
  "click",
  (inventories[7] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv8.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv8.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 8;
    send.array = data.inv8;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 8;
    relocateInventory(page);
  })
);

locationNine.addEventListener(
  "click",
  (inventories[8] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv9.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv9.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 9;
    send.array = data.inv9;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 9;
    relocateInventory(page);
  })
);

locationTen.addEventListener(
  "click",
  (inventories[9] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv10.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv10.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 10;
    send.array = data.inv10;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 10;
    relocateInventory(page);
  })
);

locationEleven.addEventListener(
  "click",
  (inventories[10] = async function () {
    let page = [];
    const pageLength = 13;
    if (data.inv11.length === 0) {
      const emptyObject = { empty: true };
      for (let i = 0; i <= pageLength; i++) {
        page.push(emptyObject);
      }
    } else {
      data.inv11.forEach((element) => {
        page.push(element);
      });
      while (page.length - 1 < 13) {
        page.push({ empty: true });
      }
    }
    console.log(page);
    send.location = 11;
    send.array = data.inv11;
    send.check = false;
    send.checkAdventurers = true;
    await fetchMons();
    lastClicked = 11;
    relocateInventory(page);
  })
);

const container = document.querySelector(".img-container");

function getZones() {
  reachable = [];
  const zones = document.querySelectorAll(".zones");
  for (let i = 0; i < ind.length; i++) {
    const temp = {
      zones: zones[ind[i] - 1],
      time: times[i],
      index: ind[i] - 1,
    };
    reachable.push(temp);
  }
  console.log(reachable);
}

let intervalId;

async function upp() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  const interval = setInterval(() => {
    reachable.forEach((zone) => {
      zone.time--;
    });

    const allTimesZero = reachable.every((zone) => zone.time === 0);
    if (allTimesZero) {
      clearInterval(interval);
    }
  }, 1000);

  intervalId = interval;
}

const span = document.getElementById("time");
let countdown;
function startTimer(seconds) {
  clearInterval(countdown);

  function updateTimer() {
    span.innerHTML = formatDuration(seconds--);
    if (seconds <= 0) {
      clearInterval(countdown);
      span.innerHTML = "DONE!";
      ind.forEach((element) => {
        if (element == lastClicked) {
          document.getElementById("explore").classList.add("invisible");
          document.getElementById("collect").classList.remove("invisible");
        }
      });
    }
  }

  updateTimer();
  countdown = setInterval(updateTimer, 1000);
}

let pointer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

async function timer() {
  reachable.forEach((zone) => {
    zone.zones.addEventListener(
      "mouseover",
      (pointer[zone.index] = function mouseOver() {
        const containerRect = container.getBoundingClientRect();
        const zoneRect = zone.zones.getBoundingClientRect();

        const middleX =
          (zoneRect.left + zoneRect.right) / 2 - containerRect.left;
        const middleY =
          (zoneRect.top + zoneRect.bottom) / 2 - containerRect.top;

        document.querySelector(".timer").style.top = middleY + 10 + "px";
        document.querySelector(".timer").style.left = middleX - 10 + "px";

        document.querySelector(".timer").style.opacity = 1;
        document.querySelector(".timer").style.transition = "500ms ease-in-out";

        startTimer(zone.time);
      })
    );

    zone.zones.addEventListener("mouseout", () => {
      document.querySelector(".timer").style.opacity = 0;
      clearInterval(countdown);
    });
  });
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function clickedNumber() {
  const inv = document.querySelectorAll(".slot");
  inv.forEach((div, index) => {
    div.addEventListener("click", () => {
      if (div.innerHTML.trim() != "" && index >= 3) {
        const id = div.querySelector("img").getAttribute("data-info");
        if (
          selected.includes(div.querySelector("img").getAttribute("data-info"))
        ) {
          const indexToDelete = selected.indexOf(
            div.querySelector("img").getAttribute("data-info")
          );
          selected.splice(indexToDelete, 1);
          adventurers.forEach((element) => {
            if (
              element.innerHTML != "" &&
              element.querySelector("img").getAttribute("data-info") == id
            ) {
              element.innerHTML = "";
            }
          });
        } else if (selected.length <= 2) {
          let flag = false;
          selected.push(div.querySelector("img").getAttribute("data-info"));
          adventurers.forEach((element) => {
            if (!flag) {
              if (element.innerHTML === "") {
                console.log(data.percentage);
                const foundPercentage = data.percentage.find(
                  (item) => item.id === id
                );
                let percentage = 0;
                let level = 0;
                if (foundPercentage !== undefined) {
                  console.log(foundPercentage);
                  level = foundPercentage.level;
                  percentage = foundPercentage.percentage;
                }
                console.log(percentage);
                const temp = document.createElement("img");
                temp.setAttribute("data-info", id);
                temp.src = div.querySelector("img").getAttribute("src");
                let bar = document.createElement("div");
                bar.classList.add("progress");
                bar.style.zIndex = 1;
                let text = document.createElement("span");
                text.classList.add("progress_text");
                text.innerHTML = percentage + "%";
                let fill = document.createElement("div");
                fill.style.width = percentage + "%";
                fill.classList.add("progress_fill");
                const lvl = document.createElement("span");
                lvl.classList.add("level");
                lvl.innerHTML = level;
                element.appendChild(lvl);
                bar.appendChild(fill);
                bar.appendChild(text);
                element.appendChild(bar);
                element.appendChild(temp);
                flag = true;
              }
            }
          });
        }
      }
    });
  });
}

explore.addEventListener("click", async function () {
  if (selected.length != 0) {
    send.check = true;
    send.array = selected;
    await fetchMons();
  }
  console.log(selected);
  selected.forEach((element) => {
    document
      .getElementById("inventory")
      .querySelectorAll(".slot")
      .forEach((e) => {
        if (
          e.querySelector("img") != undefined &&
          e.querySelector("img").getAttribute("data-info") == element
        ) {
          e.querySelector("i").style.opacity = 1;
        }
        e.style.pointerEvents = "none";
      });
  });
  const expeNumber = document.getElementById("number-of-expeditions-left");
  expeNumber.innerHTML = data.expedition + " / 3";
  ind = [];
  times = [];
  data.allExpeditions.forEach((element) => {
    ind.push(element.location);
    times.push(element.time);
  });
  getZones();
  upp();
  timer();
});

collect.addEventListener("click", async function () {
  const chosen = document.querySelector(".selected").querySelectorAll(".slot");
  let k = 0;
  chosen.forEach((element) => {
    if (element.innerHTML != "") k = 1;
  });
  send.collect = true;
  await fetchMons();
  if (k === 1 && data.collected === 1) {
    const expeNumber = document.getElementById("number-of-expeditions-left");
    expeNumber.innerHTML = data.expedition + " / 3";
    const sel = document.querySelector(".selected").querySelectorAll(".slot");
    sel.forEach(async (element) => {
      const imgElement = element.querySelector("img");

      if (imgElement) {
        await updateBar(element);
      }
    });
    document.getElementById("found").innerHTML = "$ " + data.money;
    document.getElementById("dusty").innerHTML = data.dust;
    let updatedDust =
      parseInt(data.dust) +
      parseInt(document.getElementById("dust").innerHTML.slice(2));
    document.getElementById("dust").innerHTML = "✧ " + updatedDust;
    document.querySelector(".model").style.zIndex = 2;
    document.getElementById("explore").classList.remove("invisible");
    document.getElementById("collect").classList.add("invisible");
    let z = document.querySelectorAll(".zones");
    z[lastClicked - 1].removeEventListener(
      "mouseover",
      pointer[lastClicked - 1]
    );
    ind = [];
    times = [];
    data.allExpeditions.forEach((element) => {
      ind.push(element.location);
      times.push(element.time);
    });
    setTimeout(() => {
      send.collect = false;
      send.checkAdventurers = false;
      document.getElementById("balance").innerHTML =
        "$" + data.currentBalance.pokecash;
      inventories[lastClicked - 1]();
      document.querySelector(".model").style.zIndex = -1;
    }, 5000);
  } else {
    alert("nothing to collect u bozo");
  }
});

async function updateBar(div) {
  let fill = div.querySelector(".progress_fill");
  let text = div.querySelector(".progress_text");
  let id = div.querySelector("img").getAttribute("data-info");

  const foundObject = data.explorers.find((obj) => obj.id === id);

  if (foundObject) {
    text.innerHTML = foundObject.percent + "%";
    fill.style.width = foundObject.percent + "%";
    fill.style.transition = "width " + 0.5 + "s " + "ease";
  }
}

const sw = document.getElementById("switch");
sw.addEventListener("click", () => {
  const bal = document.querySelector(".bal");
  const dust = document.querySelector(".dust");

  if (dust.classList.contains("opa")) {
    bal.classList.add("opa");
    dust.classList.remove("opa");
  } else {
    bal.classList.remove("opa");
    dust.classList.add("opa");
  }
});

const help = document.getElementById("help");
help.addEventListener("click", () => {
  document.querySelector(".help__list").classList.toggle("opac");
});

async function fetchMons() {
  const response = await fetch("http://localhost:3000/expedition/?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: send,
    }),
  });
  data = await response.json();
}
