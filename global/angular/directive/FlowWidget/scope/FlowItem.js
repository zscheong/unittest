appJS.directive('flowItem', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/FlowWidget/template/FlowItem.html',
        scope: {
            data: '=',
            id: '@',
            target: '@',
            caption: '@'
        },
        require: '^flowWidget',
        controller: function($scope, $element, $attrs) {
            $scope.seq = ($attrs.seq)? $attrs.seq: 0;
//            $scope.lastItem = (typeof $attrs.lastItem !== 'undefined')? true : false;
            $scope.validate = (typeof $attrs.validate !== 'undefined')? true : false;
        },
        link: function($scope, $element, $attrs, $parent) {
            $parent.AddItem($scope);
//            if($scope.lastItem) {
//                $parent.BuildItem();
//            }
        }
    };
});