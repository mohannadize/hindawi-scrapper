# Hindawi Scrapping Project

I started this project to enable the use and download of books from hindawi.org (a free arabic library service).

This project aims to ease the ability to download books from hindawi.org on ebook readers.

## Setting up

Make sure you have nodejs installed on your system, if not, check this link nodejs.org

Clone this git repo then run this command inside

```
npm install
```

## Creating Database json file of categorized books

```
node fetch_database.js
```

## Creating a database json file of all books

```
node non_categorized_fetch.js
```
