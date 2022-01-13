const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const MongoDBDucks = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
dotenv.config();
const methodOverride = require('method-override')

const corsOptions = {
    origin: "https://ducks-in-a-row.herokuapp.com/", 
    optionsSuccessStatus: 200
};

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

// Set up views to be read with express-js
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts);

// Import Necessary Routes
const indexRoutes = require('./routes/index')
const journalRoutes = require('./routes/journal')
app.use('/', indexRoutes)
app.use('/journal',journalRoutes)


// Start the session
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(flash());

// Set up Databade
const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URL)
  .then(result => {
    app.listen(PORT, () => {console.log(`Listening on Port ${PORT}`)});
    //app.listen(process.env.PORT || 5000);
    console.log('Connected to Mongoose');
  })
  .catch(err => { console.log(err) });