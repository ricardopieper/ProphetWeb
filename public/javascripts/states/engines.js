var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('engines', {
                abstract: true,
                url: '/engines',
                templateUrl: '/templates/engines/index.html',
                resolve: {
                    listEngines: ['EnginesService', function (EnginesService) {
                        return EnginesService.getAll();
                    }],
                }
            }).state('engines.list', {
                templateUrl: '/templates/engines/list.html',
                url: '/list',
                controller: "EnginesController",
                controllerAs: "vm",
                resolve: {
                    engine: [function () {
                        return { engine_id: null };
                    }],
                    listEngines: ['EnginesService', function (EnginesService) {
                        return EnginesService.getAll();
                    }],
                }
            }).state('engines.edit', {
                templateUrl: '/templates/engines/form.html',
                url: '/edit/:id',
                controller: "EnginesController",
                controllerAs: "vm",
                resolve: {
                    engine: ['EnginesService', '$stateParams',
                        function (EnginesService, $stateParams) {
                            return EnginesService.get($stateParams.id);
                        }]
                }
            }).state('engines.new', {
                templateUrl: '/templates/engines/form.html',
                url: '/new',
                controller: "EnginesController",
                controllerAs: "vm",
                resolve: {
                    engine: [function () {
                        return { engine_id: null };
                    }]
                }
            });
        }
    ]
);
