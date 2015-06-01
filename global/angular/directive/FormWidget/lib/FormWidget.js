(function($) {
    /****************************
     * 
     * Item Parameters
     * ***************************
     * seq: compulsory, int
     * type: optional, default -- text
     * name: compulsory, text
     * label: compulsory, text
     * 
     * placeholder: optional, default same with label
     * value: optional, text
     * valueList: optional, array(special for picklist)
     * pan: optional, bool
     * 
     * validate: optional, text(class name)
     * validateClass: optional
     *
     ******************************/

    FormWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return FormWidgetEngine[this.template];
        };
        this.GetDefault = function() {
            return form_default;
        };
    };
    var form_default = {
        type: 'text',
        placeholder: '--None--',
        value: '',
        valueList: [],
        pan: false,
        validate: false,
        validateClass: '',
        readonly: false
    };
    var methods = {
        PreProcess: function($scope, $element) {
                //Parse Item Data and Move Items to its Container
                var temp = $element.find('[name="form-transclude"]');
                var itemList = temp.find("[name='item']");
                
                //sort the item base on seq
                $.each(itemList, function(i,v) {
                    var itemData = $(v).data();
                    var seq = itemData["seq"];
                    if(itemData["validateClass"] === "required") { itemData["validateClass"] = ''; }
                    $scope.options.items[seq] = itemData;
                });
                
                DataUtils("Angular2Table", $scope, form_default);
               
                temp.remove();
        },
        PostProcess: function($scope, $element) {
            var sel = $element.find('.form-select');
            if(sel.length) {
                $.each(sel, function(i,v) {
                    var $v = $(v);
                    var selected = $v.data('value');
                    $v.select2({placeholder: "Select an Option", allowClear: true});
                    if(selected) {
                        $v.select2('val', selected);
                    }
                });
                var sel_container = $element.find('.select2-container'); 
                sel_container.css("min-width", "160px");
                sel_container.css("max-width", "400px");
                sel_container.css("width", "85%");
            }
            
            var date = $element.find('.form-date');
            if(date.length) {
                $.each(date, function(i,v) {
                    var $v = $(v);
                    var value = $v.val();
                    var options = {singleDatePicker : true, format: 'DD-MM-YYYY',showDropdowns: true};
                    if(!value) { $v.val(moment().format('DD-MM-YYYY')); }
                    $v.daterangepicker(options);
                });
            }
            
            var readonly = $element.find('.readonly');
            if(readonly.length) {
                $.each(readonly, function(i,v) {
                    var $v = $(v);
                    $v.prop("readonly", true);
                });
            }
        }
    };
    var FormWidgetEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                methods.PreProcess($scope, $element);
            },
            Build: function($scope, $element) {
//                methods.CreateTitlePane($scope, $element);
            },
            PostBuild: function($scope, $element) {
                methods.PostProcess($scope, $element);
            }
        }
    };
})(jQuery);
