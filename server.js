var express = require("express");
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var scrapper = require('./scrapper')

var app = express();

// allow access from POST data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// connect to mongo db
mongoose.connect(
    'mongodb://localhost/MyCCTV',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);
var db = mongoose.connection;

if(!db)
    console.log("[Database] error connecting")
else
    console.log("[Database] connected successfully")

// setup routing
var apiRoutes = require('./api/routes/cameraRoute')
app.use('/api', apiRoutes);
app.use('/api/images', express.static(config.saveLocation))


// start server
app.listen(config.port, function(){
    console.log(`[Webserver] live @ localhost:${config.port}/api`);
});

// start scrapping
var s = new scrapper.Scrapper();
console.log('[Scrapper] now capturing feeds');
s.start();
