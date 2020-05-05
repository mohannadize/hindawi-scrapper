const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const cliProgress = require('cli-progress');

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// const baseURL = "https://hindawi.org";

let books = {};
let array_promises = [];
for (let i = 1; i < 192; i++) {
    array_promises.push(
        fetch("https://www.hindawi.org/books/" + i + "/")
            .then(res => {
                // console.log(`page ${i} fetched successfully`)
                bar1.increment();
                return res.text();
            }).catch(err => console.log(`could not fetch page ${i}`))
    )
}
bar1.start(array_promises.length, 0);


Promise.all(array_promises).then(res => {
    bar1.stop();

    console.log("Pages: ", res.length);

    res.forEach(html => {
        let $ = cheerio.load(html);
        $('.book').map((i, ele) => {
            let title = $("h2", ele).text().trim();
            let author = $(".author", ele).text().trim();
            let description = $(".content", ele).text().trim();
            let poster = $('.cover object').attr("data");
            let id = $(".cta a", ele).attr('href').match(/[0-9]+/)[0];
            let link = "https://www.hindawi.org" + $(".cta a").attr("href");
            let pdf = link.substr(0, link.length - 1) + '.pdf';
            let epub = link.substr(0, link.length - 1) + '.epub';
            let download = { pdf, epub };
            let book = { id, title, author, description, poster, link, download };
            // console.log(id, title);
            books[id] = book;
        });
    })
    console.log("Books fetched: ", Object.keys(books).length);
    fs.writeFile("./books_testing.json", JSON.stringify(books), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
})

