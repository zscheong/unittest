appJS.directive('tableWidget', function() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'public/js/angular/directive/TableWidget/template/TableWidget.html',
        scope: {
            data: '=',
            id: '@'        
        },
        controller: function($scope, $element, $attrs) {
            $scope.$on('RefreshData', function(event, eventData){
                if(!$scope.BeforeEvent(eventData)) { return; }

                var container = $element.find('[name="table-content"]');
                container.empty();
                container.append('<table style="width:100% !important"></table>');

                var options = {};
                options = $scope.ParseData(eventData);
//                var options = {dom: 'lpfrtip', pagingType: 'full_numbers'};
//                if(eventData.data) { options['data'] = eventData.data; }
//                if(eventData.column) { options['aoColumns'] = eventData.column; }

                var elem = $element.find('table');
                elem.dataTable(options);
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
            $scope.ParseData = function(data) {
                var options = {dom: 'lfrtip', pagingType: 'full_numbers'};
                if(typeof data !== 'undefined') {
                    if(data.data) { options['data'] = data.data; } 
                    if(data.columns) { options['aoColumns'] = data.columns; }
                    if(data.lengthMenu) { options['aLengthMenu'] = data.lengthMenu; }
                    if(data.displayLength) { options['iDisplayLength'] = data.displayLength; }
                    if(data.serverSide) { options['serverSide'] = data.serverSide; }
                    if(data.processing) { options['processing'] = data.processing; }
                    if(data.ajax) { options['ajax'] = data.ajax; }
                }
                return options;
            };
        },
        link: function($scope, $element, $attrs) {
            var contents = $element.find('table');
            var options = {};
            if($scope.data) { options = $scope.ParseData($scope.data); } 
//            var options = {dom: 'lpfrtip', pagingType: 'full_numbers'};
//            
//            if(typeof $scope.data !== 'undefined') {
//                if(typeof $scope.data.data !== 'undefined') { options['data'] = $scope.data.data; } 
//                if(typeof $scope.data.columns !== 'undefined') { options['aoColumns'] = $scope.data.columns; }
//                if(typeof $scope.data.lengthMenu !== 'undefined') { options['aLengthMenu'] = $scope.data.lengthMenu; }
//                if(typeof $scope.data.displayLength !== 'undefined') { options['iDisplayLength'] = $scope.data.displayLength; }
//                if(typeof $scope.data.serverSide !== 'undefined') { options['serverSide'] = $scope.data.serverSide; }
//                if(typeof $scope.data.processing !== 'undefined') { options['processing'] = $scope.data.processing; }
//                if(typeof $scope.data.ajax !== 'undefined') { options['ajax'] = $scope.data.ajax; }
//            }
//                contents.dataTable({data: $scope.data.rows, aoColumns: $scope.data.columns, dom: 'lpfrtip', pagingType: 'full_numbers',
//                    aLengthMenu: [20, 40, 80], iDisplayLength: 40});
            contents.dataTable(options);
        }
    };
});
