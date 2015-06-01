var appJS = angular.module('APP_JS', []);
appJS.factory('appService', function ($rootScope) {
   return {
       trigger : function(options) {
           if(typeof options.event === 'undefined') { return; }
           var data = options.data || {};
           $rootScope.$broadcast(options.event, data);
       }
   } 
});
appJS.factory('ajaxService', function ($rootScope) {
    var response = {};

    return {
        request : function(request) {
            var host = request.host || '';
            var data = request.data || '';
            var event = request.event || '';

            if(host === '' || data === '' || event === '') { return ''; }

            var req = jQuery.ajax({
                url: host,
                type: "POST",
                data: data
            });
            req.done(function(resp) {
                response = resp;
                response.target = request.target;
                $rootScope.$broadcast(event);
            });
            req.fail(function(jqXHR, textStatus) {
                alert("Ajax Request Failure(" + textStatus + "): " + data); 
            });
        },
        getResponse: function() {
            return response;
        }
    };
});

appJS.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
 
appJS.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);


