appJS.directive('boxLayout', function() {
    var template = TemplateMap.GetTemplate('header');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       templateUrl: 'resource/js/lib/angular/directive/BoxLayout/template/' + template + '/BoxLayout.html',
       scope: {
           id: '@'
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/BoxLayout/',
               corner: 'full',
               category: 'content',
               layout: 'box',
               tools: 'yes',
               autoPadding: 'yes'
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs);
            $scope.options.cornerClass = 'box-corner-' + $scope.options.corner + '-' + $scope.options.stylish;
            var options = $scope.options;
            
            $scope.library = new BoxLayout(template);
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

                        var title = $element.find("[name='title']:first");
                        if(title.length) {
                            title.css("display", "inline-block");
                        }
                        if($scope.options.autoPadding === "yes") {
                            var titleContainer = $element.find("[name='box-title']:first");
                            var contentContainer = $element.find("[name='box-content']:first");
                            titleContainer.css("padding", "5px 10px");
                            contentContainer.css("padding", "10px 10px");
                        }
                    };
                    $scope.Build = function() {var toolbar = $element.find("[name='box-toolbar']");
                        $scope.buildFn.Build($scope, $element);
                    };
                    $scope.PostBuild = function() {
                        $scope.buildFn.PostBuild($scope, $element);
                    };
                    $scope.Maximize = function() {
                        var overlay = jQuery('body').find("[name='template-overlay']");
                        if(overlay.length) {
                            overlay.css('display', 'block');
                        } else {
                            jQuery('body').append('<div name="template-overlay" class="overlay-container"></div>');
                            var overlay = jQuery('body').find("[name='template-overlay']");
                            overlay.css('display', 'block');
                        }
                    };

                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
           }
        }
   } 
});