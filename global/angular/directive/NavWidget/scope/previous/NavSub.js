appJS.directive('navSub', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/Nav/template/NavSub.html',
        scope: {
            label: '@'
        },
        require: "^navBar",
        controller: function($scope, $attrs) {
            
        },
        link: function($scope, $element, $attrs, $bar) {
            
        }
    };
});