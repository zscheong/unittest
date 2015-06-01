appJS.directive('formWidget', ['$timeout', function(timer) {
    var template = TemplateMap.GetTemplate('form');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       terminal: true,
       templateUrl: 'resource/js/lib/angular/directive/FormWidget/template/' + template + '/FormWidget.html',
       scope: {
           id: '@', data: '='
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/FormWidget/',
               
               col: "2",
               items: []
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs);
            var options = $scope.options;
            
            $scope.library = new FormWidget(template);
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
                    
                        if($scope.data) {
                            $scope.options.col = $scope.data.col;
                            $scope.options.items = $scope.data.items;
                            DataUtils("Angular2Table", $scope, $scope.library.GetDefault());
                        } else {
                            $scope.buildFn.PreBuild($scope, $element);
                        }
                    };
                    $scope.Build = function() {
                        $scope.buildFn.Build($scope, $element);
                    };
                    $scope.PostBuild = function() {
                        var fn = function() { 
                            $scope.buildFn.PostBuild($scope, $element); 
                        };
                        //fn = function() { console.info("Hello World"); }
                        timer(fn, 0);
                    };
                    $scope.ExternalBuild = function() {
                        
                    };
                    
                    
                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
            };
        }
   } 
}]);