appJS.directive('displayTag', ['$compile', function($compile) {
    var ret = {restrict: 'AE', replace: true, transclude: true};
    ret['templateUrl'] = 'public/js/angular/directive/FormDisplay/template/DisplayTag.html';
    ret['scope'] = {id: '@', data: '='};
    ret['controller'] = function($scope, $element, $attrs) {
        $scope.style = {width: $attrs.width || '800px'};
        $scope.hasBorder = ($attrs.hasBorder === 'true')? true : false;
        $scope.caption = $attrs.caption || false;
    };
    ret['link'] = function($scope, $element, $attrs) {
        $scope.ParseCommonOptions = function(data) {
            var ret = '';
            var optionList = ['id', 'caption', 'label', 'seq', 'spanRow', 'needInput'];
            var requireChange = ['spanRow', 'needInput'];
            var changeValue = {spanRow: 'span-row', needInput: 'need-input'};
            
            for(var i = 0; i<optionList.length; i++) {
                var option = optionList[i];
                if(typeof data[option] !== 'undefined') {
                    if(jQuery.inArray(option,requireChange) > -1) {
                        ret += ' ' + changeValue[option] + '="' + data[option] + '"';
                    } else {
                        ret += ' ' + option + '="' + data[option] + '"';
                    }
                }
            }
            return ret;
           
        };
        $scope.LoadData = function() {
            var data = $scope.data;
            if(typeof data === 'undefined' || data === '') { return; }
            
            var container = $element.find("[name='display-contents']");
            container.empty();
            
            jQuery.each(data.block, function(key, val){
                var b = '<div display-block id="' + val.id + '" block-col="' + val.blockCol + '"';
                if(typeof val.blockItem !== "undefined") { b += ' block-item="' + val.blockItem + '"'; }
                if(typeof val.caption !== 'undefined') { b += ' caption="' + val.caption + '"'; }
                if(typeof val.hasBorder !== 'undefined') { b += ' has-border="' + val.hasBorder + '"'; }
                b += '>';
                
                jQuery.each(val.fields, function(key, val) {
                    b += '<div display-field';
                    if(typeof val.value !== 'undefined') { b += ' value="' + val.value + '"'; }
                    b += $scope.ParseCommonOptions(val);
                    b += '></div>';
                });
                b += '</div>';
                var block = $compile(b)($scope);
                container.append(block);
            });
        };
        $scope.LoadData();
    };
    return ret;
}]);