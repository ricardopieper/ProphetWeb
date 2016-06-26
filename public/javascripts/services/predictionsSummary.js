var app = angular.module('ProphetWeb');

app.service('PredictionsSummaryService', ['$http', function ($http) {

    this.get = (model_id) => $http.get('/predictions/' + model_id + '/summary').then(x=>x.data);

}]);
