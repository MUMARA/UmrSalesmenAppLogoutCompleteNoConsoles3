angular.module('starter')
    .controller("companyMainPageCtrl", function ($scope, $rootScope, $state, $location) {
        $scope.add = function (salesman) {
            console.log('Compressed add button', ' with mongo data_id of his admin signUp is ', $rootScope.signUpMongoId.data)
        }
        $scope.show = function () {
            console.log('Compressed show button')
        }
        $scope.logOut = function () {
            localStorage.removeItem("uid");
            $state.go('signIn');

        }

    });
