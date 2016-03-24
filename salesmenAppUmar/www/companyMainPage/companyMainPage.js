angular.module('starter')
    .controller("companyMainPageCtrl", function ($scope,$rootScope,$state, $location) {

      $scope.logOut = function () {
        localStorage.removeItem("uid");
        $state.go('signIn'); 
          
      }
    
    });
