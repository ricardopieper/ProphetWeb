var app = angular.module('ProphetWeb');


app.controller('ModelsController',
    ['model', 'listModels', 'ModelsService', '$state', 'inputvars', 'outputvars',
     'listDigesters', 'listEngines',
        function (model, listModels, ModelsService, $state, inputvars, outputvars,
                  listDigesters, listEngines) {

            this.labelclass = model.model_id ? "active" : "";

            this.models = listModels;

            this.inputvars = inputvars;
            
            this.outputvars = outputvars;
            
            this.digesters = listDigesters;
            
            this.engines = listEngines;
            
            this.model = model || {};
            
            if (!this.model.model_id)
            {
                this.model.outputvar = this.outputvars[0].value;   
                this.model.digester_id = null;
                this.model.engine_id = null;
            }
            this.save = function () {
                if (model.name && model.name.length) {
                    if (model.inputvars && model.inputvars.length){
                        if (model.outputvar && model.outputvar.length){
                           
                           var digesterSelected = model.digester_id != null;
                           var engineSelected = model.engine_id != null;
                           
                           if ((digesterSelected && engineSelected) || (!digesterSelected && !engineSelected)){
                                
                               Materialize.toast('You must select either a digester or an engine, and not both at once.', 4000);
                               
                            } else {
                            
                                ModelsService.save(model);
                                Materialize.toast('Model saved.', 4000)
                                $state.go('models.list', {}, { reload: true });
                            }
                        }else{
                            Materialize.toast('You must select an output variable.', 4000);
                        }
                    } else {
                        Materialize.toast('You must select one or more input variables.', 4000);
                    }
                } else { 
                    Materialize.toast('You must enter the name.', 4000);
                }
            };

            this.askUpload = function (model) {
                this.modelToUpload = model;
                $('#modalUpload').openModal();
            }


            this.askDelete = function (model) {
                this.modelToDelete = model;
                $('#modalDelete').openModal();
            }

            this.confirmDelete = function () {
                ModelsService.delete(this.modelToDelete);
                Materialize.toast('Model deleted.', 4000)
                $('#modalDelete').closeModal();
                $state.go('models.list', {}, { reload: true });
                $state.reload();
            }

        }]);