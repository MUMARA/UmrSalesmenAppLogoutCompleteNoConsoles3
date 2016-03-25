angular.module('starter')
    .controller("signupCtrl", function ($scope, $http) {

        $scope.newUser = {};

        $scope.submit = function () {

            $http.post("/signup", $scope.newUser).then(function (response) {
            }, function myError(err) {
                console.log("signUp.js error " + err.statusText);
                $scope.displaySignup = err.statusText;

            });
        }
    });
