appJS.directive('contentLayout', ['$compile', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/ContentLayout/Simple/template/ContentLayout.html',
        controller: ['$scope', '$element', '$attrs', 'appService', function($scope, $element, $attrs, appService){
            
        }],
        link: function($scope, $element, $attrs) {
            var nav = $element.find('.navigation');
//            var navHtml = nav.contents();
            var content = $element.find('.content');
//            var contentHtml = content.html();
          
            var navContainer = $element.find("[name='nav-sess']");
            var contentContainer = $element.find("[name='content-container']");
            navContainer.append(nav);
            contentContainer.append(content);
            
//            var holder = $element.find("[name='holder']");
//            $compile(holder)();
//            $compile(navContainer)();
//            $compile(contentContainer)();
            
            var temporary = $element.find("[name='temporary']");
            temporary.remove();
        }
    }; 
}]);