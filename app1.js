var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;

var port = 5000;

var nav = [
    { Link: '/', Text: 'Home' },
    { Link: '/About', Text: 'About' },
    { Link: '/Videos', Text: 'Videos' },
    { Link: '/SignUp', Text: 'Sign Up' },
    { Link: '/SignIn', Text: 'Sign In' },
    { Link: '/Donate', Text: 'Donate' },
    { Link: '/Admin', Text: 'Admin' }
];
//var bookRouter = require('./src/routes/bookRoutes')(nav);
//var adminRouter = require('./src/routes/AdminRoutes')(nav);
var authRouter = require('./src/routes/AuthRoutes')(nav);
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.locals.title = 'Shul';
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser);
app.use(session({
    secret: 'shul',
    resave: false,
    saveUninitialized: false
}));
require('./src/config/passport')(app);
//app.use('/Books', bookRouter);
//app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);
app.get('/', (req, res) => {
    //var url = 'mongodb://localhost:27017/shul';
    var url = 'mongodb://127.0.0.1:27017/shul';
    mongodb.connect(url, function(err, db) {
        var collection = db.collection('building');
        collection.findOne({},
            ((err, results) => {
                res.render('index', {
                    nav: nav,
                    funds: results,
                    user: req.user
                });
            }));
    });

});
app.get('/About', (req, res) => {
    res.render('aboutView', { nav: nav });
});
app.get('/Videos', (req, res) => {
    var url = 'mongodb://localhost:27017/shul';
    mongodb.connect(url, function(err, db) {
        var collection = db.collection('videos');
        collection.find({}).toArray((err, results) => {
            res.render('videoView', {
                nav: nav,
                videos: results
            });
        });
    });

});
app.get('/SignUp', (req, res) => {
    res.render('signUpView', { nav: nav });
})
app.get('/SignIn', (req, res) => {
    res.render('signInView', { nav: nav });
})

app.get('/donate', (req, res) => {

    res.render('donate', {
        nav: nav,
        user: req.user
    })
})
app.post('/postDonation/:id', (req, res) => {
    var id = req.params.id ? new objectId(req.params.id) : null,
        type = req.body.type,
        amount = req.body.amount;
    date = new Date();
    var url = 'mongodb://localhost:27017/shul';

    mongodb.connect(url, function(err, db) {
        var collection = db.collection('users');
        //db.users.update({ "_id" : ObjectId("593cb36f63197c2bf08e1df1")},{ $push: { "donations": { "type":"seforim","amount":200}}}, {upsert: true })         
        collection.update({ _id: id }, { $push: { donations: { type: type, amount: amount, date: date.toDateString() } } }, { upsert: true })
        collection.findOne({ _id: id }, (err, results) => {
            res.render('user', {
                nav: nav,
                user: results
            });
        })
    });

})
app.get('/profile', (req, res) => {


    res.render('user', {
        nav: nav,
        user: req.user
    })

})
app.listen(port, function(err) {
    console.log('running server on port' + port);
});