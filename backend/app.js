const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Post = require('./models/post')

const uri = "mongodb+srv://johndoe:123@cluster0.busdn8d.mongodb.net/node-angular?retryWrites=true&w=majority";

const app = express();

mongoose.connect(uri).then(() => {
  console.log('Connected to database');
}).catch(() => {
  console.log('Connection failed');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested, Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next()
})

app.use((req, res, next) => {
  next()
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    })
  });

})

app.get('/api/posts', (req, res, next) => {
  Post.find().then(document => {
    console.log(document)
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: document
    });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not found !!!' })
    }
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Deleted item' })
  })
})

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: 'Update successful !' })
  })
})

module.exports = app;
