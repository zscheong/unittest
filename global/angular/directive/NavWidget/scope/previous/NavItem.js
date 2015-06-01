appJS.directive('navItem', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/Nav/template/NavItem.html',
        scope: {
            id: '@'
        },
        require: '^navBar',
        controller: function($scope, $attrs) {
            $scope.target = $attrs.target || "#";
            $scope.label = $attrs.label || "";
            
            $scope.img = $attrs.img || false;
            $scope.alt = $attrs.alt || $scope.label;
            
            $scope.hasChild = false;
            $scope.isVertical = true;
            
            //event
            $scope.$on('UpdateLabel', function(event, data) {
               if(!$scope.BeforeEvent(data)) { return; }
               $scope.label = data.label;
            });
            
            //private method
            $scope.BeforeEvent = function(data) {
                if(typeof data === 'undefined') {
                    return false;
                }
                if(data.target !== $scope.id) {
                    return false;
                }
                return true;
            };
            
            $scope.CreateItem = function(el) {
                var child = el.find('li');
                if(child.length !== 0) {
                    $scope.hasChild = true;
                } else {
                 var el1 = el.find("[name='sub-level']");
                    el1.remove();
                }
            };
        },
        link: function($scope, $element, $attrs, $bar) {
            $scope.isVertical = $bar.GetScope().isVertical;
            var anchor = $element.find('a[href="#"]');
            anchor.click(function(e) {
               e.preventDefault(); 
            });
            $scope.CreateItem($element);
        }
    };
});