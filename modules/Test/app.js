var myApp = angular.module('myApp', []);
myApp.controller('HelloWorldController', ['$scope', function($scope) {
    $scope.greeting = 'Hello World!';
}]);

myApp.factory("SimpleService", function() {
    var service = {
        getData: function() {
            return [{ id: 1, name: "Mark"}];
        }
    }; 
    
    return service;
});

myApp.directive('sampleOne', function() {
    return function(scope, elem, attrs) {
        elem.bind('click', function() {
            elem.text(scope.$eval(attrs.sampleOne));
        });
    } 
});
