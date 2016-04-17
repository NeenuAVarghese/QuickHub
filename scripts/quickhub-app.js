angular.module('QuickHub', [])

.controller('gitHubDataController', ['$scope','$http', function($scope, $http) {
		$scope.showme = false;
		$scope.success = false;
	
	function qhsetUserInfo(){
			$scope.qhUsername = "";
			$scope.showme = true;
		qhLoadRepos();
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
			$scope.success = true;
		});
	}
	
	$scope.qhGetUserInfo = qhGetUserInfo;
}]);