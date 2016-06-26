var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('views', {
                abstract: true,
                url: '/views',
                templateUrl: '/templates/views/index.html',
                resolve: {
                    listViews: ['ViewsService', function (ViewsService) {
                        return ViewsService.getAll();
                    }],
                    view: [function () { return {}; }],
                    charts: [function () { return []; }]
                }
            })
                .state('views.list', {
                    templateUrl: '/templates/views/list.html',
                    url: '/list',
                    controller: "ViewsController",
                    controllerAs: "vm",
                    resolve: {
                        listViews: ['ViewsService', function (ViewsService) {
                            return ViewsService.getAll();
                        }],
                        view: [function () { return {}; }],
                        charts: [function () { return [];}]
                    }
                })
                .state('views.view', {
                    templateUrl: '/templates/views/view.html',
                    url: '/:id',
                    controller: "ViewsController",
                    controllerAs: "vm",
                    resolve: {
                        view: ['ViewsService', '$stateParams',
                            function (ViewsService, $stateParams) {
                                return ViewsService.get($stateParams.id);
                            }],
                        charts: ['ModelsService', 'view', 'PredictionsService', function (ModelsService, view, PredictionsService) {

                            var vars = ModelsService.inputVars.concat(ModelsService.outputVars).reduce((prev, cur) => {
                                prev[cur.value] = cur.desc;
                                return prev;
                            }, {});

                            var promises = [];
                            for (var i = 0; i < view.predictions.length; i++) {
                                var viewchart = view.predictions[i];

                                promises.push(PredictionsService.get(viewchart.model_id, viewchart.prediction_id).then(predictions => {
                                    return ModelsService.get(viewchart.model_id).then(model => {
                                        var prediction = predictions[0];

                                        var labels = [];
                                        var step = (prediction.tovalue - prediction.fromvalue)
                                            / prediction.amountpredictions;

                                        for (var i = 1; i <= prediction.amountpredictions; i++) {
                                            labels.push((prediction.fromvalue + (i * step)).toFixed(2));
                                        }
                               
                                        return {
                                            labels: labels,
                                            data: prediction.result.split(",").map(parseFloat),
                                            yaxis: vars[model.outputvar],
                                            xaxis: vars[prediction.inputvar],
                                            series: [vars[model.outputvar]],
                                            model: model
                                        };
                                    });

                                }));

                            }

                            return Promise.all(promises);


                        }]
                    }
                })
        }
    ]
);
