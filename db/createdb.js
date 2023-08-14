const fs = require("fs");
const path = require("path");

const { runQuery } = require("../queries");

fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8")
  .split("\n\n")
  .filter((query) => query.length != 0)
  .forEach((query) => {
    runQuery(query, (data) => {
      console.log(data);
    });
  });


