appJS.directive('navWidget', function() {
    var template = TemplateMap.GetTemplate('nav');
    return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       terminal: true,
       templateUrl: 'resource/js/lib/angular/directive/NavWidget/template/' + template + '/NavWidget.html',
       scope: {
           id: '@', data: '='
       },
       controller: function($scope, $element, $attrs){
            $scope.default = {
               stylish: 'default',
               root: 'resource/js/lib/angular/directive/NavWidget/',
               
               orient: 'vertical'
            }; 
           
            $scope.options = jQuery.extend({}, $scope.default, $attrs)
            var options = $scope.options;
            
            //Add CSS file
            DataUtils("AddCSS", options.root + 'css/' + options.stylish + '/style.css' );
            
       },
//       link: function($scope, $element, $attrs) {
        compile: function compile($element, $attrs, transclude) {
            return {
                pre: function preLink($scope, $element, $attrs, $controller) {
                },
                post: function postLink($scope, $element, $attrs, $controller) {
                    $scope.CreateHTML = function(data) {
                        var ret = '<ul>';
                        jQuery.each(data, function(i,v) {
                            ret += '<li>';
                            ret += (v.ref)? '<a href="' + v.ref + '">' + v.name + '</a>' : "<a href=#>" + v.name + "</a>";
                            if(v.child) {
                                ret += $scope.CreateHTML(v.child);
                            }
                            ret += '</li>';
                        });
                        ret += '</ul>';
                        return ret;
                    }; 
                    $scope.PreBuild = function() {
                        if($scope.data) {
                            //data -- [{name: <value>, ref: <value>, child: {[]}}]
                            var content = $element.find("[name='nav-content']");
                            content.empty();
                            var html = $scope.CreateHTML($scope.data);
                            content.append(html);
                        }
                        if($scope.options.orient === 'horizontal') {
                            var first = $element.find("[name='nav-content'] > ul >li");
                            first.addClass("first-level");
                        }
                    };
                    $scope.Build = function() {
                        
                        var subLevel = $element.find("[name='nav-content'] li>ul");
                        jQuery.each(subLevel, function(i,v) {
                            var $this = jQuery(v);
                            var parent = $this.closest('li');
                            if($scope.options.orient === 'vertical') {
                                parent.append("<span class='glyphicon glyphicon-chevron-right'></span>");
                            } else if($scope.options.orient === 'horizontal') {
                                if(parent.hasClass('first-level')) {
                                    parent.append("<span class='glyphicon glyphicon-chevron-down' style='color:#acacac'></span>")
                                } else {
                                    parent.append("<span class='glyphicon glyphicon-chevron-right'></span>");
                                }
                            }
                        });
               
                    };
                    $scope.PostBuild = function() {
                    };

                    $scope.PreBuild();
                    $scope.Build();
                    $scope.PostBuild();
                }
            }
        }
   } 
});