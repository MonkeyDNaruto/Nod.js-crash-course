const express = require('express');
const req = require('express/lib/request');
const { get } = require('lodash');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("New request made:");
    console.log("host:", req.hostname);
    console.log("path:", req.path);
    console.log("method:", req.method);
    next();
});

app.use((req, res, next) => {
    console.log("In the next middleware");
    next();
});

app.get('/', (req, res) => {
    const blogs = [
        {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
        {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
        {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
    ];
    res.render('index', { title : 'Home', blogs})
});

app.get('/about', (req, res) => {
    res.render('about', { title : 'About'})
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title : 'Create new blog'})
});

app.use((req, res) => {
    res.status(404).render('404', { title : '404'})
});