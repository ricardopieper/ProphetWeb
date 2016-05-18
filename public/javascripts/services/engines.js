var app = angular.module('ProphetWeb');

app.service('EnginesService', ['$http', function ($http) {

    this.getAll = () => $http.get('/engines').then(x => x.data);

    this.get = (id) => $http.get('/engines/' + id).then(x => x.data);

    this.save = (engine) => $http.post('/engines', engine);

    this.delete = (engine) => $http.delete('/engines/'+ engine.engine_id);
}]);
