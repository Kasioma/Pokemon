var ammountOfPokemons = 100;
let send;
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function disable() {
  inv.disabled = true;
  sell.disabled = true;
  shiny.disabled = true;
}

function enable() {
  inv.disabled = false;
  sell.disabled = false;
  shiny.disabled = false;
}

const button = document.getElementById("rollMon");
let inv = document.getElementById("bInv");
let sell = document.getElementById("bSell");
let shiny = document.getElementById("bShiny");
let btn = document.querySelectorAll(".btn");
let balance = document.getElementById("balance").innerHTML;
balance = parseFloat(balance.slice(1, balance.length));
let data;
let chosenMon;
let divs;
let shinify;

button.addEventListener("click", async function play(ev) {
  let text = document.getElementById("rollMon").innerHTML;
  if (balance >= 1 || text == "free") {
    balance--;
    document.getElementById("balance").innerHTML = "$" + balance;
    enable();
    btn.forEach((element) => {
      element.disabled = true;
    });

    var offset = -1 * rand(85, ammountOfPokemons * 85);

    document.getElementById("monsGrid").style.left = offset + "px";
    chosenMon = -1 * parseInt((offset - 180 - 86) / 85);
    console.log(chosenMon);

    divs = document.querySelectorAll(".slot");
    send = [
      {
        icon: divs[chosenMon - 1].querySelector("img").src,
        name: divs[chosenMon - 1].querySelector("img").alt,
        event: "unknown",
        money: 0.0,
        bal: balance,
        shiny: false,
      },
    ];

    setTimeout(function () {
      document.getElementById("gz").innerHTML =
        "Congratulations, you won a " +
        divs[chosenMon - 1].querySelector("img").alt;
      document.getElementById("captured").src =
        divs[chosenMon - 1].querySelector("img").src;
      document.getElementById("captured").classList.remove("invisible");
      shinify = document.getElementById("captured").src;
      shinify = shinify.replace("/normal/", "/shiny/");

      if (document.getElementById("rollMon").innerHTML == "free") {
        document.getElementById("rollMon").innerHTML = "$1";
      }

      setTimeout(function () {
        document.getElementById("monsGrid").style.transitionDuration = "5s";
      }, 50);
    }, 5500);
    await fetchMon(send);
    setTimeout(function () {
      switch (data.rarity) {
        case "common":
          document.getElementById("sPrice").innerHTML = "($0.75)";
          send[0].money = 0.75;
          return;
        case "uncommon":
          document.getElementById("sPrice").innerHTML = "($1.75)";
          send[0].money = 1.75;
          return;
        case "rare":
          document.getElementById("sPrice").innerHTML = "($3.25)";
          send[0].money = 3.25;
          return;
        case "epic":
          document.getElementById("sPrice").innerHTML = "($7.25)";
          send[0].money = 7.25;
          return;
        case "mythic":
          document.getElementById("sPrice").innerHTML = "($75)";
          send[0].money = 75.0;
          return;
        case "legendary":
          document.getElementById("sPrice").innerHTML = "($75)";
          send[0].money = 75.0;
          return;
        default:
          return;
      }
    }, 6000);
  } else {
    message = "Not enough money";
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";
    btn.forEach((element) => {
      element.disabled = false;
    });
  }
});

inv.addEventListener("click", async function () {
  disable();
  send[0].event = "Inventory";
  await fetchMon(send);
  btn.forEach((element) => {
    element.disabled = false;
  });
});

sell.addEventListener("click", async function () {
  disable();
  let temp = document
    .getElementById("sPrice")
    .innerHTML.slice(2, document.getElementById("sPrice").innerHTML.length - 1);
  temp = parseFloat(temp);
  balance += temp;
  document.getElementById("balance").innerHTML = "$" + balance;
  send[0].event = "Sell";
  await fetchMon(send);
  btn.forEach((element) => {
    element.disabled = false;
  });
});

shiny.addEventListener("click", async function () {
  const r = rand(1, 4096);
  disable();
  balance -= 2;

  document.getElementById("balance").innerHTML = "$" + balance;
  send[0].bal = balance;
  let totalSwaps;
  if (r === 1) totalSwaps = 30;
  else totalSwaps = 31;
  const div = document.getElementById("cap");
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
    btn.forEach((element) => {
      element.disabled = false;
    });
  };
  temp.src = shinify;
  if (totalSwaps % 2 === 1) {
    send[0].event = "Inventory";
    await fetchMon(send);
    await deleteElement();
  } else if (totalSwaps % 2 === 0) {
    send[0].event = "Inventory";
    send[0].shiny = true;
    await fetchMon(send);
    await deleteElementShiny();
  }
});

async function deleteElement() {
  await new Promise((resolve) => setTimeout(resolve, 18000));
  document.querySelector(".not-showing").remove();
}

async function deleteElementShiny() {
  await new Promise((resolve) => setTimeout(resolve, 18000));
  document.getElementById("captured").src = shinify;
  document.querySelector(".toDelete").remove();
  document.getElementById("captured").classList.remove("not-showing");
  document.getElementById("gz").innerHTML =
    "Congratulations, you won a SHINY " +
    divs[chosenMon - 1].querySelector("img").alt;
}

async function fetchMon(obj) {
  if (obj[0].icon == undefined) return;
  else {
    const response = await fetch("http://localhost:3000/roulette/?", {
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
}
