const express = require('express');
const { get } = require('lodash');

const app = express();

app.listen(3000);

app.get('/', (req, res) => {
    res.sendFile('./text/index.html', { root : __dirname})
});

app.get('/about', (req, res) => {
    res.sendFile('./text/about.html', { root : __dirname})
});

app.get('/about-us', (req, res) => {
    res.redirect('/about')
});

app.use((req, res) => {
    res.status(404).sendFile('./text/404.html', { root : __dirname})
});