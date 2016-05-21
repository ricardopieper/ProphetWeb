var app = angular.module('ProphetWeb', ['ui.router', 'ui.materialize']);

app.config(
    [
        '$urlRouterProvider',
        function ($urlRouterProvider) {
           // $urlRouterProvider.otherwise('digesters/list');
        }
    ]
);

app.controller('MainController', [function () { }]);

app.directive('select', [function () {
    return {
        link: function ($scope, element, attrs) {
            $(element).material_select();
        }
    };
}]);

$(function () {
    $(".button-collapse").sideNav();
    
   
   
});