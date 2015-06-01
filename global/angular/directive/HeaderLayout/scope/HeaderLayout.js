appJS.directive('headerLayout', function() {
    var template = TemplateMap.GetTemplate('header');
    return {
       restrict: 'E',
       replace: true,
       transclude: true,
       templateUrl: 'public/js/angular/directive/HeaderLayout/template/' + template + '/HeaderLayout.html',
       scope: {
           menuTarget: '@'
       },
       controller: ['$scope', '$element', '$attrs', 'appService', function($scope, $element, $attrs, appService){
            $scope.logoSrc = $attrs.logoSrc || false;
            $scope.logoText = $attrs.logoText || false;
            $scope.hasCompanyInfo = ($scope.logoSrc || $scope.logoText)? true: false;
            
            $scope.toggleDisplay = function() {
                var id = $scope.menuTarget;
                appService.trigger({event: 'WidgetDisplay', data: {target: id, toggle: true}});
            };
       }]
   } 
});