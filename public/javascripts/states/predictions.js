var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('predictions', {
                abstract: true,
                url: '/predictions',
                templateUrl: '/templates/predictions/index.html',
            })
            .state('predictions.summary', {
                templateUrl: '/templates/predictions/summary.html',
                url: '/summary/:id',
                controller: "PredictionsSummaryController",
                controllerAs: "vm",
                resolve: {
                    model: ['ModelsService', '$stateParams',
                        function (ModelsService, $stateParams) {
                            return ModelsService.get($stateParams.id);
                        }
                    ], 
                    summary: ['PredictionsSummaryService', '$stateParams',
                        function (PredictionsSummaryService, $stateParams) {
                            return PredictionsSummaryService.get($stateParams.id);
                        }
                    ], 
                    inputvars: ['ModelsService', function (ModelsService) {
                        return ModelsService.inputVars;
                    }],
                    outputvars: ['ModelsService', function (ModelsService) {
                        return ModelsService.outputVars;
                    }],
                    views: ['ViewsService', function (ViewsService) {
                        return ViewsService.getAll();
                    }]
                }
            })
            .state('predictions.new', {
                templateUrl: '/templates/predictions/form.html',
                url: '/new/:id',
                controller: "PredictionsController",
                controllerAs: "vm",
                resolve: { 
                    model: ['ModelsService', '$stateParams',
                    function (ModelsService, $stateParams) {
                        return ModelsService.get($stateParams.id);
                    }]
                }
            });
        }
    ]
);
