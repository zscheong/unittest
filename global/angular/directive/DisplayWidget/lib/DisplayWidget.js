(function($) {
    /****************************
     * 
     * Item Parameters
     * seq: compulsory, int
     * label: compulsory, text
     * value: optional, text
     * pan: optional, bool
     *
     ******************************/

    DisplayWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return DisplayWidgetEngine[this.template];
        };
    };
    var methods = {
        PreProcess: function($scope, $element) {
                //Parse Item Data and Move Items to its Container
                var temp = $element.find('[name="display-transclude"]');
                var itemList = temp.find("[name='item']");
                
                //sort the item base on seq
                $.each(itemList, function(i,v) {
                    var itemData = $(v).data();
                    var seq = itemData["seq"];
                    $scope.options.items[seq] = itemData;
                });
                
                DataUtils("Angular2Table", $scope);
                //put item into table
//                var noRowItem = parseInt($scope.options.col);
//                var row = -1, colPoint = 0;
//                $scope.options.itemsTable = [];
//                $.each($scope.options.items, function(i,v) {
//                    if(!v) { return true; }
//                    var pan = v["pan"];
//                    var skipPan = false;
//                    var curr = colPoint % noRowItem;
//                    
//                    if(curr === 0) {
//                        row++;
//                        skipPan = true;
//                    }
//                    if(pan && !skipPan) {
//                        colPoint += noRowItem - curr;
//                        v["panCol"] = noRowItem - curr;
//                    } else {
//                        colPoint++;
//                        v["panCol"] = 1;
//                    }
//                    
//                    if(!$scope.options.itemsTable[row]) { $scope.options.itemsTable[row] = []; }
//                    $scope.options.itemsTable[row][curr] = v;
//                });
//                var lastLength = colPoint % noRowItem;
//                if(lastLength !== 0 ) {
//                    for(var i = lastLength; i<noRowItem; i++) {
//                        $scope.options.itemsTable[row][i] = {label: "empty"};
//                    }
//                }
                
                temp.remove();
        }
    };
    var DisplayWidgetEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                methods.PreProcess($scope, $element);
            },
            Build: function($scope, $element) {
//                methods.CreateTitlePane($scope, $element);
            },
            PostBuild: function($scope, $element) {}
        }
    };
})(jQuery);
