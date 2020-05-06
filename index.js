const express = require("express");
const app = express();
const port = 3000;
const fetch = require("node-fetch");


app.set('view engine', 'pug')

app.get("/", (req, res) => {
    res.render('index', { title: 'Hey', list: ['poop', 'peep', 'paap'] })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

