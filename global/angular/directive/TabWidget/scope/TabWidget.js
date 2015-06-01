appJS.directive('tabWidget', function() {
    var template = TemplateMap.GetTemplate('tab');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       terminal: true,
       templateUrl: 'resource/js/lib/angular/directive/TabWidget/template/' + template + '/TabWidget.html',
       scope: {
           id: '@'
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/TabWidget/',
               
               items: [],
               align: 'top'
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs);
            var options = $scope.options;
            
            $scope.library = new TabWidget(template);
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
                    $scope.Build = function() {
                        $scope.buildFn.Build($scope, $element);
                    };
                    $scope.PostBuild = function() {
                        $scope.buildFn.PostBuild($scope, $element);
                    };
                    $scope.Select = function(seq) {
                        var previous = $scope.options.activeItem;
                        $scope.options.activeItem = seq;
                        
                        var prev_elem = $element.find('#tabID' + previous);
                        prev_elem.removeClass('tab-pane-active');
                        prev_elem.addClass('tab-pane-inactive');
                        
                        var curr_elem = $element.find('#tabID' + seq);
                        curr_elem.removeClass('tab-pane-inactive');
                        curr_elem.addClass('tab-pane-active');
                    };
                        
                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
            };
        }
   } 
});