(function($) {

    TableWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return TableWidgetEngine[this.template];
        };
    };

    var table_default = {
        dom: 'lfrtip',
        pagingType: 'full_numbers',
        order: [[1, 'desc']],
        aLengthMenu: [20,40,80],
        iDisplayLength: 40,
        
    };
    var TableWidgetEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                
            },
            Build: function($scope, $element) {},
            PostBuild: function($scope, $element) {}
        }
    };
})(jQuery);
