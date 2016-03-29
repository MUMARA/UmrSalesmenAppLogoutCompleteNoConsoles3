angular.module('starter')
    .controller("companyMainPageCtrl", function ($scope, $rootScope, $state, $location,$http) {



      $scope.salesman = {};




        $scope.add = function (salesman) {
      //      $scope.usersMongoUids = [];
         //   $scope.usersMongoUids = $rootScope.signUpMongoId.data;

          //  console.log('Compressed add button', ' with mongo data_id of his admin signUp is ', $rootScope.usersMongoUids);
          $http.post("/mobo/salesmanSignup", $scope.salesman).then(function (response) {
        //    $scope.usersMongoUids;

          }, function myError(err) {
            console.log($scope.salesman, "signUp.js error " + err.statusText);
            $scope.displaySignup = err.statusText;

          });

        }





        $scope.show = function () {
            console.log('Compressed show button')
        }
        $scope.logOut = function () {
            localStorage.removeItem("uid");
            $state.go('signIn');

        }

    });
