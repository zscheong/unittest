(function($) {

    TabWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return TabWidgetEngine[this.template];
        };
    };
    var methods = {
        PreProcess: function($scope, $element) {
                //Parse Item Data and Move Items to its Container
                var temp = $element.find('[name="tab-transclude"]');
                var alignPanel = $element.find("[name='tab-pane-" + $scope.options.align + "']");
                var paneContainer = alignPanel.find("[name='tab-pane-container']")
                
                var paneList = temp.find("[name='tab-pane']");
                $.each(paneList, function(i,v) {
                    var pane = $(v);
                    var seq = pane.data("seq");
                    var itemData = pane.data();
                    $scope.options.items[seq] = pane.data();
                    if(seq === 0) {
                        pane.addClass("tab-pane-active");
                        $scope.options.activeItem = seq;
                    } else {
                        pane.addClass("tab-pane-inactive");
                    }
                    
                    var content = $('body').find('#' + itemData.ref);
                    if(content.length) {
                        pane.append(content);
                    }
                    pane.attr("id", "tabID" + seq);
                    paneContainer.append(pane);
                });
                temp.remove();
        }
    };
    var TabWidgetEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                methods.PreProcess($scope, $element);
            },
            Build: function($scope, $element) {
//                methods.CreateTitlePane($scope, $element);
            },
            PostBuild: function($scope, $element) {}
        }
    };
})(jQuery);
