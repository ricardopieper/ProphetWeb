//var app = angular.module('ProphetWeb', ['ui.router', 'ui.materialize', "chart.js"]);
var app = angular.module('ProphetWeb', ['ui.router', 'ui.materialize']);

app.config(
    [
        '$urlRouterProvider',
        function ($urlRouterProvider) {
           // $urlRouterProvider.otherwise('digesters/list');
        }
    ]
);
/*
app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#FF5252', '#FF8A80'],
        responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        datasetFill: false
    });
}]);
*/

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