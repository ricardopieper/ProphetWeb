var app = angular.module('ProphetWeb');

app.service('UploadsService', ['$http', function ($http) {

    this.getAll = () => $http.get('/uploads').then(x => x.data);

}]);
