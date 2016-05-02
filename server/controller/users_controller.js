// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";
var User = require("../model/users.js");
var http = require("http");
var UsersController = {};


//Controller method for finding todos from database
UsersController.login = function(req, res) {
    console.log(req.params.user);
    User.findOne({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result == null) {
                console.log("201");
                res.sendStatus(201);
            } else {
                console.log(result);
                console.log(result.password);
                res.sendStatus(200);
            }
        }
    });
};


UsersController.signup = function(req, res) {
    var newUser = new User({
        "name": req.params.user,
        "password": req.params.password,
        "itemsPinned": ""
    });

    User.find({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result.length) {
                console.log("201");
                res.sendStatus(201);
            } else {
                newUser.save(function(err) {
                    if (err !== null) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log("User added to db")
                        res.sendStatus(200);
                    }
                })
            }
        }
    })
};

UsersController.addtopins = function(req, res){

};


module.exports = UsersController;