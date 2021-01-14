const express = require('express')
const path = require('path')
const translate = require("@k3rn31p4nic/google-translate-api")
const got = require('got')
const fetch = require('node-fetch')

const app = express()
const router = express.Router()

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/api/meme', function(req, res) {
  got('https://www.reddit.com/r/memes/random/.json')
    .then(response => {
      const [list] = JSON.parse(response.body)
      const [post] = list.data.children

      const permalink = post.data.permalink;

      res.status(200).json({
        permalink: post.data.permalink,
        url: `https://reddit.com${permalink}`,
        image: post.data.url,
        title: post.data.title,
        upvotes: post.data.ups,
        num_comments: post.data.num_comments,
      });
    })
});

app.get('/api/translate', function(req, res) {
  let text = req.query.text
  let f = req.query.from || "en"
  let t = req.query.to || "th"
  translate(text, { from: f, to: t }).then(rex => {
    res.status(200).json({
      dat: rex.text,
      original: text
    })
  }).catch(err => {
    res.status(200).json({
      dat: `ERROR : ${err}`
    })
  })
});

app.get('/api/chatbot', function(req, res) {
  let name = req.query.name || "lazy"
  let gender = req.query.gender || "Male"
  let user = req.query.user || "1"
  fetch(`http://api.brainshop.ai/get?bid=154238&key=MvagDkWfIBxrOHFM&uid=${user}&msg=${encodeURIComponent(req.query.message)}`)
    .then(res => res.json())
    .then(data => {
      res.status(200).json({
        dat: data.cnt.replace("Aco", name).replace('Acobot Team', '1pixel').replace('Male chatbot', `${gender} chatbot`)
      })
    })
})

app.use('/api', router.get('/'), (req, res) => {
    res.render('api')
})

app.get('*', (req, res) => {
  res.render('404');
})

module.exports = app
