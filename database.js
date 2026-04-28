const fs = require("fs");

const path = "./database.json";

function loadDB() {
  return JSON.parse(fs.readFileSync(path));
}

function saveDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function getID() {
  return Date.now().toString();
}

module.exports = { loadDB, saveDB, getID };