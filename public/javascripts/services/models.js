var app = angular.module('ProphetWeb');

app.service('ModelsService', ['$http', function ($http) {

    this.getAll = () => $http.get('/models').then(x => x.data);

    this.get = (id) => $http.get('/models/' + id).then(x => x.data);

    this.save = (model) => $http.post('/models', model);

    this.scheduleTraining = (model)=> $http.post('/models/train', model);

    this.delete = (model) => $http.delete('/models/'+ model.model_id);
}]);
