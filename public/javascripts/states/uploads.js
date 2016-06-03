var app = angular.module('ProphetWeb');

app.config(
    [
        '$stateProvider',
        function ($stateProvider) {

            $stateProvider.state('uploads', {
                abstract: true,
                url: '/uploads',
                templateUrl: '/templates/uploads/index.html',
            }).state('uploads.list', {
                templateUrl: '/templates/uploads/list.html',
                url: '/list',
                controller: "UploadsController",
                controllerAs: "vm",
                resolve: {
                    listUploads: ['UploadsService', function (UploadsService) {
                        return UploadsService.getAll().then(x=>{
                            if (x){
                                return x.map(y=>{
                                    var d = new Date(y.date);
                                    
                                    y.date = d.toLocaleDateString()+ " "+d.toLocaleTimeString();
                                    return y;
                                })
                            }
                            
                        });
                    }],
                }
            });
        }
    ]
);
