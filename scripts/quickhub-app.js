angular.module('QuickHub', [])

.controller('gitHubDataController', ['$scope','$http', function($scope, $http) {
	$scope.functionalities = [
		{"id": 0, "name": "Home"},
		{"id": 1, "name": "Repositories"},
		{"id": 2, "name": "Contributions"},
		{"id": 3, "name": "Trending"},
		{"id": 4, "name": "Pinned"}
	];
	$scope.currentDiv = 0;
	$scope.handleDiv0 = true;
	
	
	function qhSetCurrentDiv(divId){
		console.log("in");
		angular.element('#d'+$scope.currentDiv).addClass("neenuDiv");//add
		angular.element('#d'+divId).removeClass("neenuDiv");//remove
		$scope.currentDiv = divId;
	}
	
	function qhsetUserInfo(){
			$scope.qhUsername = "";
			$scope.handleDiv0 = false;
			qhLoadRepos();
	}
	function setDefaultDiv(){
		$scope.handleDiv0 = true;
	}
	function qhLoadRepos(){
		$http.get($scope.userData.data.repos_url)
                .then(function (data) {
                    $scope.repoData = data.data;
					console.log($scope.repoData);
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
	
	$scope.qhGetUserInfo = qhGetUserInfo;
	$scope.qhSetCurrentDiv = qhSetCurrentDiv;
	$scope.setDefaultDiv = setDefaultDiv;
}]);