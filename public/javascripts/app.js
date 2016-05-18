var app = angular.module('ProphetWeb', ['ui.router']);

app.config(
    [
        '$urlRouterProvider',
        function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('digesters/list');
        }
    ]
);

app.controller('MainController', [function () { }]);

$(function () {
    $(".button-collapse").sideNav();
});