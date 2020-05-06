const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const cliProgress = require('cli-progress');
const { hindi_to_arabic, scrape_book_info } = require('./functions');



const startURL = "https://www.hindawi.org/books/";
const baseURL = "https://www.hindawi.org";


let array_promises = [];
let bar1;

fetch(startURL).then(res => res.text()).then(html => {
    let $ = cheerio.load(html);
    let subjects = $(`.subjects li`).map((i, ele) => {
        let href = $(`a`, ele).attr('href');
        let name;
        let nameArabic;
        if (i) {
            name = href.match(/(categories\/+(.+)\/)/i)[2];
            nameArabic = $(`.linkTitle`, ele).text().trim();

        } else {
            name = 'Not categorized';
            nameArabic = 'غير مصنف'
        };
        let books = hindi_to_arabic($('.count', ele).text().trim());
        let pages = Math.ceil(books / 10);
        return { name, nameArabic, href, books, pages }

    }).toArray();

    let total_pages = subjects.reduce((acc, cur) => acc + cur.pages, 0);
    console.log('total number of pages to be downloaded: ', total_pages);

    // create a new progress bar instance and use shades_classic theme
    console.log("fetching pages");
    bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(total_pages, 0);


    subjects.forEach(item => {
        for (let i = 1; i <= item.pages; i++) {
            let url = `${baseURL + item.href}${i}/`;
            array_promises.push(
                fetch(url)
                    .then(res => {
                        bar1.increment();
                        return res.text();
                    }).then(res => [res, { name: item.name, nameArabic: item.nameArabic }]).catch(err => console.log(`\nCould not fetch page ${i}`))
            )
        }
    })
    Promise.all(array_promises).then(res => {
        bar1.stop();


        let books = scrape_book_info(res);
        console.log("Books fetched: ", Object.keys(books).length);

        console.log("Generating JSON file");
        fs.mkdir("./database/", { recursive: true }, (err) => {
            if (!err) {
                fs.writeFile("./database/database.json", JSON.stringify(books), function (err) {
                    if (err) {
                        console.error('An error has occured while saving the file', err)
                    } else {
                        console.log("✔✔ File saved successfully")
                    }
                });
            } else {
                console.error('An error has occured while saving the file', err)
            }
        })
    }).catch((err) => {
        console.log("Please try again later");
        console.error(err);
    })
})