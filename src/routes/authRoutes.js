var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var app = express();
var router = function(nav) {
    authRouter.route('/signUp')
        .post(function(req, res) {
            console.log(req.body);
            var url =
                'mongodb://localhost:27017/shul';
            mongodb.connect(url, function(err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user,
                    function(err, results) {
                        req.login(results.ops[0], function() {
                            res.redirect('/profile');
                        });
                    });
            });

        });
    var user;
    authRouter.route('/signIn')
        .post(passport.authenticate('local', {

            failureRedirect: '/signIn'
        }), function(req, res) {
            user = req.user;
            res.redirect('/profile');
        });
    app.use('/profile',
        (req, res, next) => {
            if (!req.user) {
                res.redirect('/');
            }

            next();
        })

    /* app.use('/profile', (req, res) => {

         res.render('user', {
             nav: nav,
             user: req.user
         })
     })*/

    return authRouter;
};
module.exports = router;