const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());


db.serialize(() => {
  db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, description TEXT, titleColor TEXT)");
  db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY, postId INTEGER, text TEXT)");
});


app.get('/posts', (req, res) => {
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});


app.post('/posts', (req, res) => {
  const { title, description, titleColor } = req.body;
  db.run("INSERT INTO posts (title, description, titleColor) VALUES (?, ?, ?)", [title, description, titleColor], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID });
  });
});


app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.get("SELECT * FROM posts WHERE id = ?", [postId], (err, post) => {
    if (err) return res.status(500).send(err);
    db.all("SELECT * FROM comments WHERE postId = ?", [postId], (err, comments) => {
      if (err) return res.status(500).send(err);
      res.json({ post, comments });
    });
  });
});


app.post('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  db.run("INSERT INTO comments (postId, text) VALUES (?, ?)", [postId, text], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID, text });
  });
});


app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  db.all("SELECT * FROM comments WHERE postId = ?", [postId], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.get('/posts/:id/comments/count', (req, res) => {
  const postId = req.params.id;
  db.get("SELECT COUNT(*) as count FROM comments WHERE postId = ?", [postId], (err, row) => {
    if (err) return res.status(500).send(err);
    res.json({ postId, totalComments: row.count });
  });
});


app.listen(5003, () => {
  console.log('Server is running on http://localhost:5003');
});
