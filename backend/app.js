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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
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

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Deleted item' })
  })
})

module.exports = app;
