const express = require("express");
const app = express();
const port = 3000;
const fetch = require("node-fetch");
const fs = require("fs");

// Setting up database
let db;
let db_array;
fs.readFile("./database/database.json", (err, buffer) => {
    db = JSON.parse(buffer);
    db_array = Object.values(db);
});


app.use(express.static('public'))
app.set('view engine', 'pug')
app.get("/", (req, res) => {
    let params = new URLSearchParams(req.query);
    let books;
    let search = params.get('search');
    if (search) {
        books = db_array.filter(book => {
            return book.author.indexOf(search) != -1;
        }).slice(0, 10);
    } else {
        let random_offset = Math.abs(Math.floor(Math.random() * db_array.length) - 10)
        books = db_array.slice(random_offset, random_offset + 10);
    }


    res.render('index', { books, search })
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

