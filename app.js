var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

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

app.use('/Auth', authRouter);

var requests = require('./src/routes/theRoutes')(nav);

app.get('/', requests.getHome);
app.get('/About', requests.getAbout);
app.get('/Videos', requests.getVideos);
app.get('/SignUp', requests.getSignUp);
app.get('/SignIn', requests.getSignIn);
app.get('/donate', requests.getDonate);
app.post('/postDonation/:id', requests.postDonation);
app.get('/Profile', requests.getProfile);

app.listen(port, function(err) {
    console.log('running server on port' + port);
});