var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('models', {
                abstract: true,
                url: '/models',
                templateUrl: '/templates/models/index.html',
                resolve: {
                    listModels: ['ModelsService', function (ModelsService) {
                        return ModelsService.getAll();
                    }],
                }
            }).state('models.list', {
                templateUrl: '/templates/models/list.html',
                url: '/list',
                controller: "ModelsController",
                controllerAs: "vm",
                resolve: {
                    model: [function () {
                        return { model_id: null };
                    }],
                    listModels: ['ModelsService', function (ModelsService) {
                        return ModelsService.getAll();
                    }],
                }
            }).state('models.edit', {
                templateUrl: '/templates/models/form.html',
                url: '/edit/:id',
                controller: "ModelsController",
                controllerAs: "vm",
                resolve: {
                    model: ['ModelsService', '$stateParams',
                        function (ModelsService, $stateParams) {
                            return ModelsService.get($stateParams.id);
                        }]
                }
            }).state('models.new', {
                templateUrl: '/templates/models/form.html',
                url: '/new',
                controller: "ModelsController",
                controllerAs: "vm",
                resolve: {
                    model: [function () {
                        return { model_id: null };
                    }]
                }
            });
        }
    ]
);
