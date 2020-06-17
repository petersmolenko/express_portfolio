const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session')
const app = express();
const config = require('./config')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'loftschool',
  key: 'sessionkey',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 10 * 60 * 1000
  },
  saveUninitialized: false,
  resave: false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes'))

app.use(function (req, res, next) {
  var err = new Error('Вы заблудились!')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', { error: `${err.status}. ${err.message}` })
})

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`> Ready On Server http://localhost:${server.address().port}`)
})