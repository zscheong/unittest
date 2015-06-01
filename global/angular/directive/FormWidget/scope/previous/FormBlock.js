appJS.directive('formBlock', ['$compile', 'ajaxService', function($compile, ajaxService) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/Form/template/FormBlock.html',
        scope: {
            id: '@'
        },
        controller: function($scope, $element, $attrs, ajaxService) {
            //user input variable
            $scope.blockCol = $attrs.blockCol || 2;
            this.id = $scope.id;
            this.blockCol = $scope.blockCol;
            
            $scope.blockItem = $attrs.blockItem || 0;
            $scope.hasBorder = ($attrs.hasBorder === 'true')? true: false;
            $scope.rowLine = ($attrs.rowLine === 'true')? true: false;
            $scope.caption = $attrs.caption || false;
            $scope.containerStyle = {height: $attrs.height || 'auto'};
            $scope.headerStyle = {};
            
            if($scope.hasBorder) { 
                $scope.containerStyle["border"] = "1px solid #aaa"; 
                $scope.containerStyle["border-radius"] = "5px";
                $scope.headerStyle["border-bottom"] = "1px solid #aaa";
            }
            if($scope.caption) {
                $scope.headerStyle["padding"] = "5px";
            }
            
            
            //internal variable
            $scope.rowIndex = 0;
            $scope.fieldList = {};
            
            //events
//            $scope.$on('formRefresh', function() {
//                var response = ajaxService.getResponse();
//                if(!$scope.BeforeEvent(response)) {
//                    return;
//                }
//                
//                var responseResult = response.response;
//                var container = jQuery("[name='block-contents']", '#' + $scope.id);
//                container.empty();
//                $scope.rowIndex = 0;
//                $scope.fieldList = {};
//                
//                angular.forEach(responseResult, function(val, key) {
//                    var $el = $compile('<div form-field id="field' + val.name + '" caption="' + val.caption + 
//                                    '" type="' + val.type + '" name="' + val.name + '"></div>')($scope);
//                    container.append($el);
//                });
//                
//            });
//            
//            //private method
//            $scope.BeforeEvent = function(response) {
//                if(typeof response === 'undefined') {
//                    return false;
//                }
//                if(response.target !== $scope.id) {
//                    return false;
//                } 
//                return true;
//            };
            
            $scope.FillRow = function() {
                var container = $element.find("#row" + $scope.rowIndex);
                var length = container.find('>td').length;
                if((length % $scope.blockCol) !== 0 ) {
                    container.append('<td name="field-container"></td>');
                    $scope.fieldList['field_row' + $scope.rowIndex + '_col' + length] = '';
                    $scope.FillRow();
                }
            };
           
            this.AddField = function($cScope) {
                $scope.fieldList[$cScope.seq] = $cScope;
                
                var length = Object.keys($scope.fieldList).length;
                var blockItem = parseInt($scope.blockItem);
                if(blockItem === length) {
                    $scope.BuildField();
                }
            };
            $scope.BuildField = function() {
                var container = $element.find("[name='block-contents']"); 
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
                
//                $scope.fieldList[el] = elScope;
            };
            
        },
        link: function($scope, $element, $attrs) {
            $scope.registerFooterEvent = function() {
                var footer = $element.find('[name="block-footer"]');
                var btn = footer.find('button');
                jQuery.each(btn, function(i,v) {
                   jQuery(v).click(function() {
                       $scope.$emit('FormButton', {id: v.id});
                   }); 
                });
            };
            $scope.AddFooter = function() {
                var contents = $element.find("[name='block-footer-content']");
                var container = jQuery('<div name="block-footer"></div>');
                
                if(contents.length !== 0) {
                    $element.append(container);
                    container.append(contents);
                    $scope.registerFooterEvent();
                }
            };
            
           $scope.FillRow();
           $scope.AddFooter();
        }
    };
}]);