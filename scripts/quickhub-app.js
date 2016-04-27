var app = angular.module('QuickHub', ['angularCharts'])

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
	function qhChange(name){
		$scope.languages.forEach(function(val){
			if(val.id == name){
				console.log("ye");
				$scope.myData = [val.langData];
				console.log($scope.myData)
			}
			else{
			}
		});
		
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
            qhsetUserInfo();	
        },function(){
			$scope.qhUsername = "";
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
	
	
	qhGetTrending();
	$scope.qhGetUserInfo = qhGetUserInfo;
	$scope.qhSetCurrentDiv = qhSetCurrentDiv;
	$scope.setDefaultDiv = setDefaultDiv;
	$scope.qhGetTrending = qhGetTrending;
	$scope.qhChange = qhChange;
}]);


app.directive('qhLangviz',[
	
	function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 480 - margin.left - margin.right,
          height = 360 - margin.top - margin.bottom;
        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().range([height, 0]);

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
          x.domain(data.map(function(d) { 
			  for(key in d){
				  console.log(key);
				  return key;
			  } 
		  })).rangeRoundBands([margin.left, width], 0.05);
          y.domain([0, d3.max(data, function(d) {
			  for(key in d){
				  console.log(d[key]);
				  return d[key];
			  }  
		  })]).range([height,margin.top]);
          
          //Redraw the axes
          svg.selectAll('g.axis').remove();
          //X axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
              
          //Y axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Count");
              
          var bars = svg.selectAll(".bar").data(data);
          bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { for(key in d){
				  console.log(key);
				  return x(key);
			  }; })
            .attr("width", x.rangeBand());

          //Animate bars
          bars
              .transition()
              .duration(1000)
              .attr('height', function(d) { for(key in d){
				  console.log(d[key]);
				  var value = d[key];
			  } 
			return height - y(value); })
              .attr("y", function(d) { for(key in d){
				  console.log(d[key]);
				  return y(d[key]);
			  } })
        };

         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              scope.render(scope.data);
          }, true);  
        }
    };
  }
]);