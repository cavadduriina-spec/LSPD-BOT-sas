const fs = require("fs");
const path = "./database.json";

function loadDB() {
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function getAgent(db, id) {
    if (!db.agents[id]) {
        db.agents[id] = {
            ore: 0,
            inServizio: false,
            entrata: null,
            stats: {
                arresti: 0,
                multe: 0,
                sequestri: 0,
                pda: 0,
                denunce: 0
            }
        };
    }
    return db.agents[id];
}

function getPerson(db, k) {
    if (!db.persons[k]) {
        db.persons[k] = {
            fedina: [],
            multe: [],
            denunce: [],
            sequestri: [],
            pda: null
        };
    }
    return db.persons[k];
}

module.exports = { loadDB, saveDB, getAgent, getPerson };