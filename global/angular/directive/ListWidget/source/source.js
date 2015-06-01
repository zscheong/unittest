(function($) {
    var templates = {
        res001: function() {
            return {
                header: '<span><h3>Temp001 - {{subject}}</h3></span>',
                footer: '<button type="button">Click</button>'
            };
        }
    };
    var engines = {
        res001: function($scope) {
            return {
                BeforeBuild: function() {
                    
                },
                Build: function() {
                    
                },
                AfterBuild: function() {
                    
                }
            };
        }
    };
    
    var methods = {
        getTemplate: function(code) {
            if(templates[code]) {
                return templates[code];
            } else {
                return '';
            }
        },
        getEngine: function(code) {
            if(engines[code]) {
                return engines[code];
            } else {
                return '';
            }
        }
    };
    
    ListWidget = function(method, args) {
        if(methods[method]) {
            return methods[method](args);
        }
    };
    
    
})(jQuery);
