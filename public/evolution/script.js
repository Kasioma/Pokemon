let data = [];
let searchResult = false;
let monsters;
let send = {
  checkSearch: false,
  search: "",
  toEvolve: [],
  material: [],
  evolve: false,
  checkDust: false,
  setDust: false,
  dust: 0,
};
let selected = [];
let evo = [];
const material = document.querySelectorAll(".material");
const body = document.body;
document.addEventListener("DOMContentLoaded", async () => {
  const ser = search.value;
  send.checkSearch = true;
  send.search = ser;
  await fetchMons();
  const flattenedData = data.flat();
  flattenedData.forEach((element) => {
    if (element.empty != true) {
      const temp = {
        id: element.id,
        evo: element.evo,
      };
      evo.push(temp);
    }
  });
});

function changeClass() {
  document.getElementById("gear").className = "fa fa-gear fa-spin icons";
}
function changeBack() {
  document.getElementById("gear").className = "fa fa-gear icons";
}

function lock() {
  document.getElementById("evolve").pointerEvents = false;
  document.getElementById("select").pointerEvents = false;
}

function unlock() {
  document.getElementById("evolve").pointerEvents = true;
  document.getElementById("select").pointerEvents = true;
}

const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");

const counter = document.querySelector(".counter");
counter.id = document.querySelector("pg-nr");

backBtn.onclick = () => {
  let a = parseInt(counter.innerHTML);

  if (a > 1) {
    a--;
  }
  document.querySelectorAll(".inventory").forEach((element) => {
    if (element.classList.contains("active-mons"))
      element.classList.replace("active-mons", "inactive");
  });
  let i = 0;
  document.querySelectorAll(".inventory").forEach((element) => {
    i++;
    if (i === a) element.classList.replace("inactive", "active-mons");
  });
  counter.innerHTML = a;
};

forwardBtn.onclick = () => {
  let a = parseInt(counter.innerHTML);

  if (a < numPages) {
    a++;
  }
  document.querySelectorAll(".inventory").forEach((element) => {
    if (element.classList.contains("active-mons"))
      element.classList.replace("active-mons", "inactive");
  });
  let i = 0;
  document.querySelectorAll(".inventory").forEach((element) => {
    i++;
    if (i === a) element.classList.replace("inactive", "active-mons");
  });
  counter.innerHTML = a;
};
const search = document.querySelector(".search__bar");
search.addEventListener("keyup", async function (event) {
  if (event.keyCode === 13) {
    await performSearch();
  }
});

async function performSearch() {
  const ser = search.value;
  send.checkSearch = true;
  send.search = ser;
  await fetchMons();
  await createNewInventory();
  numPages = data.length;
  document
    .querySelector(".inventory")
    .classList.replace("inactive", "active-mons");
  monsters = document.querySelectorAll(".slot");
  searchResult = true;
  selectToEvolve();
}

async function createNewInventory() {
  const inv = document.querySelector(".all__pages");
  inv.innerHTML = "";

  data.forEach((page) => {
    const div = document.createElement("div");
    div.classList.add("inventory");
    div.classList.add("inactive");
    div.id = "inventory";
    page.forEach((item) => {
      const temp = document.createElement("div");
      if (item.empty) {
        temp.classList.add("slot");
      } else {
        temp.classList.add("slot");
        const img = document.createElement("img");
        img.setAttribute("src", item.icon);
        img.setAttribute("data-info", item.id);
        img.setAttribute("alt", item.name);
        img.classList.add("monster");
        const icon = document.createElement("i");
        icon.className = "fa-regular fa-clock";
        if (item.busy === true) {
          icon.style.opacity = 1;
          temp.style.pointerEvents = "none";
        }
        const span = document.createElement("span");
        span.classList.add("level");
        span.innerHTML = item.level;
        temp.appendChild(img);
        temp.appendChild(icon);
        temp.appendChild(span);
      }
      div.appendChild(temp);
    });
    inv.appendChild(div);
  });
}
let lastClicked;
let selectPressed = false;
function selectToEvolve() {
  monsters.forEach((monster) => {
    if (monster.querySelector("img") != null) {
      const id = monster.querySelector("img").getAttribute("data-info");
      const flattenedData = data.flat();
      const targetPokemon = flattenedData.find((pokemon) => pokemon.id === id);
      if (targetPokemon) {
        const evo = targetPokemon.evo;
        const level = targetPokemon.level;
        const busy = targetPokemon.busy;
        if (
          ((evo === 1 && level >= 16) || (evo === 2 && level >= 36)) &&
          busy === false
        ) {
          monster.addEventListener("click", async function () {
            if (selectPressed) {
              return;
            }
            if (searchResult === true) {
              const toEvo = document.getElementById("to-evolve");
              if (
                send.toEvolve[0] ===
                monster.querySelector("img").getAttribute("data-info")
              ) {
                send.toEvolve = [];
                toEvo.innerHTML = "";
              } else {
                lastClicked = monster;
                send.toEvolve[0] = monster
                  .querySelector("img")
                  .getAttribute("data-info");
                if (toEvo.querySelector("img") === null) {
                  const img = document.createElement("img");
                  img.setAttribute("data-info", send.toEvolve[0]);
                  img.setAttribute(
                    "src",
                    monster.querySelector("img").getAttribute("src")
                  );
                  const lvl = document.createElement("span");
                  lvl.innerHTML = level;
                  lvl.classList.add("level");
                  toEvo.appendChild(lvl);
                  toEvo.appendChild(img);
                } else {
                  toEvo
                    .querySelector("img")
                    .setAttribute("data-info", send.toEvolve[0]);
                  toEvo
                    .querySelector("img")
                    .setAttribute(
                      "src",
                      monster.querySelector("img").getAttribute("src")
                    );
                  toEvo.querySelector("span").innerHTML = level;
                }
              }
            }
          });
        }
      }
    }
  });
}
let finished = true;
function selectMaterial() {
  const inv = document.querySelectorAll(".slot");
  inv.forEach((div, idx) => {
    if (div !== lastClicked)
      div.addEventListener("click", () => {
        if (div.innerHTML.trim() != "" && idx > 3 && finished === true) {
          const id = div.querySelector("img").getAttribute("data-info");
          if (
            selected.includes(
              div.querySelector("img").getAttribute("data-info")
            )
          ) {
            const indexToDelete = selected.indexOf(
              div.querySelector("img").getAttribute("data-info")
            );
            selected.splice(indexToDelete, 1);
            material.forEach((element) => {
              if (
                element.innerHTML != "" &&
                element.querySelector("img").getAttribute("data-info") == id
              ) {
                element.innerHTML = "";
              }
            });
          } else if (selected.length <= 2 && finished === true) {
            let flag = false;
            selected.push(div.querySelector("img").getAttribute("data-info"));
            material.forEach((element) => {
              if (!flag) {
                if (element.innerHTML === "") {
                  const flattenedData = data.flat();
                  const targetPokemon = flattenedData.find(
                    (pokemon) => pokemon.id === id
                  );
                  let level = 0;
                  if (targetPokemon) {
                    level = targetPokemon.level;
                  }
                  const temp = document.createElement("img");
                  temp.setAttribute("data-info", id);
                  temp.src = div.querySelector("img").getAttribute("src");
                  const lvl = document.createElement("span");
                  lvl.classList.add("level");
                  lvl.innerHTML = level;
                  element.appendChild(lvl);
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

const select = document.getElementById("select");
select.addEventListener("click", async () => {
  if (document.getElementById("to-evolve").innerHTML.trim() != "") {
    if (selectPressed) {
      selectPressed = false;
    } else selectPressed = true;
    selectMaterial();
  }
});
let actualDust;
let dust;
const evolve = document.getElementById("evolve");
evolve.addEventListener("click", async () => {
  const selectedElements = document.querySelectorAll(".slot");
  const firstFour = Array.from(selectedElements).slice(0, 4);
  let anyEmpty = true;
  for (const element of firstFour) {
    if (element.innerHTML === "") {
      anyEmpty = false;
      break;
    }
  }
  if (anyEmpty) {
    document.getElementById("model").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    const foundObject = evo.find(
      (obj) =>
        obj.id ===
        document
          .getElementById("to-evolve")
          .querySelector("img")
          .getAttribute("data-info")
    );
    if (foundObject) {
      if (foundObject.evo === 1) dust = 100;
      if (foundObject.evo === 2) dust = 200;
    } else {
      alert("the evolved monster isn't selected properly!");
    }
    document.getElementById("ammount").innerHTML = dust;
    send.checkDust = true;
    send.checkSearch = false;
    await fetchMons();
    actualDust = data;
  } else {
    alert("you must select three materials!!");
  }
});

const confirm = document.getElementById("confirm");
confirm.addEventListener("click", async () => {
  if (actualDust - dust >= 0) {
    send.checkSearch = false;
    send.checkDust = false;
    send.setDust = true;
    send.dust = actualDust - dust;
    send.toEvolve = document
      .getElementById("to-evolve")
      .querySelector("img")
      .getAttribute("data-info");
    send.material = selected;
    send.evolve = true;
    await fetchMons();
    if (data.pass === true) {
      document.getElementById("dust").innerHTML = "✧ " + actualDust - dust;
      const fill__two = document.querySelector(".fill__two");
      fill__two.style.height = "100%";
      fill__two.style.top = "0%";
      setTimeout(() => {
        document.querySelector(".material__one").innerHTML = "";
      }, 2000);
      setTimeout(() => {
        const fill__one = document.querySelector(".fill__one");
        fill__one.style.height = "100%";
        fill__one.style.top = "0%";
      }, 2000);
      setTimeout(() => {
        document.querySelector(".material__two").innerHTML = "";
      }, 4000);
      setTimeout(() => {
        const fill__three = document.querySelector(".fill__three");
        fill__three.style.height = "100%";
        fill__three.style.top = "0%";
      }, 4000);
      setTimeout(() => {
        document.querySelector(".material__three").innerHTML = "";
      }, 6000);
      setTimeout(() => {
        let totalSwaps = 30;
        const div = document.getElementById("to-evolve");
        const temp = document.createElement("img");
        temp.classList.add("toDelete");

        temp.onload = async function () {
          div.appendChild(temp);
          div.querySelector("img").classList.add("not-showing");

          let swapDuration = 200;

          for (let i = 0; i < totalSwaps; i++) {
            await new Promise((resolve) => setTimeout(resolve, swapDuration));
            div.querySelector("img").classList.toggle("not-showing");
            temp.classList.toggle("not-showing");

            swapDuration += 20;

            if (i === totalSwaps - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              break;
            }
          }
        };
        temp.src = data.icon;
      }, 8000);
      setTimeout(() => {
        unlock();
        refresh();
      }, 30000);
      document.getElementById("model").classList.toggle("active");
      document.getElementById("overlay").classList.toggle("active");
      finished = false;
      lock();
    } else {
      alert("materials selected aren't of the same type!!");
    }
  } else {
    alert("not enough dust!!!");
  }
});

cancel.addEventListener("click", async function () {
  document.getElementById("model").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
});

async function refresh() {
  const selectedElements = document.querySelectorAll(".slot");
  const firstFour = Array.from(selectedElements).slice(0, 4);

  firstFour.forEach((element) => {
    element.innerHTML = "";
  });
  performSearch();
  finished = true;
  selected = [];
  empty();
  send = {
    checkSearch: false,
    search: "",
    toEvolve: [],
    material: [],
    evolve: false,
    checkDust: false,
    setDust: false,
    dust: 0,
  };
}

function empty() {
  const fill__one = document.querySelector(".fill__one");
  fill__one.style.height = "0%";
  fill__one.style.top = "100%";

  const fill__two = document.querySelector(".fill__two");
  fill__two.style.height = "0%";
  fill__two.style.top = "100%";

  const fill__three = document.querySelector(".fill__three");
  fill__three.style.height = "0%";
  fill__three.style.top = "100%";
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

const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  refresh();
});

async function fetchMons() {
  const response = await fetch("http://localhost:3000/evolution/?", {
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
