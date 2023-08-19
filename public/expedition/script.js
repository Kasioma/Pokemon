let send = [];
let data;
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
const adventurers = document
  .querySelector(".selected")
  .querySelectorAll(".slot");

let selected = [];
document.addEventListener("DOMContentLoaded", async function () {
  await fetchMons();
  timer();
  console.log(data);
});

function relocateInventory(page) {
  selected = [];
  adventurers.forEach((elements) => {
    elements.innerHTML = "";
  });
  const inventory = document.getElementById("inventory");
  if (inventory) {
    inventory.remove();
  }
  const container = document.querySelector(".container");
  const replacement = document.createElement("div");
  replacement.id = "inventory";
  replacement.classList.add("inventory");
  page.forEach((element) => {
    let div = document.createElement("div");
    div.classList.add("slot");
    if (!element.empty) {
      const img = document.createElement("img");
      img.setAttribute("src", element.icon);
      img.classList.add("monster");
      img.setAttribute("alt", element.name);
      img.setAttribute("data-info", element.id);
      div.appendChild(img);
    }
    replacement.appendChild(div);
  });
  container.appendChild(replacement);
  clickedNumber();
}

locationOne.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationTwo.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationThree.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationFour.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationFive.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationSix.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationSeven.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationEight.addEventListener("click", async function () {
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
  relocateInventory(page);
});

locationNine.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationTen.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

locationEleven.addEventListener("click", async function () {
  let page = [];
  const pageLength = 7;
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
  relocateInventory(page);
});

const container = document.querySelector(".img-container");

function timer() {
  const zones = document.querySelectorAll(".zones");
  zones.forEach((zone) => {
    zone.addEventListener("mouseover", () => {
      const containerRect = container.getBoundingClientRect();
      const zoneRect = zone.getBoundingClientRect();

      const middleX = (zoneRect.left + zoneRect.right) / 2 - containerRect.left;
      const middleY = (zoneRect.top + zoneRect.bottom) / 2 - containerRect.top;

      document.querySelector(".timer").style.top = middleY + 10 + "px";
      document.querySelector(".timer").style.left = middleX - 10 + "px";

      document.querySelector(".timer").style.opacity = 1;
      document.querySelector(".timer").style.transition = "500ms ease-in-out";
    });

    zone.addEventListener("mouseout", () => {
      document.querySelector(".timer").style.opacity = 0;
    });
  });
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
              console.log(element);
              if (element.innerHTML === "") {
                const temp = document.createElement("img");
                temp.setAttribute("data-info", id);
                temp.src = div.querySelector("img").getAttribute("src");
                element.appendChild(temp);
                flag = true;
              }
            }
          });
        }
        console.log(selected);
      }
    });
  });
}

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
