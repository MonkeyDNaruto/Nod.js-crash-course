const Blog = require('../models/blog.js');

const blog_indexs = async (req, res) => {
    const blogs = await Blog.find({}).lean();
    res.render('index', { title: 'Blogs', blogs })
}

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
        console.log(err);
    })
}

const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
          res.render('details', { blog: result, title: 'Blog Details' })
      })
      .catch(err => {
          res.status(404).render('404', {title: 'Blogs not found'})
      })
}

const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create new blog' })
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
}

const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/blogs' })
      })
      .catch(err => {
          console.log(err);
      })
}

module.exports = {
    blog_indexs,
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete
}