appJS.directive('tabItem', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/TabWidget/template/TabItem.html',
        scope: {
            data: '=',
            id: '@',
            target: '@',
            caption: '@'
        },
        require: '^tabWidget',
        controller: function($scope, $element, $attrs) {
            $scope.seq = ($attrs.seq)? $attrs.seq: 0;
        },
        link: function($scope, $element, $attrs, $parent) {
            $parent.AddItem($scope);
        }
    };
});