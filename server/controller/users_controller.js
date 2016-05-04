// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";
var User = require("../model/users.js");
var UsersController = {};


//Controller method for finding todos from database
UsersController.login = function(req, res) {

    User.findOne({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result === null) {
                console.log("201");
                res.sendStatus(201);
            } else {

                if (result.password === req.params.password) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(201);
                }
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
                res.sendStatus(201);
            } else {
                newUser.save(function(err) {
                    if (err !== null) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log("User added to db");
                        res.sendStatus(200);
                    }
                });
            }
        }
    });
};

UsersController.addtopins = function(req, res) {

    User.findOne({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result === null) {
                res.sendStatus(201);
            } else {

                User.update({
                        name: req.params.user
                    }, {
                        $addToSet: {
                            "itemsPinned": {
                                "usernme": req.params.login,
                                "url": "https://www.github.com/" + req.params.login
                            }
                        }
                    },
                    function(err) {
                        if (err) {
                            console.log(err);
                        } else {

                            User.findOne({
                                name: req.params.user
                            }, function(err, result) {
                                if (err !== null) {
                                    console.log(err);
                                    res.send(err);
                                } else {
                                    if (result === null) {
                                        res.sendStatus(201);
                                    } else {
                                        if (result.itemsPinned === "") {
                                            res.sendStatus(201);
                                        } else {
                                            console.log("Item Pinned")
                                            res.json(result.itemsPinned);
                                        }
                                    }
                                }
                            });
                            console.log("Value entered");
                        }
                    });
            }
        }
    });

};



UsersController.getpins = function(req, res) {
    User.findOne({
        name: req.params.user
    }, function(err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            if (result === null) {
                console.log("201");
                res.sendStatus(201);
            } else {
                if (result.itemsPinned === "") {
                    res.sendStatus(201);
                } else {
                    res.json(result.itemsPinned);
                }
            }
        }
    });
};




module.exports = UsersController;