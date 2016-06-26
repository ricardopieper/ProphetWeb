var app = angular.module('ProphetWeb');

app.service('ModelsService', ['$http', function ($http) {

    this.getAll = () => $http.get('/models').then(x => x.data);

    this.get = (id) => $http.get('/models/' + id).then(x => x.data);

    this.save = (model) => $http.post('/models', model);

    this.scheduleTraining = (model)=> $http.post('/models/train', model);

    this.delete = (model) => $http.delete('/models/'+ model.model_id);
    
    this.inputVars = [
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
        
    this.outputVars = [
        {value:"biogasml", desc:"Biogas Production (ml)"},
        {value:"ch4ml", desc:"CH4 Methane Production (ml)"},
        {value:"co2ml", desc:"CO2 Carbon Dioxide Production (ml)"},
        {value:"energy", desc:"Energy Production"}
    ];             
    
}]);
