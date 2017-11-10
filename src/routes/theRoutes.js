var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var requests = function(nav) {
    //var url = 'mongodb://localhost:27017/shul';
    var url = 'mongodb://127.0.0.1:27017/shul';
    var getHome = (req, res) => {
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

    };
    var getAbout = (req, res) => {
        res.render('aboutView', { nav: nav });
    };
    var getVideos = (req, res) => {
        mongodb.connect(url, function(err, db) {
            var collection = db.collection('videos');
            collection.find({}).toArray((err, results) => {
                res.render('videoView', {
                    nav: nav,
                    videos: results
                });
            });
        });
    };

    var getSignUp = (req, res) => {
        res.render('signUpView', { nav: nav });
    };

    var getSignIn = (req, res) => {
        res.render('signInView', { nav: nav });
    };

    var getDonate = (req, res) => {
        res.render('donate', {
            nav: nav,
            user: req.user
        })
    };

    var postDonation = (req, res) => {
        var id = req.params.id ? new objectId(req.params.id) : null,
            type = req.body.type,
            amount = +req.body.amount;
        date = new Date();


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
        if(type==="building"){
 mongodb.connect(url, function(err, db) {
            var collection = db.collection('building');
            var fundsId = new objectId("59270706fc6e76562873ef78");
            collection.update({ _id : fundsId}, {$inc: {funds: amount}})
           });
        }
    };

    var getProfile = (req, res) => {
        res.render('user', {
            nav: nav,
            user: req.user
        })

    };

    return {
        getHome: getHome,
        getAbout: getAbout,
        getVideos: getVideos,
        getSignUp: getSignUp,
        getSignIn: getSignIn,
        getDonate: getDonate,
        postDonation: postDonation,
        getProfile: getProfile

    };
};
module.exports = requests;