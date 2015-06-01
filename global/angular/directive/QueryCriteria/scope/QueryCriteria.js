appJS.directive('queryCriteria', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/QueryCriteria/template/QueryCriteria.html',
        scope: {
            id: '@',
            queryField: '=',
            data: '='
        },
        controller: function($scope, $element, $attrs, ajaxService) {
            
            $scope.critRow = 0;
            $scope.valueType = ['text'];
            $scope.joinStatus = ['show'];
            $scope.valueRow = [{field: '', exp: '', value: '', join: ''}];
            $scope.joinOptions = [{id: "and", text: "and"},{id: "or", text: "or"}];
        },
        link: function($scope, $element, $attrs) {
            $scope.CheckFieldData = function() {
                $scope.fieldColValue = [];
                if(!$scope.queryField) {
                    //fieldData format -- [{text: "title", children:[{id: "", text: ""}]}]
                    $scope.fieldColValue = $scope.queryField;
                    var elem = $element.find("query-criteria-table");
                    elem.css("display", "none");
                }
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
            $scope.$on("RefreshData", function(event, eventData) {
                if(!$scope.BeforeEvent(eventData)) { return; }
                
                if(eventData.value) {
                    $scope.$apply(function() {
                        $scope.fieldColValue = eventData.value;
                        $scope.ClearData();
                    });  
                }
            });
            $scope.$on("QueryFieldChange", function(event, eventData) {
                var rowNo = eventData.id.split('-')[2];
                //fieldType format -- name_type;
                var fieldType = eventData.value.split('|')[1];
                var exp = $scope.MapType2Exp(rowNo, fieldType);
                
                $scope.$broadcast('RefreshData', {target: 'query-exp-' + rowNo, data: exp})
                
                if(JSON.stringify) {
                    $scope.valueRow[rowNo].field = eventData.value;
                    $scope.$apply(function() {
                        $scope.query_result = JSON.stringify($scope.valueRow);
                    });
                }
            });
            $scope.$on("QueryExpChange", function(event, eventData) {
                var rowNo = eventData.id.split("-")[2];
                var exp = eventData.value;
                var status = /empty/.test(exp);
                
                if(exp === 'between') {
                    $scope.valueType[rowNo] = 'daterange';
                } else if (status) { 
                
                } else {
                    var field = $scope.valueRow[rowNo].field;
                    var fieldType = field.split('|')[1];
                    $scope.MapType2Exp(rowNo, fieldType);
                }
                
                if(JSON.stringify) {
                    $scope.valueRow[rowNo].exp = exp;
                    $scope.$apply(function() {
                        $scope.query_result = JSON.stringify($scope.valueRow);
                    });
                }
            });
            $scope.$on("QueryValueChange", function(event, eventData) {
                var rowNo = eventData.id.split("-")[3];
                if(JSON.stringify) {
                    $scope.valueRow[rowNo].value = eventData.value;
                    $scope.$apply(function() {
                        $scope.query_result = JSON.stringify($scope.valueRow);
                    });
                }
            });
            $scope.MapType2Exp = function(row, type) {
                var ret = {};
                switch(type) {
                    
                    case 'Date':
                    case 'DateTime':
                    case 'Time':
                        ret = ['equal', 'not equal', 'greater than', 'less than', 'greater or equal', 'less or equal', 'between']; 
                        $scope.valueType[row] = 'date';
                        break;                    
                    case 'Boolean':
                        ret = ['true', 'false'];
                        $scope.valueType[row] = 'select';
                        break;
                    case 'Decimal':
                        ret = ['equal', 'not equal'];
                        $scope.valueType[row] = 'text';
                        break;
                    case 'String':
                    default:
                        ret = ['equal', 'not equal', 'contains', 'does not contains', 'empty', 'not empty'];
                        $scope.valueType[row] = 'textrange';
                        break;
                }
                ret = $scope.ConvertSelectOptions(ret);
                return ret;
            };
            $scope.ConvertSelectOptions = function(options) {
                var ret = [];
                jQuery.each(options, function(i, v) {
                    ret.push({id: v, text: v});
                });
                return ret;
            };
            $scope.AddAndCrit = function() {
               
                if($scope.valueRow[$scope.critRow]) {
                    $scope.valueRow[$scope.critRow].join = 'and';
                }
                
                $scope.critRow++;
                $scope.valueRow[$scope.critRow] = {field: '', exp: '', value: ''};
                $scope.valueType[$scope.critRow] = 'text';
                $scope.joinStatus[$scope.critRow] = 'show';
                
                if(JSON.stringify) {
                    $scope.query_result = JSON.stringify($scope.valueRow);
                }
            };
            $scope.AddOrCrit = function() {
               
                if($scope.valueRow[$scope.critRow]) {
                    $scope.valueRow[$scope.critRow].join = 'or';
                }
                
                $scope.critRow++;
                $scope.valueRow[$scope.critRow] = {field: '', exp: '', value: ''};
                $scope.valueType[$scope.critRow] = 'text';
                $scope.joinStatus[$scope.critRow] = 'show';
                
                if(JSON.stringify) {
                    $scope.query_result = JSON.stringify($scope.valueRow);
                }
            };
            $scope.ClearData = function() {
                $scope.critRow = 0;
                $scope.valueType = ['text'];
                $scope.joinStatus = ['show'];
                $scope.valueRow = [{field: '', exp: '', value: '', join: ''}];
                
            };
            $scope.DeleteRow = function(row) {
                if($scope.valueRow.length === 1) { return; }
                
                //alert("Row " + row + "deleted!");
                $scope.valueType.splice(row, 1);
                $scope.valueRow.splice(row, 1);
                $scope.joinStatus.splice(row, 1);
                $scope.critRow = $scope.valueRow.length-1;
                
                if($scope.valueRow.length === 1) {
                    var keys = Object.keys($scope.valueRow);
                    $scope.valueRow[keys[0]].join = "";
                }
            };
            $scope.EditJoin = function(row) {
                $scope.joinStatus[row] = 'edit';
                var sel = $element.find('#select_join-' + row);
                var val = $scope.valueRow[row].join;
                jQuery(sel).select2('val', val);
            };
            $scope.$on("select-blur", function(event, eventData) {
                var index = eventData.id.split('-')[1];
                $scope.$apply(function() {
                    $scope.valueRow[index].join = eventData.value;
                    $scope.joinStatus[index] = 'show';
                    
                    if(JSON.stringify) {
                        $scope.query_result = JSON.stringify($scope.valueRow);
                    }
                });
                
            });
            
            $scope.CheckFieldData();
        }
    };
});