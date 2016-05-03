
// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";
var  mongoose = require("mongoose");

// Mongoose model for todos
var UserSchema = mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    itemsPinned: {
    	usernme : {type: String},
    	url: {type: String}
    }
});

var User = mongoose.model("User", UserSchema);

//Exporting model
module.exports = User;