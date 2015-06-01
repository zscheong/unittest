appJS.directive('formField', function() {
   return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/Form/template/FormField.html',
        scope: {
            label: '@',
            caption: '@',
            id: '@',
            value: '@'
        },
        require: '?^formBlock',
        controller: function($scope, $element, $attrs) {
            //user input variable
            $scope.type = $attrs.type || "text";
            
            if(typeof $attrs.placeholder === 'undefined' || !$attrs.placeholder) {
                $scope.placeholder = $scope.caption;
            } else {
                $scope.placeholder = $attrs.placeholder;
            }
            
            //require value -- required, email, date, onlyLetterNumber, url, number
            $scope.require = $attrs.require;
            $scope.isRequire = (typeof $scope.require !== 'undefined')? true: false;
            $scope.isCustom = ($scope.isRequire && $scope.require !== 'required')? true : false;
                        
            $scope.readonly = ($attrs.readonly === 'true')? true: false;
            $scope.spanRow = ($attrs.spanRow === 'true')? true: false;
            $scope.visibility = ($attrs.visibility !== 'false')? true: false;
            $scope.style = {display: ($scope.visibility)?'table':'none'};
            $scope.style["width"] = "100%";
            
            $scope.hasOpBtn = (typeof $attrs.opBtn !== 'undefined')? true: false;
            $scope.OpBtn = ($scope.hasOpBtn) ? $attrs.opBtn : '';
            
            $scope.seq = $attrs.seq || 0;
            
            $scope.noLabel = (typeof $attrs.noLabel !==  'undefined')? true: false;
            
            $scope.$on("WidgetDisplay", function(event, data) {
               if(!$scope.BeforeEvent(data)) { return; }
               var container = $element.find('[name="field-cell"]');

                if(data.toggle) {
                    var current = (container.css('display') === 'none')? 'table': 'none';
                    container.css('display', current);
                }
                else if(data.display) {
                    container.css('display', 'table');
                } else {
                    container.css('display', 'none'); 
                }
            });
            $scope.$on("WidgetEnable", function(event, data) {
                if(!$scope.BeforeEvent(data)) { return; }
                var field = $element.find('#field-' + $scope.label);

                if(data.enable) {
                    field.prop('disabled', false);
                } else {
                    field.prop('disabled', true);
                }
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
            $scope.OpBtnTrigger = function() {
                var elem = {};
                if($scope.type === 'textarea') {
                    elem = $element.find('textarea');
                } else {
                    elem = $element.find('input');
                }
                var value = elem.val();
                $scope.$emit('OpBtnTrigger', {id: $scope.id, btn: $scope.OpBtn, val: value});
            };
        },
        link: function($scope, $element, $attrs, $block) {
            if($block) {
                $block.AddField($scope);
            }
        }
   }; 
});