// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
{
    "curly": true,
    "eqeqeq": true,
    "forin": true,
    "immed": true,
    "indent": 4,
    "latedef": true,
    "newcap": true,
    "nonew": true,
    "quotmark": "double",
    "undef": true,
    "unused": true,
    "strict": true,
    "trailing": true,
    "node": true
}

var express = require("express");
var Promise = require('promise');
var Trending = require("github-trend");
var client = new Trending.Client();

var app = express();
app.use(express.static("./"));
var qhTrends = [];


app.get('/trending', function(req, res) {
    // Empty string means 'all languages' 
    client.fetchTrending("").then(function(repos) {
        for (var i = 0; i < 10; i++) {
            var repo = repos[i];
            qhTrends.push({
                repoName: repo.name,
                repoUrl: repo.html_url,
                repoOwner: repo.owner.login,
                repoDescription: repo.description
            });
        }
        res.json(qhTrends);
    }).catch(function(err) {
        console.log(err.message);
        res.send(err.message);
    });
});



app.listen(3000, function() {
    console.log("Server started at localhost:3000 ...");
});