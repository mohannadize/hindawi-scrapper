const express = require("express");
const app = express();
const port = 3000;
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const baseURL = "https://hindawi.org";

app.get("/", (req, res) => {
    let categories = {};
    fetch(`${baseURL}/books/`)
        .then(res => res.text())
        .then(html => {
            // console.log($('.book h2').text())
            const $ = cheerio.load(html);

            $('.subjects li').map((i, ele) => {
                // debugger;
                let name = $(".linkTitle", ele).text().trim();
                let url = `${baseURL}${$('a', ele).attr('href')}`;
                categories[i] = { name, url };
            });
            res.send(JSON.stringify(categories));
        })
});

app.get("/books/", (req, res) => {
    let books = {};
    fetch("https://www.hindawi.org/books/")
        .then(res => res.text())
        .then(html => {
            // console.log($('.book h2').text())
            const $ = cheerio.load(html);

            $('.book').map((i, ele) => {
                // debugger;
                let title = $("h2", ele).text().trim();
                let author = $(".author", ele).text().trim();
                let description = $(".content", ele).text().trim();
                let link = "https://www.hindawi.org" + $(".cta a").attr("href");
                // https://www.hindawi.org/books/82727906.epub
                let pdf = link.substr(0, link.length - 1) + '.pdf';
                let epub = link.substr(0, link.length - 1) + '.epub';
                let download = { pdf, epub };
                let book = { title, author, description, link, download };
                books[i] = book;
            });
            res.send(JSON.stringify(books));
        })
});
// app.get('/', (req, res) => {
//     res.send("poop")
// })

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))