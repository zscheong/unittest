(function($) {

    BoxLayout = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return BoxLayoutEngine[this.template];
        };
    };

    var BoxLayoutEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                var temp = $element.find('[name="transclude"]');
                var titleChild = temp.find("[name='title']:first");
                var contentChild = temp.find("[name='content']:first");
                
                var titleParent = $element.find('[name="box-title"]:first');
                var contentParent = $element.find('[name="box-content"]:first');
                
                if(titleChild.length) {
                    titleParent.append(titleChild);
                } else {
                    titleParent.remove();
                }
                
                if(contentChild.length) {
                    contentParent.append(contentChild);
                } else {
                    contentParent.remove();
                }
                temp.remove();
            },
            Build: function($scope, $element) {},
            PostBuild: function($scope, $element) {}
        }
    };
})(jQuery);
