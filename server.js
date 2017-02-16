const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// heroku set port, als we dit lokaal doen, moet het 3000 kiezen
const port = process.env.PORT || 3000;

//middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// registering middleware
// app.use((req, res, next) => {
//   // will only run once next() is run
//   next();
// });

// maintenance

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'maintenace'
//   });
//   // no next(); cuz need to stop everything after from exectuing.
// });

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now} : ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + "\n", (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects!'
  })
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
  // res.send({
  //   name: 'Dries',
  //   likes: [
  //     'Magic', 'Cities'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'sup dawg'
  });
});

app.get('/about', (req, res) => {
  // res.send('About page.');
  res.render('about.hbs', {
    pageTitle: 'About page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errormsg: 'Unable to handle request'
  });
});

// heroku env variable -> heroku set deze
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
