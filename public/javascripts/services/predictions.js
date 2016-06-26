var app = angular.module('ProphetWeb');

app.service('PredictionsService', ['$http', function ($http) {

    this.save = (predConfig) => $http.post('/predictions', predConfig);

    this.getAll = () => $http.get('/predictions').then(x => x.data);

    this.get = (model_id, prediction_id) => $http.get('/predictions/' + model_id + '/' + prediction_id)
                    .then(x => x.data);

}]);
