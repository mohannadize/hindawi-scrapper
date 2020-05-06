const express = require("express");
const app = express();
const port = 3000;
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const baseURL = "https://hindawi.org";

app.get("/", (req, res) => {

});

app.get("/books/", (req, res) => {

});

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

let all_books;
let not_all;
