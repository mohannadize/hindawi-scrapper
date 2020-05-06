const express = require("express");
const app = express();
const port = process.env.port || 3000;
const fetch = require("node-fetch");
const { fetch_database } = require("./fetch_database");
const fs = require("fs");

// Setting up database
let db = {};
let db_array = [];
fs.readFile("./database/database.json", (err, buffer) => {
    if (err) {
        fetch_database().then(() => {
            fs.readFile("./database/database.json", (err, buffer) => {
                if (!err) {
                    db = JSON.parse(buffer);
                    db_array = Object.values(db);
                }
            });
        })
    } else {
        db = JSON.parse(buffer);
        db_array = Object.values(db);
    }
});


app.use(express.static('public'))
app.set('view engine', 'pug')
app.get("/", (req, res) => {
    let books;
    let search = req.params.search || false;
    if (search) {
        books = db_array.filter(book => {
            return book.author.indexOf(search) != -1 || book.title.indexOf(search) != -1 || book.description.indexOf(search) != -1;
        }).slice(0, 10);
    } else {
        let random_offset = Math.abs(Math.floor(Math.random() * db_array.length) - 10)
        books = db_array.slice(random_offset, random_offset + 10);
    }


    res.render('index', { books, search })
});

app.get("/category/*", (req, res) => {
    let category = req.url.match(/category\/([\w\.]+)\/*(\d+)*/i)[1];
    let page = req.url.match(/category\/([\w\.]+)\/*(\d+)*/i)[2] || 1;
    let books = db_array.filter(book => book.subject.name == category);
    let search = req.params.search || false;
    if (search) {
        books = books.filter(book => {
            return book.author.indexOf(search) != -1 || book.title.indexOf(search) != -1 || book.description.indexOf(search) != -1;
        }).slice(0, 10);
    } else {
        let random_offset = Math.abs(Math.floor(Math.random() * books.length) - 10)
        books = books.slice(random_offset, random_offset + 10);
    }


    res.render('index', { books, search })
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

