const body = document.body;
let dataToSend = {
  mons: [],
  sell: false,
  confirm: false,
  form: false,
};
let data = {
  stats: [],
  muni: 0,
  percentage: 0,
};
function changeClass() {
  document.getElementById("gear").className = "fa fa-gear fa-spin icons";
}
function changeBack() {
  document.getElementById("gear").className = "fa fa-gear icons";
}
let divs = [];
document.addEventListener("DOMContentLoaded", async () => {
  dataToSend.form = true;
  await fetchData(dataToSend);
  const inv = data;
  console.log(inv);
  if (inv.length > 0) {
    inv.forEach((element) => {
      const div = document.querySelector(
        `img[data-info="${element.id}"]`
      ).parentElement;
      if (div != undefined) {
        div.querySelector("i").style.opacity = 1;
        divs.push(div);
      }
    });
  }
});

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
      dataToSend.form = false;
      dataToSend.mons = dataToSend.mons.splice(dataToSend.mons.length - 1);
      await fetchData(dataToSend);
      document.querySelector(".progress_fill").style.width =
        data.percentage + "%";
      document.querySelector(".progress_text").innerHTML =
        data.percentage + "%";
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
  let toCheck = [];
  if (sel === true) {
    dataToSend.mons = [];
    const selectors = document.querySelectorAll("input[type=checkbox]:checked");
    selectors.forEach((checkbox) => {
      let element = checkbox.parentNode.parentNode;
      toCheck.push(element);
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
    toCheck.push(clicked.parentElement);
  }
  if (dataToSend.mons.length === 1) toCheck.push(clicked.parentElement);
  let ok = false;
  toCheck.forEach((div) => {
    if (divs.includes(div)) ok = true;
  });
  if (ok === true) {
    alert("pokemon is busy!!");
  } else {
    dataToSend.sell = true;
    dataToSend.confirm = false;
    dataToSend.form = false;
    await fetchData(dataToSend);
    document.getElementById("ammount").innerHTML = "($" + data.muni + ")";
    console.log(document.getElementById("showed").getAttribute("src"));
    if (document.getElementById("showed").getAttribute("src") != "") {
      document.getElementById("model").classList.toggle("active");
      document.getElementById("overlay").classList.toggle("active");
    }
  }
});

cancel.addEventListener("click", function () {
  document.getElementById("model").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  dataToSend.mons = [];
});

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

confirm.addEventListener("click", async function () {
  document.getElementById("model").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  dataToSend.confirm = true;
  dataToSend.sell = false;
  dataToSend.form = false;
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
