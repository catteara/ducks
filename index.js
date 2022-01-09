const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const MongoDBStockItUp = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();

const corsOptions = {
    origin: "https://ducks-in-a-row.herokuapp.com/", 
    optionsSuccessStatus: 200
};

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors(corsOptions));

// Set up views to be read with express-js
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', function (req, res) {
    res.render('index', {});
  });

// Start the session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

mongoose
  .connect(MONGODB_URL)
  .then(result => {
    app.listen(PORT, () => {console.log(`listening on port ${PORT}`)});
    //app.listen(process.env.PORT || 5000);
    console.log('connected');
  })
  .catch(err => { console.log(err) });