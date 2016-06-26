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
                    listEngines: ['EnginesService', function (EnginesService) {
                        return EnginesService.getAll();
                    }],
                    listDigesters: ['DigestersService', function (DigestersService) {
                        return DigestersService.getAll();
                    }],
                    inputvars: ['ModelsService', function(ModelsService) {
                        return ModelsService.inputVars;
                    }],
                    outputvars: ['ModelsService', function(ModelsService) {
                        return ModelsService.outputVars;
                    }]
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
                    listModels: ['ModelsService', 'inputvars', 'outputvars', 
                        function (ModelsService, inputvars, outputvars) {
                            return ModelsService.getAll().then(result=> {
                                return result.map(x=> {
                                    
                                    var inputVars = (x.inputvars||[]).map(y => 
                                            (inputvars.filter(z=>z.value == y) 
                                            || [{desc: "Nothing"}])[0]);
                                    
                                    
                                    var outputVars = (outputvars.filter(y=>y.value == x.outputvar) 
                                        || [{desc: "Nothing"}])[0].desc;
                                    
                                    
                                    x.inputvarsDesc = inputVars.map(y=>y.desc).join(", ");
                                    x.outputvarDesc = outputVars;
                                    return x;
                                })
                            });
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
