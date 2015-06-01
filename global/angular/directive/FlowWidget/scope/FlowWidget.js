appJS.directive('flowWidget', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/FlowWidget/template/FlowWidget.html',
        scope: {
            data: '=',
            id: '@'        
        },
        controller: function($scope, $element, $attrs) {
            $scope.item = {};
            $scope.permission = false;
            $scope.flowStepItem = ($attrs.flowStepItem) || 0;
            
            this.AddItem = function($cScope) {
                $scope.item[$cScope.seq] = $cScope;
                
                var length = Object.keys($scope.item).length;
                var flowItem = parseInt($scope.flowStepItem);
                if(flowItem === length) {
                    $scope.BuildItem();
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
                            $scope.current = seq;
                            $scope.firstStep = seq;
                            $scope.activeCaption = $cScope.caption;
                            $scope.stepCount = 1;
                            elem.css('display', 'block');
                        } else {
                            elem.css('display', 'none');
                        }
                      
                        //Contents
                        var target = jQuery('#' + $cScope.target);
                        var targetContainer = elem.find('[name="target-content"]');
                        targetContainer.append(target);
                        
                        count++;
                        $scope.lastStep = seq;
                    }
                    
                    var header = $element.find('[name="flow-header"]');
                    header.css('width', 155 * length + 'px');
                }
            };
            $scope.$on("FlowNextStep", function(event, data) {
                if(!$scope.BeforeEvent(data)) { return; }
                $scope.permission = data.permission;
                $scope.NextStep();
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
        },
        link: function($scope, $element, $attrs) {
            $scope.FinishStep = function() {
                $scope.$emit('FlowFinish', {id: $scope.id});
            };
            $scope.BackStep = function() {
                var previousStep = "";
                var count = 1;
                for( var seq in $scope.item) {
                    if(seq === $scope.previous) {
                        var $cScope = $scope.item[seq];
                        var elem = jQuery('#' + $cScope.id);
                        elem.css('display', 'block');
                        
                        var display = $element.find('#display-' + $cScope.target);
                        display.addClass('active-step');
                        
                        $scope.stepCount = count;
                        $scope.activeCaption = $cScope.caption;
                        
                        $scope.previous = previousStep;
                    }
                    if(seq === $scope.current) {
                        var $cScope = $scope.item[seq];
                        var elem = jQuery('#'+ $cScope.id);
                        elem.css('display', 'none');
                        
                        var display = $element.find('#display-' + $cScope.target);
                        display.removeClass('active-step');

                        $scope.current = previousStep;
                        
                    }
                    previousStep = seq;
                    count++;
                }
            };
            $scope.ShowNext = function() {
                var next = false;
                var nextStep = "";
                var count = 1;
                for(var seq in $scope.item) {
                    nextStep = seq;
                    
                    if(next) { 
                        var $cScope = $scope.item[nextStep];
                        var elem = jQuery('#' + $cScope.id);
                        elem.css('display', 'block');
                        
                        var display = $element.find('#display-' + $cScope.target);
                        display.addClass('active-step');
                        $scope.current = seq;
                        
                        $scope.activeCaption = $cScope.caption;
                        $scope.stepCount = count;
                        break;
                    }
                    if(seq === $scope.current) { 
                        var $cScope = $scope.item[nextStep];
                        var elem = jQuery('#' + $cScope.id);
                        elem.css('display', 'none');
                        
                        var display = $element.find('#display-' + $cScope.target);
                        display.removeClass('active-step');
                        
                        var backBtn = $element.find('[name="back-step-button"]');
                        backBtn.css("display", "block");
                        $scope.previous = $scope.current;
                        next = true; 
                    }
                    count++;
                }
            };
            $scope.NextStep = function() {
                var $cScope = $scope.item[$scope.current];
                if($cScope.validate) {
                    if($scope.permission) {
                        $scope.ShowNext();
                        $scope.permission = false;
                    } else {
                        $scope.$emit('FlowStepValidate', {id: $cScope.id});
                    }
                } else {
                    $scope.ShowNext();
                }
            };
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
            
//            $scope.BuildItem();
        }
    };
});