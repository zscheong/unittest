appJS.directive('formTag', ['$compile', 'ajaxService', function($compile,ajaxService) {
   return {
       restrict: 'AE',
       replace: true,
       transclude: true,
       templateUrl: 'public/js/angular/directive/Form/template/FormTag.html',
       scope: {
           id: '@',
           data: '='
       },
       controller: function($scope, $element, $attrs, ajaxService) {
           //user input variable
           $scope.style = {width: $attrs.width || '800px' };
           $scope.hasBorder = ($attrs.hasBorder === 'true')? true : false;
           $scope.caption = $attrs.caption || false;
           $scope.type = ($attrs.type === 'ajax')? 'ajax' : 'normal';
           $scope.hasSubmit = ($attrs.hasSubmit === 'false')? false: true;
           
           //event
           $scope.$on("WidgetDisplay", function(event, data) {
                if(!$scope.BeforeEvent(data)) { return; }
                var container = jQuery('#' + $scope.id);

                if(data.display) {
                    container.css('display', 'block');
                    container.animate({opacity: "0"}, 1000, "linear");
                } else {
                    container.animate({opacity: "0"}, 1000, "linear", function() {
                       container.css('display', 'none'); 
                    });
                    //container.css('display', 'none');
                }
           });
           $scope.BeforeEvent = function(data) {
                if(typeof data === 'undefined') {
                    return false;
                }
                if(data.target !== $scope.id) {
                    return false;
                } 
                return true;
            };
            
           $scope.AjaxSubmit = function(el) {
               var data = el.serialize();
               var req = jQuery.ajax({
                   url: 'index.php',
                   type: 'POST',
                   data: data
               });
               req.done(function(resp) {
                    var response = resp.response;
                    var d = response.data || {};
                    if(response.status) {
                        $scope.$emit(response.trigger, d);
                  }
               }); 
               req.fail(function(jqXHR, textStatus) {
                  alert("Ajax Request Failure(" + textStatus + ")!"); 
               });
           };           
           
           $scope.ValidateSelect = function() {
                var status = true;
                var select = $element.find('select.select-required');
                jQuery.each(select, function(i,v) {
                    var cell = jQuery(v).closest('[name="field-cell"]');
                    var prompt = cell.find('.undefinedformError');
                    prompt.remove();
                    var display = cell.css('display');
                    if(display === 'none') { return true; }
                    
                    var opts = jQuery(v).select2('data');
                    var anchor = cell.find('[name="field-contents"]');
                    if(opts === null || opts.text === '') {
                        jQuery(anchor).validationEngine('showPrompt', 'This is required', 'red', 'topLeft', true);
                        status = false;
                    }
                });
                return status;
           };
           $scope.Validate = function() {
                
                var container = jQuery('form', '#' + $scope.id);
                //container.validationEngine();
                container.validationEngine('attach', {promptPosition : "topLeft", scroll: false});
                var status = container.validationEngine('validate');
                var selectStatus =  $scope.ValidateSelect();
                
                status = status && selectStatus;
                
                if(status) {
                    if($scope.type === "ajax") {
                        $scope.AjaxSubmit(container);
                    } else {
                        container.unbind("submit");
                        $scope.$emit('FormSubmit', {id: $scope.id})
                    }
                } else {
                    container.submit(function(e) {
                        e.preventDefault();
                    });
                }               
           };
           
       },
       link: function($scope, $element, $attrs) {
           //function prototype
           $scope.LoadData = function() {
                var data = $scope.data;
                if(typeof data === 'undefined' || data === '') { return; }
                
                var container = $element.find("[name='form-contents']");
                container.empty();
                
                if(typeof data.hidden !== "undefined") {
                    var hidden = "";
                    jQuery.each(data.hidden, function(key, val) {
                        hidden += '<input type="hidden" name="' + key + '" value="' + val + '"/>';
                    });
                    container.append(hidden);
                }
                jQuery.each(data.block, function(key, val) {
                    var b = '<div form-block id="' + val.id + '"';
                    if(typeof val.blockItem !== "undefined") { b += ' block-item="' + val.blockItem + '"'; }
                    if(typeof val.blockCol !== "undefined") { b += ' block-col="' + val.blockCol + '"'; }
                    if(typeof val.caption !== "undefined") { b += ' caption="' + val.caption +'"'; }
                    if(typeof val.hasBorder !== "undefined") { b += ' has-border="' + val.hasBorder + '"'; }
                    b += '>';
                    jQuery.each(val.fields, function(key, val) {
                        var type = (typeof val.displayType !== "undefined")? val.displayType: "default";
                        b += $scope.CreateChild(type, val);
                    });
                    if(typeof val.footer !== "undefined") { b+= val.footer; }
                    b += '</div>';
                    var block = $compile(b)($scope);
                    container.append(block);
                });               
           };
           $scope.ParseCommonOptions = function(data) {
                var ret = '';
                var optionList = ['id', 'caption', 'label', 'seq', 'spanRow', 'requireType', 'readonly', 'visibility', 'opBtn', 'placeholder'];
                var requireChange = ['spanRow', 'requireType', 'opBtn'];
                var changeValue = {spanRow: 'span-row', requireType: 'require', opBtn: 'op-btn'};
                for (var i = 0;i<optionList.length; i++) {
                    var option = optionList[i];
                    if(typeof data[option] !== "undefined") {
                        if(jQuery.inArray(option, requireChange) > -1) {
                            ret += ' ' + changeValue[option] + '="' + data[option] + '"';
                        } else {
                            ret += ' ' + option + '="' + data[option] + '"';
                         }
                    }
                }
                return ret;
           };
           $scope.CreateChild = function(type, data) {
                var ret = "";
                switch(type) {
                    case "Picklist":
                        ret += '<select form-select';
                        if(typeof data.changeEvent !== "undefined") { ret += ' change-event="' + data.changeEvent + '"'; }
                        if(typeof data.value !== "undefined") { ret+= ' value="' + data.value + '"'; }
                        ret += $scope.ParseCommonOptions(data);
                        ret += '>';
                        
                        ret += '><option></option>';
                        
                        if(typeof data.data !== 'undefined') {
                            jQuery.each(data.data, function(key, val) {
                                ret += '<option value="' + val.id + '"';
                                /*
                                if(typeof data.value !== 'undefined' && data.value === val.id) {
                                    ret += ' selected="selected"';
                                }*/
                                ret += '>' + val.text + '</option>'; 
                            });
                        }
                        ret += '</select>';
                        break;
                    case "Date": 
                        ret += '<div form-date';
                        if(typeof data.single !== "undefined") { ret+= ' single="' + data.single + '"'; }
                        if(typeof data.value !== "undefined") { ret+= ' value="' + data.value + '"'; }
                        ret += $scope.ParseCommonOptions(data);
                        ret += '></div>';
                        break;
                    case "Textbox":
                    default:
                        ret += '<div form-field type="' + data.widgetType + '"';
                        if(typeof data.value !== "undefined") { ret+= ' value="' + data.value + '"'; }
                        ret += $scope.ParseCommonOptions(data);
                        ret += '></div>';
                           break;
                }
                return ret;
           };
           
           //Initialize
           if($scope.type === "ajax") {
                var btn = $element.find('button');
                btn.click(function(e) {
                   e.preventDefault(); 
                });
           }
           var form = $element.find("form");
           if($scope.hasSubmit) {
                var elem = $element.find("[name='form-submit']");
                form.append(elem);
           } else {
                form.remove();
                var elem = $element.find("[name='form-footer']");
                elem.remove();
           }
           $scope.LoadData();
       }
   }; 
}]);