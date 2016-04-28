var app = angular.module('QuickHub', [])

.controller('gitHubDataController', ['$scope','$http', function($scope, $http) {
	$scope.functionalities = [
		{"id": 0, "name": "Home"},
		{"id": 1, "name": "Repositories"},
		{"id": 2, "name": "Contributions"},
		{"id": 3, "name": "Trending"},
		{"id": 4, "name": "Pinned"}
	];
	
	$scope.trendingRepoInfo = [];
	$scope.languages = [];
	$scope.currentDiv = 0;
	$scope.qhinvalidusername = true;
	
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
	
	$scope.myData = [{AngularJS: 300} ,{D3JS: 150}, {jQuery: 400}, {Backbonejs: 300} ,{Emberjs: 100}];
	
	function qhSetCurrentDiv(divId){
		angular.element('#d'+$scope.currentDiv).addClass("toggleDiv");//add
		angular.element('#d'+divId).removeClass("toggleDiv");//remove
		$scope.currentDiv = divId;
	}
	
	function qhsetUserInfo(){
			$scope.qhUsername = "";
			angular.element('#d'+$scope.currentDiv).addClass("toggleDiv");
			$scope.currentDiv = 5;
			angular.element('#d5').removeClass("toggleDiv");
			qhLoadRepos();
	}
	function setDefaultDiv(){
		$scope.handleDiv0 = true;
	}
	function qhSetlang(){
		$scope.languages = [];
		$scope.repoData.forEach(function(repo){
			lang_url = repo.languages_url;
			$http.get(lang_url)
				.then(function(data){
					$scope.languages.push({id: repo.name, langData: data.data});
			}, function(){
				console.log("Error in getting Lang data");
			});
		});
	}
	
	function qhLoadRepos(){
		$http.get($scope.userData.data.repos_url)
                .then(function (data) {
                    $scope.repoData = data.data;
					qhSetlang();
                }, function(){
			console.log("Repo data Not Found !");
		});
	}
	
	function qhGetUserInfo(username){
			$http.get("https://api.github.com/users/"+username)
        .then(function(data) {
			$scope.userData = data;
			$scope.username = username;
			$scope.qhUsername = "";
			$scope.qhinvalidusername = true;
            qhsetUserInfo();	
        },function(){
			$scope.qhinvalidusername = false;
			angular.element('#d'+$scope.currentDiv).addClass("toggleDiv");//add
			angular.element('#d0').removeClass("toggleDiv");//remove
		});
	}
	
	function qhGetTrending(){
		$scope.trending = [];
		 $http.get('/trending')
        .success(function(data) {
			 $scope.trending = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
	}
	
	function qhGetOrgInfo(orgname){
		
	}
	
	
	qhGetTrending();
	$scope.qhGetUserInfo = qhGetUserInfo;
	$scope.qhSetCurrentDiv = qhSetCurrentDiv;
	$scope.setDefaultDiv = setDefaultDiv;
	$scope.qhGetTrending = qhGetTrending;
	$scope.qhGetOrgInfo = qhGetOrgInfo;
	
}]);


app.directive('qhLangviz',[
	
	function () {
    return {
      restrict: 'E',
      link: function ($scope, element) {
		    
		  var dataset = [];
		var margin = {top: 70, right: 20, bottom: 60, left: 100};           
		var w = 600 - margin.left - margin.right;
		var h = 500 - margin.top - margin.bottom;

		//Create SVG element
		 var svg = d3.select(element[0])
	    .append("svg")
	    .attr("width", w + margin.left + margin.right)
	    .attr("height", h + margin.top + margin.bottom);

	  // define the x scale
		var xScale = d3.scale.ordinal()
	    .domain(dataset.map(function (d) {return d.key; }))
	    .rangeRoundBands([margin.left, w], 0.05);

		// define the x axis
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

		// define the y scale
		var yScale = d3.scale.linear()
	    .domain([0, d3.max(dataset, function(d) {return d.value; })])
	    .range([h,margin.top]);

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
	    .attr("transform","translate(" + margin.left + ",0)")
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
		  
		  
		  function showLangs(data, status,repo){
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
			xScale.domain(dataset.map(function (d) {return d.key; }))
			  .rangeRoundBands([margin.left, w], 0.05);

			// update the y scale
			yScale.domain([0, d3.max(dataset, function(d) {return d.value; })])
			  .range([h,margin.top]);

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
		    .attr("x", function(d,i) {
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
			bars.on("mouseover",function(d){
				
				// add blank tooltip
				svg.append("text")
					.attr("id","tooltip");

				// get the x and y coords
				var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
				var yPosition = parseFloat(d3.select(this).attr("y")) + 18;

				// add the tooltip
				svg.select("#tooltip")
					.attr("x",xPosition)
					.attr("y",function(){
						// if value is less than 10% of max, show tooltip above bar
						var mx = d3.max(dataset, function(d) {return d.value; });
						if (d.value < 0.1 * mx) {
							return yPosition - 22;
						} else {
							return yPosition;
						};
					})
					.attr("text-anchor","middle")
					.attr("fill",function(){
						// if value is less than 10% of max, make tooltip black
						var mx = d3.max(dataset, function(d) {return d.value; });
						if (d.value < 0.1 * mx) {
							return "black";
						} else {
							return "white";
						};
					})
					.attr("font-family","sans-serif")
					.attr("font-size","12px")
					.text(d.value);

			})
			.on("mouseout",function(){
				d3.select("#tooltip").remove();
			});

		}
		  
		  $scope.qhChange = function (name){
		$scope.languages.forEach(function(val){
			if(val.id == name){
				console.log("ye");
				$scope.myData = val.langData;
				console.log($scope.myData);
				
				showLangs($scope.myData, 1, name)
			}
			else{
			}
		});	
	}
		  
		  
		  /*
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 480 - margin.left - margin.right,
          height = 360 - margin.top - margin.bottom;
        
		  
		  
		  var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  
		  var x = d3.scale.ordinal()
  .domain(scope.data.map(function (d) {for(key in d){
				  return(key);;
			  } }))
  .rangeRoundBands([margin.left, width], 0.05);
        var y = d3.scale.linear()
  .domain([0, d3.max(scope.data, function(d) {for(key in d){
				  return d[key];
			  }  })])
  .range([height,margin.top]);
		  
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        //Render graph based on 'data'
        scope.render = function(data) {
          //Set our scale's domains
			var keys = [];
          x.domain(data.map(function(d) { 
			  for(key in d){
				  keys.push(key);;
			  }
			  return keys;
		  })).rangeRoundBands([margin.left, width], 0.05);
			
			
          y.domain([0, d3.max(data, function(d) {
			  var values = [];
			  for(key in d){
				  return(d[key]);
			  } 
		  })]).range([height,margin.top]);
          
          //Redraw the axes
          //svg.selectAll('g.axis').remove();
			xAxis.scale(x).orient("bottom");
svg.select(".xaxis")
	.transition()
	.duration(750)
        .call(xAxis);
          //X axis
    
              
          //Y axis
          yAxis.scale(y).orient("left");
svg.select(".yaxis")
	.transition()
	.duration(750)
	.call(yAxis);
              
			var bars = svg.selectAll("rect").data(data);
          bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { for(key in d){
				  console.log(key);
				  return x(key);
			  }; })
            .attr("width", x.rangeBand());
			
			
			// add new bars
bars.enter()
  .append("rect")
  .attr("x", function(d, i) {
	for(key in d){
				  console.log(key);
				 var xval= x(key);
			  }
    return x(xval);
  })
  .attr("y", function(d) {
	for(key in d){
				  console.log(d[key]);
				  var yval = d[key];
			  } 
    return y(yval);
  })
  .attr("width", x.rangeBand())
  .attr("height", function(d) {
	for(key in d){
				  console.log(d[key]);
				  var yval = d[key];
			  }
    return height - y(yval);
  })
  .attr("fill", "steelblue");
			
			
bars.exit()
  .transition()
  .duration(500)
  .attr("x", width)
  .remove();
          //Animate bars
          bars.transition()
  .duration(750)
  .attr("x", function(d,i) {
			  for(key in d){
				  console.log(key);
				 var xval= x(key);
			  }
    return x(xval);
  })
  .attr("y", function(d) {
			  for(key in d){
				  console.log(d[key]);
				  var yval = d[key];
			  }
    return y(yval);
  })
  .attr("width", x.rangeBand())
  .attr("height", function(d) {
			  for(key in d){
				  console.log(d[key]);
				  var yval = d[key];
			  }
    return height - y(yval);
  });
        };

         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              scope.render(scope.data);
          }, true); 
		  
		  */
        }
    };
  }
]);