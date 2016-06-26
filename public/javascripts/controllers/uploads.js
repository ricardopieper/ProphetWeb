var app = angular.module('ProphetWeb');


app.controller('UploadsController',
    ['listUploads', 'UploadsService', '$state',
        function (listUploads, UploadsService, $state) {

            this.uploads = listUploads;
        }
    ]
);