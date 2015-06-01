appJS.directive('sliderWidget', function() {
    var template = TemplateMap.GetTemplate('slider');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       terminal: true,
       templateUrl: 'resource/js/lib/angular/directive/SliderWidget/template/' + template + '/SliderWidget.html',
       scope: {
           id: '@'
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/SliderWidget/',
               
               items: [],
               hasThumb: false,
               width: '600px',
               height: '300px'
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs);
            var options = $scope.options;
            
            $scope.library = new SliderWidget(template);
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
                        var container = $element.find("[name='slider-container']");
                        container.css({width: $scope.options.width, height: $scope.options.height});
                        var content = $element.find(".slider-content-container");
                        content.css({width: $scope.options.width, height: $scope.options.height});
                    };
                    $scope.Build = function() {
                        $scope.buildFn.Build($scope, $element);
                    };
                    $scope.PostBuild = function() {
                        $scope.buildFn.PostBuild($scope, $element);
                    };
                    
                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
            };
        }
   } 
});