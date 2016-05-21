var app = angular.module('ProphetWeb');


app.controller('EnginesController',
    ['engine', 'listEngines', 'EnginesService', '$state',
        function (engine, listEngines, EnginesService, $state) {

            this.engine = engine || {};

            this.labelclass = engine.engine_id ? "active" : "";

            this.engines = listEngines;

            this.save = function () {
                if (engine.name || engine.name.length) {
                    EnginesService.save(engine);
                    Materialize.toast('Engine saved.', 4000)
                    $state.go('engines.list', {}, { reload: true });
                } else {
                    Materialize.toast('You must enter the name.', 4000);
                }
            };

            this.askDelete = function (engine) {
                this.engineToDelete = engine;
                $('#modalDelete').openModal();
            }

            this.confirmDelete = function () {
                EnginesService.delete(this.engineToDelete);
                Materialize.toast('Engine deleted.', 4000)
                $('#modalDelete').closeModal();
                $state.go('engines.list', {}, { reload: true });
                $state.reload();
            }

        }]);