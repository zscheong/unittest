appJS.directive('listItem1', function() {
    var $ret = {restrict: 'AE', replace: true, transclude: true};
    
    $ret['templateUrl'] = 'public/js/angular/directive/ListWidget/template/ListItem1.html';
    $ret['scope'] = {id: '@', data: '='};
    
    $ret['controller'] = function($scope, $element, $attrs) {
        
    };
    $ret['link'] = function($scope, $element, $attrs) {
        $scope.AdjustContent = function() {
            var title = $element.find('[name="item-title"]');
            var subTitle = $element.find()
        };
        $scope.AdjustContent();
    };
    return $ret;
});