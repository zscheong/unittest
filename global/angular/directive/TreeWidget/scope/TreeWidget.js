appJS.directive('treeWidget', function() {
    var $ret = {restrict: 'AE', replace: true, transclude: true};
    
    $ret['templateUrl'] = 'public/js/angular/directive/TreeWidget/template/TreeWidget.html';
    $ret['scope'] = {id: '@', data: '='};
    
    $ret['controller'] = function($scope, $element, $attrs) {
        $scope.width = $attrs.width || "200px";
        if(typeof $attrs.maxHeight !== 'undefined') {
            $scope.maxHeight = $attrs.maxHeight;
        }
        
        $scope.$on('RefreshData', function(event, eventData){
            if(!$scope.BeforeEvent(eventData)) { return; }
            
            var tree = $element.fancytree("getTree");
            if(eventData.source !== 'undefined') {
                tree.options.source = eventData.source;
            }
            if(eventData.lazyLoad !== 'undefined') {
                var expandRequest = function(event, data) {
                    var node = data.node;
                    var requestData = eventData.lazyLoad.data;
                    requestData["parentNode"] = node.key;
                    data.result = {
                        url: eventData.lazyLoad.url,
                        data: requestData,
                        cache: false
                    };
                };
                tree.options.lazyLoad = expandRequest;
            }

            tree.reload();
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
    };
    $ret['link'] = function($scope, $element, $attrs) {
        var options = {
            dblclick: function(event, data) {
                var parent = '';
                var loop = data.node.parent;
                while (loop.title !== 'root') {
                    parent += (parent === "")? loop.title : '.' + loop.title;
                    loop = loop.parent;
                }
                $scope.$emit('TreeNodeDBLClick', {node: data.node.title, parentNode: parent});
            }
        };
        
        if($scope.data !== 'undefined') {
            if($scope.data.source !== 'undefined') {
                //source format -- {title: **, key: **}
                var elem = $element.find('>ul');
                elem.remove();
                options['source'] = $scope.data.source; 
            }
            if($scope.data.lazyLoad !== 'undefined') {
                options['lazyLoad'] = function(event, data) {
                    var node = data.node;
                    var requestData = $scope.data.lazyLoad.data;
                    requestData["parentNode"] = node.key;
                    data.result = {
                        url: $scope.data.lazyLoad.url,
                        data: requestData,
                        cache: false
                    };
                };
                $scope.lazyLoad = options['lazyLoad'];
            }
        }
        $element.fancytree(options);
        
        var elem = $element.find('.fancytree-container');
        elem.css("width", $scope.width);
        if(typeof $scope.maxHeight !== 'undefined') {
            elem.css("max-height", $scope.maxHeight);
        }
    };
    return $ret;
});