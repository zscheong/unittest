appJS.directive('listWidget', ['$compile', function($compile) {
    var $ret = {restrict: 'AE', replace: true, transclude: true};
    
    $ret['templateUrl'] = 'public/js/angular/directive/ListWidget/template/ListWidget.html';
    $ret['scope'] = {id: '@', data: '='};
    
    $ret['controller'] = function($scope, $element, $attrs) {
        $scope.width = $attrs.width || "200px";
        
        $scope.style = {width: $scope.width};
        
        $scope.prefix = 'list-';
        $scope.subject = "Hello World";
        $scope.templateCode = ($attrs.template)? 'res' + $attrs.template: 'res001';
        $scope.template = ListWidget('getTemplate', $scope.templateCode);
        $scope.engine = ListWidget('getEngine', $scope);
        
    };
    $ret['link'] = function($scope, $element, $attrs) {
        $scope.MergeTemplate = function() {
            jQuery.each($scope.template, function(tempSess, temp) {
                var sess = $element.find('[name="' + $scope.prefix + tempSess + '"]');
                if(sess) {
                    var $temp = $compile(temp)($scope);
                    sess.append($temp);
                }
            });
            
        };
        $scope.CreateWidget = function() {
            $scope.engine["BeforeBuild"].apply($element, $scope);
            $scope.engine["Build"].apply($element, $scope);
            $scope.engine["AfterBuild"].apply($element, $scope);
        };
        
        $scope.Flow = function(){
            $scope.MergeTemplate();
            
            $scope.CreateWidget();
        };
        
        $scope.Flow();
    };
    return $ret;
}]);