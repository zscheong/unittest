appJS.directive('webapp', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        compile: function(element) {
            var nav = element.find('nav');
            var navHtml = nav.html();
            var content = element.find('content');
            var contentHtml = content.html();
            var template = '<table style=';
        }
    }; 
});