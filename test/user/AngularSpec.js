describe('Hello World Example', function() {
   beforeEach(module('myApp'));
   
   var HelloWorldController, scope;
   
   beforeEach(inject(function($rootScope, $controller) {
       scope = $rootScope.$new();
       HelloWorldController = $controller('HelloWorldController',{ $scope: scope });
   }));
   
   it('says hello world!', function() {
      expect(scope.greeting).toEqual("Hello World!"); 
   });
});

describe('Angular Service', function() {
   beforeEach(module('myApp'));
   
   var service;
   
   beforeEach(inject(function(SimpleService){
       service = SimpleService;
   }));
   
   it("should return an array of items", function() {
      expect(service.getData()).toBeDefined(); 
   });
});

describe('Testing sampleOne directive', function() {
    var scope, elem, directive, compiled, html;
    beforeEach(function() {
        module('myApp');
        html = '<div sample-one="foo"></div>';
        
        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();
            elem = angular.element(html);
            compiled = $compile(elem);
            compiled(scope);
            scope.$digest();
        })
    });
    it("Should set the text of the element to whatever was passed", function() {
       scope.foo = 'bar';
       expect(elem.text()).toBe('');
       elem[0].click();
       expect(elem.text()).toBe('bar');
    });
})
