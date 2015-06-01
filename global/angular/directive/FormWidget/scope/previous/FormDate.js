appJS.directive('formDate', function() {
    var ret = {restrict: 'AE', replace: true, transclude: true};
    ret['templateUrl'] = 'public/js/angular/directive/Form/template/FormDate.html';
    ret['scope'] = {id: '@', label: '@', caption: '@', data: '=', value: '@'};
    ret['require'] = '?^formBlock';
    ret['controller'] = function($scope, $element, $attrs) {
        if(typeof $attrs.placeholder === 'undefined' || !$attrs.placeholder) {
            $scope.placeholder = $scope.caption;
        } else {
            $scope.placeholder = $attrs.placeholder;
        }
            
        $scope.noLabel = (typeof $attrs.noLabel !== "undefined")? true : false;
        
        $scope.require = $attrs.require;
        $scope.isRequire = ($scope.require)? true: false;
       
        $scope.spanRow = ($attrs.spanRow === 'true')? true: false;
        $scope.visibility = ($attrs.visibility !== 'false')? true: false;
        $scope.style = {display: ($scope.visibility)?'table':'none'};
        $scope.style["width"] = "100%";
        
        $scope.hasOpBtn = (typeof $attrs.opBtn !== 'undefined')? true: false;
        $scope.OpBtn = ($scope.hasOpBtn) ? $attrs.opBtn : '';
        $scope.single = (typeof $attrs.single !== 'undefined') ? true : false;
            
        $scope.seq = $attrs.seq || 0;
        $scope.format = $attrs.format || 'DD-MM-YYYY';
        
        $scope.changeEvent = ($attrs.changeEvent === 'true')? true: false;
        $scope.customEvent = $attrs.customEvent || 'FieldChange';
        
        //$scope.value = ($attrs.value) || "";
    };
    ret['link'] = function($scope, $element, $attrs, $block) {
        if($block) {
            $block.AddField($scope);
        }
        
        $scope.$on('RefreshData', function(event, eventData) {
            if(!$scope.BeforeEvent(eventData)) { return; }
            
        });
        $scope.OpBtnTrigger = function() {
            var elem = $element.find('#select_' + $scope.label);
            var value = elem.select2('data');
            $scope.$emit('OpBtnTrigger', {id: $scope.id, btn: $scope.OpBtn, val: value});
        };
        $scope.BeforeEvent = function(data) {
            if(typeof data === 'undefined') {
                return false;
            }
            if(data.target !== $scope.id) {
                return false;
            } 
            return true;
        };
        $scope.ParseOptions = function() {
            var options = {startDate: moment(), endDate: moment(), showDropdowns: true};
            
            if($scope.data) {
                var data = $scope.data;
                if(data.startDate) { options.startDate = data.startDate; }
                if(data.endDate) { options.endDate = data.endDate; }
                if(data.timePicker) { options.timePicker = data.timePicker; }
                if(data.format) {options.format = data.format; }
                if(data.singleDatePicker) { options.singleDatePicker = data.singleDatePicker; }
            }
            return options;
        };
        $scope.ShowPicker = function() {
            var widget = $element.find('input');
            var picker = widget.data('daterangepicker');
            picker.toggle();
        };
        
        var options = $scope.ParseOptions();
       
        if($scope.value) { options.startDate = $scope.value;}
        if($scope.single) { options.singleDatePicker = true; }
        if($scope.format && !(options.format)) { options.format = $scope.format; }
        var widget = $element.find('input');
        widget.daterangepicker(options);
        
        if($scope.changeEvent) {
            widget.on('apply.daterangepicker',function(ev, picker) {
                var startDate = picker.startDate.format($scope.format);
                var endDate = picker.endDate.format($scope.format);
                var val = "";
                if($scope.single) { val = startDate; }
                else { val = startDate + "-" + endDate; }
                $scope.$emit($scope.customEvent, {id: $scope.id, value: val});
            });
        }
    };
    return ret; 
});