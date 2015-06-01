appJS.directive('tableWidget', function() {
    var template = TemplateMap.GetTemplate('table');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       templateUrl: 'resource/js/lib/angular/directive/TableWidget/template/' + template + '/TableWidget.html',
       scope: {
           id: '@'
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/TableWidget/'
                             
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs)
            var options = $scope.options;
            
            $scope.library = new TableWidget(template);
            $scope.buildFn = $scope.library.GetBuildFn();
            
            //Add CSS file
            DataUtils("AddCSS", options.root + 'css/' + options.stylish + '/style.css' );
            
       },
//       link: function($scope, $element, $attrs) {
        compile: function compile($element, $attrs, transclude) {
            return {
                pre: function preLink($scope, $element, $attrs, $controller) {
                },
                post: function postLink($scope, $element, $attrs, $controller) {
                    $scope.PreBuild = function() {
                        $scope.buildFn.PreBuild($scope, $element);

                       
                    };
                    $scope.Build = function() {var toolbar = $element.find("[name='box-toolbar']");
                        $scope.buildFn.Build($scope, $element);
                    };
                    $scope.PostBuild = function() {
                        $scope.buildFn.PostBuild($scope, $element);
                    };
                  
                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
           }
        }
   } 
});