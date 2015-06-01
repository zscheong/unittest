appJS.directive('displayField', function() {
    var ret = {restrict: 'AE', replace: true, transclude: true};
    ret['templateUrl'] = 'public/js/angular/directive/FormDisplay/template/DisplayField.html';
    ret['scope'] = {id: '@', label: '@', caption: '@'};
    ret['require'] = '^displayBlock';
    ret['controller'] = function($scope, $element, $attrs) {
        $scope.style = {display: 'table'};
        $scope.needInput = ($attrs.needInput)? true : false;
        $scope.seq = $attrs.seq || 0;
        
        $scope.value = ($attrs.value) || "empty";
    };
    ret['link'] = function($scope, $element, $attrs, $block) {
        $block.AddField($scope);
        
        $scope.$on('RefreshData', function(event, eventData) {
            if(!$scope.BeforeEvent(eventData)) { return; }
            $scope.$apply(function() {$scope.value = eventData.value; });
        });
        $scope.BeforeEvent = function(data) {
            if(typeof data === 'undefined') {
                return false;
            }
            if(data.target !== $scope.id) {
                return false;
            } 
            return true;
        };
    };
    return ret; 
});