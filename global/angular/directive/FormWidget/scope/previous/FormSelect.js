appJS.directive('formSelect', function() {
   return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       templateUrl: 'public/js/angular/directive/Form/template/FormSelect.html',
       scope: {
           data: '=',
           label: '@',
           caption: '@',
           id: '@'
       },
       require: '?^formBlock',
       controller: function($scope, $element, $attrs) {
            $scope.multiple = ($attrs.multiple === 'true')? true: false;
            $scope.hasData = (typeof $scope.data !== 'undefined')? true: false; 
            $scope.allowTag = (typeof $attrs.allowTag !== 'undefined')? true: false; 
            
            $scope.blurEvent = ($attrs.blurEvent)? true : false;
            $scope.changeEvent = ($attrs.changeEvent === 'true')? true: false;
            $scope.customEvent = $attrs.customEvent || 'SelectChange';
           
            $scope.spanRow = ($attrs.spanRow === 'true')? true: false;
            $scope.readonly = ($attrs.readonly === 'true')? true: false;
            
            $scope.require = $attrs.require;
            $scope.isRequire = (typeof $scope.require !== 'undefined')? true: false;
            
            $scope.visibility = ($attrs.visibility !== 'false')? true: false;
            $scope.style = {display: ($scope.visibility)?'table':'none'};
            $scope.style["width"] = "100%";
            
            $scope.hasOpBtn = (typeof $attrs.opBtn !== 'undefined')? true: false;
            $scope.OpBtn = ($scope.hasOpBtn) ? $attrs.opBtn : '';
            
            $scope.seq = $attrs.seq || 0;
            $scope.value = $attrs.value || false;
            
            $scope.noLabel = (typeof $attrs.noLabel !==  'undefined')? true: false;
            
            $scope.width = ($attrs.width) || false;
            
            $scope.$on("WidgetDisplay", function(event, data) {
               if(!$scope.BeforeEvent(data)) { return; }
               var container = $element.find('[name="field-cell"]');

                if(data.display) {
                    container.css('display', 'table');
                } else {
                    container.css('display', 'none'); 
                }
            });
            $scope.$on("RefreshData", function(event, data) {
                if(!$scope.BeforeEvent(data)) { return; }
                var container = $element.find('[name="select-contents"]');

                container.empty();
                container.append('<input type="hidden" id="select_' + $scope.label + '" name="' + $scope.label + '" class="select-class" style="width:95%"/>');
                var widget = $element.find('#select_' + $scope.label);
                
                //$scope.data format -- [{id: , text: }, {id:, text: }]
                //$scope.data = data.data;
                var options = $scope.ParseOptions(data.data);
                jQuery(widget).select2(options);
                $scope.PostSetup();
            });
            $scope.$on("WidgetEnable", function(event, data) {
                if(!$scope.BeforeEvent(data)) { return; }
                var select = $element.find('#select_' + $scope.label);

                if(data.enable) {
                    select.select2('enable', true);
                } else {
                    select.select2('enable', false);
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
                var elem = $element.find('#select_' + $scope.label);
                var value = elem.select2('data');
                $scope.$emit('OpBtnTrigger', {id: $scope.id, btn: $scope.OpBtn, val: value});
            };
       },
       link: function($scope, $element, $attrs, $block) {
           
            $scope.ParseOptions = function(data) {
                var options = {placeholder: "Select an Option", allowClear: true};
                
                if(data) { options.data = data; }
                if($scope.multiple) { options.multiple = $scope.multiple; }
                if($scope.allowTag) { options.tags = []; }
                return options;
            };
            $scope.PostSetup = function() {
                var widget = widget = $element.find('#select_' + $scope.label);
                if($scope.value) {
                    jQuery(widget).select2('val', $scope.value);
                }
                if($scope.changeEvent) {
                    jQuery(widget).on("change", function(e) {
                       $scope.$emit($scope.customEvent, {id: $scope.id, value: e.val}); 
                    });
                }
                if($scope.blurEvent) {
                    
                    jQuery(widget).on("select2-blur", function(e) {
                        var val = jQuery(widget).select2('data');
                        $scope.$emit("select-blur", {id: $scope.id, value: val.id.trim()}); 
                    });
                }
                if($scope.readonly) {
                    jQuery(widget).select2("enable", $scope.readonly);
                }
                if($scope.isRequire) {
                    var select = $element.find('select');
                    select.addClass('select-required');
                    jQuery(widget).on('select2-close', function(e) {
                        var prompt = $element.find('.undefinedformError');
                        prompt.remove(); 
                    });
                }
                if($scope.width) {
                    var select = $element.find('.select2-container');
                    select.css('min-width', $scope.width);
                    select.css('width', $scope.width);
                }
            };
            
            if($block) {
                $block.AddField($scope);
            }
            
            var widget = $element.find('select');
            
            var options = $scope.ParseOptions($scope.data);
            if($scope.hasData || $scope.multiple) {
                widget.remove();
                var contents = $element.find('[name="select-contents"]');
                contents.append('<input type="hidden" id="select_' + $scope.label + '" name="' + $scope.label +'" class="select-class" style="width:95%"/>');
                widget = $element.find('#select_' + $scope.label);
                
                //$scope.data format -- [{id: , text: }, {id:, text: }]
                jQuery(widget).select2(options);
            } else {
                jQuery(widget).attr('id', 'select_'+$scope.label);
                jQuery(widget).select2(options);
            }
            
            $scope.PostSetup();
       }
   } 
});