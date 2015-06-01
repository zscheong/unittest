(function($) {

    NavWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return NavWidgetEngine[this.template];
        };
    };
    
    var NavWidgetEngine = {
        default: {
            PreBuild: function($scope, $element) {},
            Build: function($scope, $element) {
                
            }
        }
    };
    
})(jQuery);
