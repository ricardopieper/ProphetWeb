var app = angular.module('ProphetWeb');

app.service('DigestersService', ['$http', function ($http) {

    this.getAll = () => $http.get('/digesters').then(x => x.data);

    this.get = (id) => $http.get('/digesters/' + id).then(x => x.data);

    this.save = (digester) => $http.post('/digesters', digester);

    this.delete = (digester) =>
        $http.delete('/digesters/' + digester.digester_id);

}]);
