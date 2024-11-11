const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');

const router = require('./router.js');

const port = process.env.PORT || process.env.PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Domomaker';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log(err, ' - Could not connect to database');
    throw err;
  }
});

const app = express();
app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}, '../hosted/`)));
app.use(favicon(`${__dirname}, '../hosted/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  key: 'sessionid',
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  // cookie: {
  //   httpOnly: true,
  // },

}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}, '/../views`);
router(app);
app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Server is running on port ${port}`);
});
