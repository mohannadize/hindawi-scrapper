const fs = require('fs');


fs.readFile('./database/non_categorized_database.json', (err, data) => {
    if (err) throw err;
    let all_books = JSON.parse(data);
    fs.readFile('./database/categorized_database.json', (err, data) => {
        if (err) throw err;
        let not_all = JSON.parse(data);
        let not_categorized = Object.values(all_books).filter(book => {
            return !Boolean(not_all[book.id]);
        });
        not_categorized.forEach(book => {
            not_all[book.id] = {
                ...book,
                subject: {
                    name: "Not Categorized",
                    nameArabic: "غير مصنف"
                }
            }
        })
        fs.mkdir("./database/", { recursive: true }, (err) => {
            if (!err) {
                fs.writeFile("./database/combined_database.json", JSON.stringify(not_all), function (err) {
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
    });
});