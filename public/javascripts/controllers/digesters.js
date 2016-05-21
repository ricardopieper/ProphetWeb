var app = angular.module('ProphetWeb');


app.controller('DigestersController',
    ['digester', 'listDigesters', 'DigestersService', '$state',
        function (digester, listDigesters, DigestersService, $state) {

            this.digester = digester || {};

            this.labelclass = digester.digester_id ? "active" : "";

            this.digesters = listDigesters;

            this.save = function () {
                if (digester.name || digester.name.length) {
                    DigestersService.save(digester);
                    Materialize.toast('Digester saved.', 4000);
                    $state.go('digesters.list', {}, { reload: true });
                } else {
                    Materialize.toast('You must enter the name.', 4000);
                }
            };

            this.askDelete = function (digester) {
                this.digesterToDelete = digester;
                $('#modalDelete').openModal();
            }

            this.confirmDelete = function () {
                DigestersService.delete(this.digesterToDelete);
                Materialize.toast('Digester deleted.', 4000)
                $('#modalDelete').closeModal();
                $state.go('digesters.list', {}, { reload: true });
                $state.reload();

            }

        }]);