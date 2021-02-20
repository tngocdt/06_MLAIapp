var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());
// app.all('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next()
//   });


var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
// use body-parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
bodyParser.Promise=global.Promise;

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

var passport = require('passport');
var flash = require('connect-flash');

// const mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true);
// var configDB = require('./config/database.js');
// connect to mongodb
// mongoose.connect(configDB.cnnMongooseDB.cnnDB, { useNewUrlParser: true });

// mongoose.Promise = global.Promise;

// require('./config/passport')(passport); // pass passport for configuration

// static files;
// app.use(express.static('public'));
app.use(express.static( path.join(__dirname, 'public')));
// setup the template engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine','ejs');


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// ****************************************************************************************************
// ****************************************************************************************************
// initialize routes
app.use('/', require('./routes/approute'));
require('./routes/apiroute')(app);
require('./routes/esp8266route')(app);

app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    // res.status(422).send({error: err.message});
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

// ****************************************************************************************************
// ****************************************************************************************************

// listen to port
var server = app.listen(1024, function(){
    console.log('You are connected to server port 1024!');
});

exports = module.exports = app;