const cheerio = require("cheerio");
const cliProgress = require('cli-progress');

function hindi_to_arabic(string) {
    const map = {
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
        '٠': '0'
    };

    return Number(string.split('').map(s => map[s]).join(''));
}

function scrape_book_info(res) {
    console.log("Scrapping books");
    const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar2.start(res.length, 0);


    let books = {};
    res.forEach(arr => {
        let html = arr[0];
        let subject = arr[1];

        let $ = cheerio.load(html);
        $('.book').map((i, ele) => {
            let title = $("h2", ele).text().trim();
            let author = $(".author", ele).text().trim();
            let description = $(".content", ele).text().trim();
            let poster = $('.cover object', ele).attr("data");
            let id = $(".cta a", ele).attr('href').match(/[0-9]+/)[0];
            let link = `https://www.hindawi.org/books/${id}/`
            let pdf = link.substr(0, link.length - 1) + '.pdf';
            let epub = link.substr(0, link.length - 1) + '.epub';
            let kfx = link.substr(0, link.length - 1) + '.kfx';
            let download = { pdf, epub, kfx };
            let book = { id, title, author, subject, description, poster, link, download };
            if (books[id]) {
                if (subject.name != 'Not categorized') {
                    books[id] = book;
                }
            } else {
                books[id] = book;
            }
        });
        bar2.increment();
    })
    bar2.stop();

    return books;
}


module.exports.scrape_book_info = scrape_book_info;
module.exports.hindi_to_arabic = hindi_to_arabic;