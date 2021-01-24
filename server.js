require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');
// db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });
mongoose.connection.on('error', (err) =>
  console.error(`🚫 🙅 🚫 ${err.message} 🚫 🙅 🚫`)
);

// start
const app = express();

// middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// router
app.use('/', router);

// go 🚀
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is ready: http://localhost:${listener.address().port}`);
});