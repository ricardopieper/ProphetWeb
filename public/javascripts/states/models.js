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
                    inputvars: [function() {
                        return [
                            {value:"temp1", desc:"Temperature Top"},
                            {value:"temp2", desc:"Temperature Middle"},
                            {value:"temp3", desc:"Temperature Bottom"},
                            {value:"tempOut", desc:"Temperature Outside"},
                            {value:"pH", desc:"pH"},
                            {value:"pressure", desc:"Pressure"},
                            {value:"retentionTime", desc:"Retention Time"},
                            {value:"substrateConcentration", desc:"Substrate Concentration (g/liter)"},
                            {value:"engineSpeed", desc:"Engine Speed"}
                        ];
                    }],
                    outputvars: [function() {
                        return [
                            {value:"biogasml", desc:"Biogas Production (ml)"},
                            {value:"ch4ml", desc:"CH4 Methane Production (ml)"},
                            {value:"co2ml", desc:"CO2 Carbon Dioxide Production (ml)"},
                            {value:"energy", desc:"Energy Production"}
                        ];
                    }],
                    listEngines: ['EnginesService', function (EnginesService) {
                        return EnginesService.getAll();
                    }],
                    listDigesters: ['DigestersService', function (DigestersService) {
                        return DigestersService.getAll();
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
