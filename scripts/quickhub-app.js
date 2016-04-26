angular.module('QuickHub', [])

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
	$scope.handleDiv0 = true;
	
	
	function qhSetCurrentDiv(divId){
		angular.element('#d'+$scope.currentDiv).addClass("toggleDiv");//add
		angular.element('#d'+divId).removeClass("toggleDiv");//remove
		$scope.currentDiv = divId;
	}
	
	function qhsetUserInfo(){
			$scope.qhUsername = "";
			$scope.handleDiv0 = false;
		angular.element('#d'+divId).removeClass("toggleDiv");
			qhLoadRepos();
	}
	function setDefaultDiv(){
		$scope.handleDiv0 = true;
	}
	
	function qhLoadRepos(){
		$http.get($scope.userData.data.repos_url)
                .then(function (data) {
                    $scope.repoData = data.data;
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
		 $http.get('/trending')
        .success(function(data) {
			 $scope.trending = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
	}
	
	
	
	
	$scope.qhGetUserInfo = qhGetUserInfo;
	$scope.qhSetCurrentDiv = qhSetCurrentDiv;
	$scope.setDefaultDiv = setDefaultDiv;
	$scope.qhGetTrending = qhGetTrending;
}]);