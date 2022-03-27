const express = require('express');
const req = require('express/lib/request');
const { get, result } = require('lodash');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const res = require('express/lib/response');

const app = express();

const dbURI ='mongodb+srv://monkeydnaruto:qwertyuiop@cluster0.vpdd2.mongodb.net/node-tuts?retryWrites=true&w=majority'
const db= mongoose.connect(dbURI,  { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
      console.log('Database connection made');
  })
  .catch((err) => console.log(err));


  console.log(db);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: "about my new blog",
        body: 'more about my new blog'
    });

    blog.save()
     .then((result) => {
         res.send(result)
     })
     .catch((err) => {
         console.log(err);
     });
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
     .then((result) => {
         res.send(result);
     })
     .catch((err) => {
         console.log(err);
     });
})

app.get('/single-blog', (req, res) => {
    Blog.findById()
     .then((result) => {
         res.send(result);
     })
     .catch((err) => {
         console.log(err);
     });
})

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

app.listen(3000);