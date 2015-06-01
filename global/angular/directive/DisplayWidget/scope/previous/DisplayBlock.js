appJS.directive('displayBlock', function() {
    var ret = {restrict: 'AE', replace: true, transclude: true};
    ret['templateUrl'] = 'public/js/angular/directive/FormDisplay/template/DisplayBlock.html';
    ret['scope'] = {id: '@'};
    
    ret['controller'] = function($scope, $element, $attrs) {
        $scope.blockCol = $attrs.blockCol || 2;
        $scope.hasBorder = ($attrs.hasBorder === 'true')? true: false;
        $scope.caption = $attrs.caption || false;
        $scope.style = {height: $attrs.height || 'auto'};
        $scope.blockItem = $attrs.blockItem || 0;
        
        //internal variable
        $scope.rowIndex = 0;
        $scope.fieldList = {};
        
        $scope.CheckRow = function() {
            var container = $element.find('#row' + $scope.rowIndex);
            var length = container.find('td').length;
            var ret = false;
            
            if((length % $scope.blockCol) === 0) {
                //if row has full
                ret = true;
            }
            
            //ret meaning -- true: row has full, false: row still available
            return ret;
        };
        $scope.FillRow = function() {
            var status = $scope.CheckRow();
            if(!status) {
                var row = $element.find("#row" + $scope.rowIndex);
                row.append('<td name="display-field-container"></td>');
                $scope.FillRow();
            }
        };
        $scope.AddRow = function() {
            var container = $element.find("[name='display-block-contents']");
            var status = $scope.CheckRow();
            
            if(status) {
                $scope.rowIndex++;
                var $row = '<tr id="row' + $scope.rowIndex + '" name="display-field-row"';
                var c = "";
                if($scope.rowIndex === 1) { c += "first-row"; }
                if($scope.hasBorder) { c += (c === "")? 'row-border' : ' row-border'; }
                $row += (c === "")? "" : ' class="' + c + '"';
                $row += '></tr>';
                container.append($row);
            }
        };
//        this.AddField = function(id, elScope) {
//            var container = $element.find("[name='display-block-contents']");
//            var $el = jQuery('#' + id, '#' + $scope.id);
//                        
//            $scope.AddRow();            
//            container.find('#row' + $scope.rowIndex).append($el);
//            if(elScope.spanRow) {
//                $scope.FillRow();
//            }
//            $scope.fieldList[id] = elScope;
//        };
        this.AddField = function($cScope) {
            $scope.fieldList[$cScope.seq] = $cScope;

            var length = Object.keys($scope.fieldList).length;
            var blockItem = parseInt($scope.blockItem);
            if(blockItem === length) {
                $scope.BuildField();
            }
        };
        $scope.BuildField = function() {
            var container = $element.find("[name='display-block-contents']"); 
            var seqList = Object.keys($scope.fieldList).sort(function(a,b) {return a-b});

            for(var i = 0; i<seqList.length; i++) {
                var seq = seqList[i];
                var $cScope = $scope.fieldList[seq];
                var row_el = $element.find("#row" + $scope.rowIndex);
                var length = row_el.find('>td').length;
                var $el = jQuery('#' + $cScope.id, '#' + $scope.id);

                //Add row
                if((length % $scope.blockCol) === 0) {
                    $scope.rowIndex++;
                    var $row = '<tr id="row' + $scope.rowIndex + '" name="field-row"';
                    var c = "";
                    if($scope.rowIndex === 1) {
                       c += "first-row";
                    }
                    if($scope.rowLine) {
                       c += (c === "")? 'row-border':' row-border';
                    }
                    $row += (c==="")?"": ' class="' + c + '"';
                    $row += '></tr>';
                    container.append($row);
                }
                container.find('#row' + $scope.rowIndex).append($el);
                if($cScope.spanRow) {
                    $scope.FillRow();
                }
            }

        };
    };
    ret['link'] = function($scope, $element, $attrs) {
        $scope.FillRow();
    };
    return ret;
});