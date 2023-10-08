const { updateTime } = require("./queries");

function update() {
  setTimeout(async function () {
    await updateTime();
    update();
  }, 1000);
}

update();
