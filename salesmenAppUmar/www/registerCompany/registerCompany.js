angular.module('starter')
    .controller("registerCompanyCtrl", function ($rootScope,$scope, $http, $state, $location) {
        $scope.admin = {};
        $scope.registerCompany = function (admin) {
            $rootScope.registerAdmin = admin;
            $http.post("/registerCompany",
                {
                    companyName: $scope.admin.companyName,
                    companyAddress: $scope.admin.companyAddress,
                    companyPhone: $scope.admin.companyPhone,
                    firebaseUid: localStorage.getItem("uid")
                }
            ).then(function (response) {
                $scope.displayAdmin = response.data;
                $state.go('companyMainPage')
            })

            console.log("admin is", admin);
        };
        $scope.logOut = function () {
            localStorage.removeItem("uid");
            $state.go('signIn');
            // localStorage.removeItem("token");
        }
    });

