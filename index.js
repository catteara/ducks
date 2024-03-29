const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const MongoDBDucks = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
dotenv.config();
const methodOverride = require('method-override');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;
const store = new MongoDBDucks({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const corsOptions = {
  origin: "https://ducks-in-a-row.herokuapp.com/",
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({
  extended: false
}))
app.use(methodOverride('_method'))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'what the duck duck goose',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

const habitRoutes = require('./controllers/habit')
const agendaRoutes = require('./controllers/agenda')
const todoRoutes = require('./controllers/todo')
const journalRoutes = require('./controllers/journal')
const userRoutes = require('./controllers/auth')
const indexRoutes = require('./controllers/index')
const errorController = require('./controllers/error');

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(flash());

app.use('/habit', habitRoutes)
app.use(agendaRoutes)
app.use('/todo', todoRoutes)
app.use('/journal', journalRoutes)
app.use(userRoutes)
app.use('/', indexRoutes)
app.use(errorController.get404)

const mongoose = require('mongoose');
const req = require('express/lib/request');
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URL)
  .then(result => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Listening on Port")
    });
    console.log('Connected to Mongoose');
  })
  .catch(err => {
    console.log(err)
  });