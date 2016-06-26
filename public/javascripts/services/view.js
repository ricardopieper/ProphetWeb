var app = angular.module('ProphetWeb');

app.service('ViewsService', ['$http', function ($http) {

    this.getAll = () => $http.get('/views').then(x => x.data);

    this.get = (id) => $http.get('/views/' + id).then(x => x.data);

    this.addToView = (conf) => $http.post('/views', conf);

    this.deletePrediction = (id, prediction) => $http.post('/views/' + id + '/deletepred', prediction);

    this.changeName = (id, name) => $http.post('/views/' + id + '/changename', { name: name });

}]);
