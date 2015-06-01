appJS.directive('navBar', function($compile) { 
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/Nav/template/NavBar.html',
        scope: {  
            id: '@',
            data: '='
        },
        controller: function($scope, $element, $attrs) {
            $scope.isVertical = ($attrs.orient === 'vertical')? true: false;
            $scope.hasBorder = ($attrs.hasBorder === 'false')? false: true;
            $scope.style = {background: $attrs.backColor || 'transparent'};
            
            //event
            $scope.$on('WidgetDisplay', function(event, data) {
               if(!$scope.BeforeEvent(data)) { return; }
               var container = jQuery('#' + $scope.id);
               
                if(typeof data.display !== 'undefined') {
                    if(data.display) {
                        container.css('display', 'block');
                    } else {
                        container.css('display', 'none');
                    }
                } else if (typeof data.toggle !== 'undefined') {
                    if(data.toggle) {
                        var display = container.css('display');
                        if(display !== 'none') { 
                            //container.css('display', 'none'); 
                            $element.domUtils('appearOut');
                        } else { 
                            //container.css('display', 'block'); 
                            $element.domUtils('appearIn');
                        }
                    }
                }
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
            $scope.Show = function() {
                $element.css('display', 'block');
                var width = $element.data('oriWidth');
                $element.animate({width: width, opacity:1}, 1000, function(){});
            };
            $scope.Hide = function() {

                var width = $element.outerWidth();
                $element.data('oriWidth', width);
                $element.animate({width:0, opacity:0}, 1000, function(){
//                   var right = $element.css('right');
                   $element.css('display', 'none'); 
                });
            };
            $scope.RefreshData = function() {
                var data = $scope.data;
                if(typeof data === 'undefined' || data === "") { return; }
                
                var container = $element.find("[name='item-container']");
                container.empty();
                angular.forEach(data, function(val, key) {
                    var $el = {};
                    if(val.child !== false) {
                        $el = jQuery('<li nav-item label="' + val.label + '" target="' + val.target + '"><ul></ul><li>');
                        $scope.CreateElement(val.child, $el.find('ul'));
                    } else {
                        $el = jQuery('<li nav-item label="' + val.label + '" target="' + val.target + '"><li>');
                    }
                    var el = $compile($el)($scope);
                    container.append(el);
                });
//                $scope.CreateElement(data, $element); 
//                $compile($element)($scope);
            };
            $scope.CreateElement = function(data, el) {
                angular.forEach(data, function(val, key) {    
                    var $el = {};
                    if(val.child !== false) {
                        $el = jQuery('<li nav-item label="' + val.label + '" target="' + val.target + '"><ul></ul><li>');
                        $scope.CreateElement(val.child, $el.find('ul'));
                    } else {
                        $el = jQuery('<li nav-item label="' + val.label + '" target="' + val.target + '"><li>');
                    }
                    el.append($el);
                });
            };
            
            //public method
            this.GetScope = function() {
                return $scope;
            };
        },
        link: function($scope, element, attrs) {
            if(typeof $scope.data !== 'undefined') { $scope.RefreshData(); }
        }
    };
});