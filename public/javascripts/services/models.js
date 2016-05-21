var app = angular.module('ProphetWeb');

app.service('ModelsService', ['$http', function ($http) {

    this.getAll = () => $http.get('/models').then(x => x.data);

    this.get = (id) => $http.get('/models/' + id).then(x => x.data);

    this.save = (engine) => $http.post('/models', engine);

    this.delete = (engine) => $http.delete('/models/'+ engine.engine_id);
}]);
