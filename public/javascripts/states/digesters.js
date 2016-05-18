var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('digesters', {
                abstract: true,
                url: '/digesters',
                templateUrl: '/templates/digesters/index.html',
                resolve: {
                    listDigesters: ['DigestersService', function (DigestersService) {
                        return DigestersService.getAll();
                    }],
                }
            }).state('digesters.list', {
                templateUrl: '/templates/digesters/list.html',
                url: '/list',
                controller: "DigestersController",
                controllerAs: "vm",
                resolve: {
                    digester: [function () {
                        return { digester_id: null };
                    }],
                    listDigesters: ['DigestersService', function (DigestersService) {
                        return DigestersService.getAll();
                    }],
                }
            }).state('digesters.edit', {
                templateUrl: '/templates/digesters/form.html',
                url: '/edit/:id',
                controller: "DigestersController",
                controllerAs: "vm",
                resolve: {
                    digester: ['DigestersService', '$stateParams',
                        function (DigestersService, $stateParams) {
                            return DigestersService.get($stateParams.id);
                        }]
                }
            }).state('digesters.new', {
                templateUrl: '/templates/digesters/form.html',
                url: '/new',
                controller: "DigestersController",
                controllerAs: "vm",
                resolve: {
                    digester: [function () {
                        return { digester_id: null };
                    }]
                }
            });
        }
    ]
);
