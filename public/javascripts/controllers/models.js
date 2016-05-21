var app = angular.module('ProphetWeb');


app.controller('ModelsController',
    ['model', 'listModels', 'ModelsService', '$state',
        function (model, listModels, ModelsService, $state) {

            this.model = model || {};

            this.labelclass = model.model_id ? "active" : "";

            this.models = listModels;

            this.save = function () {
                ModelsService.save(model);
                Materialize.toast('Model saved.', 4000)
                $state.go('models.list', null, { reload: true });
            };

            this.askDelete = function (model) {
                this.modelToDelete = model;
                $('#modalDelete').openModal();
            }

            this.confirmDelete = function () {
                ModelsService.delete(this.modelToDelete);
                Materialize.toast('Model deleted.', 4000)
                $('#modalDelete').closeModal();
                $state.go('models.list', null, { reload: true });
                $state.reload();
            }

        }]);