'use strict';

angular.module('workspaceApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $http) {
    $scope.user = {};
    $scope.errors = {};
    $scope.message = 'Please choose a name, providing us with an email and password.';
      
    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
         for(var i = 0;i<$scope.currentUsers.length;i++){
          if($scope.currentUsers[i].name === $scope.user.name){
            $scope.message = $scope.user.name + ' is already taken as a user name, please choose another name!'
            return;
          }
        }
        
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

      //get all usernames to check later
      $http.get('/api/users').success(function(users) {
        $scope.currentUsers = users;
      });

  });
