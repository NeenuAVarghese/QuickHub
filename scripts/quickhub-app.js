	var app = angular.module('QuickHub', ['ngStorage']);

	app.controller('gitHubDataController', ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {

	    $scope.$storage = $localStorage.$default({
	        user: "",
	        iflogged: false
	    });
	    console.log($localStorage);
	    $scope.userlgdin = $localStorage.user;
	    $scope.logincntrl = $localStorage.iflogged;
	    $scope.functionalities = [{
	        "id": 0,
	        "name": "Home",
	        "glyphicon": "glyphicon glyphicon-home glyph-white"
	    }, {
	        "id": 1,
	        "name": "Repositories",
	        "glyphicon": "glyphicon glyphicon-folder-open glyph-white"
	    }, {
	        "id": 2,
	        "name": "Contributions",
	        "glyphicon": "glyphicon glyphicon-education glyph-white"
	    }, {
	        "id": 3,
	        "name": "Trending",
	        "glyphicon": "glyphicon glyphicon-eye-open glyph-white"
	    }, {
	        "id": 4,
	        "name": "Pinned",
	        "glyphicon": "glyphicon glyphicon-pushpin glyph-white"
	    }];

	    $scope.trendingRepoInfo = [];
	    $scope.languages = [];
	    $scope.currentDiv = 0;
	    $scope.qhinvalidusername = true;
	    $scope.alertmsg = "";

	    $scope.qhconfig = {
	        title: 'Products',
	        tooltips: true,
	        labels: false,
	        mouseover: function() {},
	        mouseout: function() {},
	        click: function() {},
	        legend: {
	            display: true,
	            //could be 'left, right'
	            position: 'right'
	        }
	    };

	    function qhSetCurrentDiv(divId) {
	        angular.element('#d' + $scope.currentDiv).addClass("toggleDiv"); //add
	        angular.element('#d' + divId).removeClass("toggleDiv"); //remove
	        $scope.currentDiv = divId;
	    }

	    function qhsetUserInfo() {
	        $scope.qhUsername = "";
	        angular.element('#d' + $scope.currentDiv).addClass("toggleDiv");
	        $scope.currentDiv = 5;
	        angular.element('#d5').removeClass("toggleDiv");
	        qhLoadRepos();
	    }

	    function setDefaultDiv() {
	        $scope.handleDiv0 = true;
	    }

	    function qhSetlang() {
	        $scope.languages = [];
	        $scope.repoData.forEach(function(repo) {
	            lang_url = repo.languages_url;
	            $http.get(lang_url)
	                .then(function(data) {
	                    $scope.languages.push({
	                        id: repo.name,
	                        langData: data.data
	                    });
	                }, function() {
	                    console.log("Error in getting Lang data");
	                });
	        });
	    }

	    function qhLoadRepos() {
	        $http.get($scope.userData.data.repos_url)
	            .then(function(data) {
	                $scope.repoData = data.data;
	                qhSetlang();
	            }, function() {
	                console.log("Repo data Not Found !");
	            });
	    }

	    function qhGetUserInfo() {
	        $http.get("https://api.github.com/users/" + $scope.qhUsername)
	            .then(function(data) {
	                $scope.userData = data;
	                $scope.qhUsername = "";
	                $scope.qhinvalidusername = true;
	                qhsetUserInfo();
	            }, function() {
	                $scope.qhinvalidusername = false;
	                angular.element('#d' + $scope.currentDiv).addClass("toggleDiv"); //add
	                angular.element('#d0').removeClass("toggleDiv"); //remove
	            });
	    }

	    function qhGetTrending() {
	        $scope.trending = [];
	        $http.get('/trending')
	            .success(function(data) {
	                $scope.trending = data;
	            })
	            .error(function(err) {
	                console.log('Error: ' + err);
	            });
	    }

	    function userlogin() {
	        $http.get("/login/" + $scope.qhusernamelgn + "/" + $scope.qhpasswrdlgn)
	            .success(function(data, status) {
	                console.log(status);
	                if (status === 200) {
	                    angular.element("#loginfooter").addClass("toggleDiv");
	                    angular.element("#loginclose").trigger('click');
	                    $localStorage.user = $scope.qhusernamelgn;
	                    $localStorage.iflogged = true;
	                    $scope.userlgdin = $localStorage.user;
	                    $scope.logincntrl = true;
	                } else if (status === 201) {
	                    angular.element("#loginfooter").removeClass("toggleDiv");
	                    $scope.alertmsg = "Error: Error in Username or password";
	                }
	            })
	            .error(function(err) {
	                $scope.alertmsg = "Error: " + err;
	                angular.element("#loginfooter").removeClass("toggleDiv");
	            });
	    }

	    function userSignUp() {
	        $http.get("/signup/" + $scope.qhusernamesgnUp + "/" + $scope.qhpasswrdsgnUp)
	            .success(function(data, status) {
	                if (status === 200) {
	                    angular.element("#signupfooter").addClass("toggleDiv");
	                    angular.element("#signupclose").trigger('click');
	                    $localStorage.user = $scope.qhusernamesgnUp;
	                    $localStorage.iflogged = true;
	                    $scope.userlgdin = $localStorage.user;
	                    $scope.logincntrl = true;

	                } else if (status === 201) {
	                    angular.element("#signupfooter").removeClass("toggleDiv");
	                    $scope.alertmsg = "Error: User exists";
	                }
	            })
	            .error(function(err, status) {
	                $scope.alertmsg = "Error: " + err;
	                angular.element("#signupfooter").removeClass("toggleDiv");

	            })
	    }

	    function logoutcntrl(){
	    	 $scope.logincntrl = false;
	    	 $scope.userlgdin = "";
	    	 $localStorage.$reset({
				    name: "",
				    iflogged : false
				});
	    }


	    function addtopins(){
	    	console.log("out");
	    	if($localStorage.name === ""){
	    		console.log("in");
	    		angular.element("#alertLogin").removeClass("toggleDiv");
	    	}
	    	else{
	    		angular.element("#alertLogin").addClass("toggleDiv");
	    		$http.get("/addtopins/"+$scope.userData.data.html_url+"/"+$scope.userData.data.login+"/"+$scope.userlgdin)
	    		.success(function(data, status){

	    		})
	    		.error(function(data, status){

	    		})
	    	}
	    }



	    qhGetTrending();
	    $scope.qhGetUserInfo = qhGetUserInfo;
	    $scope.qhSetCurrentDiv = qhSetCurrentDiv;
	    $scope.setDefaultDiv = setDefaultDiv;
	    $scope.qhGetTrending = qhGetTrending;
	    $scope.userlogin = userlogin;
	    $scope.userSignUp = userSignUp;
	    $scope.logoutcntrl = logoutcntrl;
	    $scope.addtopins = addtopins;

	}]);


	app.directive('qhLangviz', [

	    function() {
	        return {
	            restrict: 'E',
	            link: function($scope, element) {

	                var dataset = [];
	                var margin = {
	                    top: 70,
	                    right: 20,
	                    bottom: 60,
	                    left: 100
	                };
	                var w = 600 - margin.left - margin.right;
	                var h = 500 - margin.top - margin.bottom;

	                //Create SVG element
	                var svg = d3.select(element[0])
	                    .append("svg")
	                    .attr("width", w + margin.left + margin.right)
	                    .attr("height", h + margin.top + margin.bottom);

	                // define the x scale
	                var xScale = d3.scale.ordinal()
	                    .domain(dataset.map(function(d) {
	                        return d.key;
	                    }))
	                    .rangeRoundBands([margin.left, w], 0.05);

	                // define the x axis
	                var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	                // define the y scale
	                var yScale = d3.scale.linear()
	                    .domain([0, d3.max(dataset, function(d) {
	                        return d.value;
	                    })])
	                    .range([h, margin.top]);

	                // define the y axis
	                var yAxis = d3.svg.axis().scale(yScale).orient("left");

	                // draw the x axis
	                svg.append("g")
	                    .attr("class", "xaxis")
	                    .attr("transform", "translate(0," + h + ")")
	                    .call(xAxis);

	                // draw the y axis
	                svg.append("g")
	                    .attr("class", "yaxis")
	                    .attr("transform", "translate(" + margin.left + ",0)")
	                    .call(yAxis);

	                // add the x axis label
	                svg.append("text")
	                    .attr("class", "x axis label")
	                    .attr("text-anchor", "middle")
	                    .attr("transform", "translate(" + (w / 2) + "," + (h + (margin.bottom / 2) + 10) + ")")
	                    .text("Language");

	                // add the y axis label
	                svg.append("text")
	                    .attr("class", "y axis label")
	                    .attr("text-anchor", "middle")
	                    .attr("transform", "translate(15," + (h / 2) + ")rotate(-90)")
	                    .text("Number of characters");


	                // add a title to the chart
	                svg.append("text")
	                    .attr("class", "chartTitle")
	                    .attr("text-anchor", "middle")
	                    .attr("transform", "translate(" + (w / 2) + ",20)")
	                    .text("GitHub Repo");


	                function showLangs(data, status, repo) {
	                    console.log("in show");

	                    // setup empty dataset array variable for d3
	                    var dataset = [];

	                    // loop through data object and append items to li
	                    for (var key in data) {
	                        if (data.hasOwnProperty(key)) { // ensure it is key from data, not prototype being used

	                            // code to display language counts as list - not used at moment
	                            // $("#langDetails").append("<li>" + key + ": " + data[key] + "</li>");

	                            // push items into dataset array
	                            var item = new Object();
	                            item.key = key;
	                            item.value = data[key];
	                            dataset.push(item);
	                        };
	                    };
	                    console.log(dataset); // for checking

	                    // update the d3 chart

	                    // update the x scale
	                    xScale.domain(dataset.map(function(d) {
	                            return d.key;
	                        }))
	                        .rangeRoundBands([margin.left, w], 0.05);

	                    // update the y scale
	                    yScale.domain([0, d3.max(dataset, function(d) {
	                            return d.value;
	                        })])
	                        .range([h, margin.top]);

	                    // update the x axis
	                    xAxis.scale(xScale).orient("bottom");

	                    // update the y axis
	                    yAxis.scale(yScale).orient("left");

	                    //Create bars and labels
	                    bars = svg.selectAll("rect").data(dataset);
	                    barLabels = svg.selectAll("text").data(dataset);

	                    // add new bars
	                    bars.enter()
	                        .append("rect")
	                        .attr("x", function(d, i) {
	                            return xScale(d.key);
	                        })
	                        .attr("y", function(d) {
	                            return yScale(d.value);
	                        })
	                        .attr("width", xScale.rangeBand())
	                        .attr("height", function(d) {
	                            return h - yScale(d.value);
	                        })
	                        .attr("fill", "steelblue");

	                    // remove bars as necessary
	                    bars.exit()
	                        .transition()
	                        .duration(500)
	                        .attr("x", w)
	                        .remove();

	                    // update the bars
	                    bars.transition()
	                        .duration(750)
	                        .attr("x", function(d, i) {
	                            return xScale(d.key);
	                        })
	                        .attr("y", function(d) {
	                            return yScale(d.value);
	                        })
	                        .attr("width", xScale.rangeBand())
	                        .attr("height", function(d) {
	                            return h - yScale(d.value);
	                        });

	                    // update the x axis
	                    svg.select(".xaxis")
	                        .transition()
	                        .duration(750)
	                        .call(xAxis);

	                    // update the y axis
	                    svg.select(".yaxis")
	                        .transition()
	                        .duration(750)
	                        .call(yAxis);

	                    // update the title
	                    svg.select(".chartTitle")
	                        .text(repo);

	                    // add tooltip
	                    bars.on("mouseover", function(d) {

	                            // add blank tooltip
	                            svg.append("text")
	                                .attr("id", "tooltip");

	                            // get the x and y coords
	                            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
	                            var yPosition = parseFloat(d3.select(this).attr("y")) + 18;

	                            // add the tooltip
	                            svg.select("#tooltip")
	                                .attr("x", xPosition)
	                                .attr("y", function() {
	                                    // if value is less than 10% of max, show tooltip above bar
	                                    var mx = d3.max(dataset, function(d) {
	                                        return d.value;
	                                    });
	                                    if (d.value < 0.1 * mx) {
	                                        return yPosition - 22;
	                                    } else {
	                                        return yPosition;
	                                    };
	                                })
	                                .attr("text-anchor", "middle")
	                                .attr("fill", function() {
	                                    // if value is less than 10% of max, make tooltip black
	                                    var mx = d3.max(dataset, function(d) {
	                                        return d.value;
	                                    });
	                                    if (d.value < 0.1 * mx) {
	                                        return "black";
	                                    } else {
	                                        return "white";
	                                    };
	                                })
	                                .attr("font-family", "sans-serif")
	                                .attr("font-size", "12px")
	                                .text(d.value);

	                        })
	                        .on("mouseout", function() {
	                            d3.select("#tooltip").remove();
	                        });

	                }

	                $scope.qhChange = function(name) {
	                    $scope.languages.forEach(function(val) {
	                        if (val.id == name) {
	                            console.log("ye");
	                            $scope.myData = val.langData;
	                            console.log($scope.myData);

	                            showLangs($scope.myData, 1, name)
	                        } else {}
	                    });
	                }
	            }
	        };
	    }
	]);