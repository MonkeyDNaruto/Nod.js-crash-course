const express = require('express');
const req = require('express/lib/request');
const { get, result } = require('lodash');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const res = require('express/lib/response');
const { param } = require('express/lib/request');
const { render } = require('express/lib/response');

const app = express();

const dbURI = 'mongodb+srv://monkeydnaruto:qwertyuiop@cluster0.vpdd2.mongodb.net/node-tuts?retryWrites=true&w=majority'
const db = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Database connection made');
    })
    .catch((err) => console.log(err));




app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
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
        { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
        { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
        { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
    ];
    res.render('index', { title: 'Home', blogs })
});

app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({}).lean();




    res.render('index', { title: 'Blogs', blogs })
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
});

app.get('/', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/', (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create new blog' })
});
app.post('/blogs', (req, res) => {

    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
          res.render('details', { blog: result, title: 'Blog Details' })
      })
      .catch(err => {
          console.log(err);
      })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/blogs' })
      })
      .catch(err => {
          console.log(err);
      })
})


app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
});

app.listen(3000);