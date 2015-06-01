appJS.directive('tabWidget', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/TabWidget/template/TabWidget.html',
        scope: {
            data: '=',
            id: '@'        
        },
        controller: function($scope, $element, $attrs) {
            $scope.item = {};
            this.AddItem = function($cScope) {
                $scope.item[$cScope.seq] = $cScope;
            };
        },
        link: function($scope, $element, $attrs) {
            $scope.LinkClick = function(elemID) {
                for(var seq in $scope.item) {
                    var target = $scope.item[seq].target;
                    var elem = $element.find('#' + $scope.item[seq].id);
                    if(target === elemID) {
                        elem.css('display', 'block');
                    } else {
                        elem.css('display', 'none');
                    }
                }
            };
            $scope.BuildItem = function() {
                var length = Object.keys($scope.item).length;
                if(length !== 0) {
                    
                    var count = 0;
                    for(var seq in $scope.item) {
                        var $cScope = $scope.item[seq];
                        var elem = jQuery('#' + $cScope.id);
                        if(count === 0) {
                            elem.css('display', 'block');
                        } else {
                            elem.css('display', 'none');
                        }
                      
                        //Contents
                        var target = jQuery('#' + $cScope.target);
                        var targetContainer = elem.find('[name="target-content"]');
                        targetContainer.append(target);
                        
                        count++;
                    }
                }
            };
            $scope.BuildItem();
        }
    };
});