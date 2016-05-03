    // Client-side code
    /* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
    // Server-side code
    /* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
    /*{
            "curly" : true,
            "eqeqeq" : true,
            "forin" : true,
            "immed" : true,
            "indent" : 4,
            "latedef" : true,
            "newcap" : true,
            "nonew" : true,
            "quotmark" : "double",
            "undef" : true,
            "unused" : true,
            "strict" : true,
            "trailing" : true,
            "node" : true
        }*/
    var express = require("express");
    var Trending = require("github-trend");
    var scraper = new Trending.Scraper();
    var mongoose = require("mongoose");
    var http = require("http");
    var UsersController = require("./controller/users_controller.js");

    var app = express();
    app.use(express.static("./"));



    app.get('/trending', function(req, res) {
        var qhTrends = [];
        // Empty string means 'all languages' 
        scraper.scrapeTrendingRepos("").then(function(repos) {
            for (var i = 0; i < 5; i++) {
                var repo = repos[i];
                qhTrends.push({
                    repoName: repo.name,
                    repoOwner: repo.owner,
                    repoUrl: "https://github.com/" + repo.owner + "/" + repo.name,
                    repoownerUrl: "https://github.com/" + repo.owner
                });
            }
            res.json(qhTrends);
        }).catch(function(err) {
            console.log(err.message);
            res.send(err.message);
        });
    });


    app.get("/login/:user/:password", function(req, res) {
        UsersController.login(req, res);
    });

    app.get('/signup/:user/:password', function(req, res) {
        UsersController.signup(req, res);
    });

    app.get('/addtopins/:login/:user', function(req, res){
        UsersController.addtopins(req, res);
    });

    app.get("/pinned/:user", function(req, res){
        console.log("in server");
        UsersController.getpins(req, res);
    });


    app.listen(3000, function() {
        console.log("Server started at localhost:3000 ...");
        mongoose.connect("mongodb://localhost/quickhub");
    });