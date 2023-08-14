const body = document.body;

function changeClass() {
  if (body.classList.contains("light")) {
    document.getElementById("gear").className = "fa fa-gear fa-spin icons";
  } else document.getElementById("gear").className = "fa fa-gear fa-spin icons";
}
function changeBack() {
  if (body.classList.contains("light")) {
    document.getElementById("gear").className = "fa fa-gear icons";
  } else document.getElementById("gear").className = "fa fa-gear icons";
}
function openMenu() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches("#gear")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

const darkButton = document.getElementById("dark");
const lightButton = document.getElementById("light");

darkButton.onclick = () => {
  document.querySelectorAll(".light").forEach((element) => {
    element.classList.replace("light", "dark");
  });
  document.getElementById("gear").className = "fa fa-gear icons";
};

lightButton.onclick = () => {
  document.querySelectorAll(".dark").forEach((element) => {
    element.classList.replace("dark", "light");
  });
  document.getElementById("gear").className = "fa fa-gear icons";
  document
    .getElementById("inv")
    .classList.replace("text-color", "text-color-2");
  document
    .getElementById("game")
    .classList.replace("text-color", "text-color-2");
};

const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");

const counter = document.querySelector(".counter");
counter.id = document.querySelector("pg-nr");

backBtn.onclick = () => {
  let a = parseInt(counter.innerHTML);

  if (a > 1) {
    a--;
  }
  document.querySelectorAll(".pg").forEach((element) => {
    if (element.classList.contains("active-mons"))
      element.classList.replace("active-mons", "inactive");
  });
  let i = 0;
  document.querySelectorAll(".pg").forEach((element) => {
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
  document.querySelectorAll(".pg").forEach((element) => {
    if (element.classList.contains("active-mons"))
      element.classList.replace("active-mons", "inactive");
  });
  let i = 0;
  document.querySelectorAll(".pg").forEach((element) => {
    i++;
    if (i === a) element.classList.replace("inactive", "active-mons");
  });
  counter.innerHTML = a;
};

const gridSlot = document.querySelector(".active-mons");

if (gridSlot) {
  gridSlot.addEventListener("mouseover", function (e) {
    const target = e.target;
    if (target.classList.contains("slot")) {
      target.classList.replace("no-change", "hover");
    }
  });
  gridSlot.addEventListener("mouseout", function (e) {
    const target = e.target;
    if (target.classList.contains("slot")) {
      target.classList.replace("hover", "no-change");
    }
  });
}

const images = document.querySelectorAll(".slot img");
const icon = document.querySelector(".clicked i");
let dataToSend = {
  mons: [],
  sell: false,
  confirm: false,
};
let data = {
  stats: [],
  muni: 0,
};
let clicked;
images.forEach(function (image) {
  image.addEventListener("mouseover", function (e) {
    e.stopPropagation();
    this.parentNode.classList.replace("no-change", "hover");
  });
  image.addEventListener("mouseout", function (e) {
    e.stopPropagation();
    this.parentNode.classList.replace("hover", "no-change");
  });
  image.addEventListener("click", async function (e) {
    if (sel === false) {
      dataToSend.mons = [];
    }
    if (icon != undefined && icon.classList.contains("active"))
      icon.classList.replace("active", "inactive");
    let img = document.getElementById("showed");
    if (img) {
      img.src = image.getAttribute("src");
      clicked = image;
      temp = {
        img: img.getAttribute("src"),
        id: image.getAttribute("data-info"),
      };
      dataToSend.mons.push(temp);
      console.log(dataToSend.mons);
      if (sel === true) {
        if (
          this.parentNode.querySelector(".checkbox").querySelector("input")
            .checked === true
        )
          this.parentNode
            .querySelector(".checkbox")
            .querySelector("input").checked = false;
        else {
          this.parentNode
            .querySelector(".checkbox")
            .querySelector("input").checked = true;
        }
      }
    }
    if (img.classList.contains("inactive")) img.classList.remove("inactive");

    if (img.getAttribute("src") == undefined) return;
    else {
      dataToSend.confirm = false;
      dataToSend.sell = false;
      dataToSend.mons = dataToSend.mons.splice(dataToSend.mons.length - 1);
      await fetchData(dataToSend);
      console.log(data);
      chart.data.datasets[0].data = data.stats;
      chart.update();
    }
  });
});

const card = document.querySelector(".clicked");

document.addEventListener("mousemove", (e) => {
  rotateCard(e, card);
});

function rotateCard(event, element) {
  const x = event.clientX;
  const y = event.clientY;

  const rect = card.getBoundingClientRect();

  const middleX = rect.left + rect.width / 2 + window.scrollX;
  const middleY = rect.top + rect.height / 2 + window.scrollY;

  const offsetX = ((x - middleX) / middleX) * 45;
  const offsetY = ((y - middleY) / middleY) * 45;

  element.style.setProperty("--rotateX", -1 * offsetY + "deg");
  element.style.setProperty("--rotateY", offsetX + "deg");
}

const sell = document.getElementById("sell");
const cancel = document.getElementById("cancel");
const confirm = document.getElementById("confirm");

let balance = document.getElementById("balance").innerHTML;
balance = parseFloat(balance.slice(1, balance.length));
let sel = false;
sell.addEventListener("click", async function () {
  if (sel === true) {
    dataToSend.mons = [];
    const selectors = document.querySelectorAll("input[type=checkbox]:checked");
    selectors.forEach((checkbox) => {
      let element = checkbox.parentNode.parentNode;
      const obj = {
        img: element.querySelector("img").getAttribute("src"),
        id: element.querySelector("img").getAttribute("data-info"),
      };
      dataToSend.mons.push(obj);
    });
    console.log(dataToSend.mons);
  }
  if (dataToSend.mons.length === 0) {
    const obj = {
      img: clicked.getAttribute("src"),
      id: clicked.getAttribute("data-info"),
    };
    dataToSend.mons.push(obj);
  }
  dataToSend.sell = true;
  dataToSend.confirm = false;
  await fetchData(dataToSend);
  document.getElementById("ammount").innerHTML = "($" + data.muni + ")";
  console.log(document.getElementById("showed").getAttribute("src"));
  if (document.getElementById("showed").getAttribute("src") != "") {
    document.getElementById("model").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
  }
});

cancel.addEventListener("click", function () {
  document.getElementById("model").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  dataToSend.mons = [];
});

confirm.addEventListener("click", async function () {
  document.getElementById("model").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  dataToSend.confirm = true;
  dataToSend.sell = false;
  balance += parseFloat(data.muni);
  document.getElementById("balance").innerHTML = "$" + balance;
  document.getElementById("showed").classList.add("inactive");
  icon.classList.replace("inactive", "active");
  chart.data.datasets[0].data = [];
  chart.update();
  dataToSend.mons.forEach((mon) => {
    const image = document.querySelector(`img[data-info="${mon.id}"]`);
    image.parentNode.innerHTML = "";
  });
  await fetchData(dataToSend);

  dataToSend.mons = [];
});

const select = document.getElementById("select-to-sell");
select.addEventListener("click", async function () {
  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.classList.toggle("invisible");
    if (checkbox.classList.contains("invisible")) sel = false;
    else sel = true;
  });
  document.querySelectorAll(".check").forEach((checkbox) => {
    checkbox.classList.toggle("invisible");
    if (sel === false) checkbox.checked = false;
  });
  document.querySelectorAll(".svgs").forEach((svg) => {
    svg.classList.toggle("invisible");
  });
  dataToSend.mons = dataToSend.mons.splice(dataToSend.mons.length - 1);
});

let chart = document.getElementById("statsChart");
let stats = {
  labels: ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"],
  datasets: [
    {
      label: "Stats",
      data: [],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgb(54, 162, 235)",
      pointBackgroundColor: "rgb(54, 162, 235)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(54, 162, 235)",
    },
  ],
};
chart = new Chart(chart, {
  type: "radar",
  data: stats,
  options: {
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    scales: {
      r: {
        max: 180,
        angleLines: {
          color: "#ed4c5c",
        },
        grid: {
          color: "#ed4c5c",
        },
        ticks: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  },
});

async function fetchData(obj) {
  if (data.img == "unknown") return;
  const response = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: dataToSend,
    }),
  });
  data = await response.json();
}
