var app = angular.module('ProphetWeb');


app.controller('ModelsController',
    ['model', 'listModels', 'ModelsService', '$state', 'inputvars', 'outputvars',
     'listDigesters', 'listEngines',
        function (model, listModels, ModelsService, $state, inputvars, outputvars,
                  listDigesters, listEngines) {

            console.log("ModelsController");

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
                           
                           var digesterSelected = model.digester_id && model.digester_id.length;
                           var engineSelected = model.engine_id && model.engine_id.length;
                           
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

            this.setModelToTrain = function(model){
                this.modelToTrain = model;
                $('#modalTrain').openModal();
            }

            this.scheduleTraining = function() {
                ModelsService.scheduleTraining(this.modelToTrain);
                Materialize.toast('The model has been scheduled to be trained.', 4000)
            }
        }]);

app.directive('formUpload', [function(){
    return {
        link: function ($scope, element, attrs) {
            $(element).submit(function(){

                var formdata = new FormData(this);
                
                $.ajax({
                    url: $(element).attr("action"),
                    type: 'POST',
                    data: formdata,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if (data.ok){
                            $(element).closeModal();
                            console.log(data.ok);
                            Materialize.toast('File uploaded successfully. It will be processed soon.', 8000);
                        }else{
                            Materialize.toast('Error on file upload', 3000);
                            console.log(data);
                        $("#modalUpload").find("h4").text("Upload file ("+data.error.message+")");
			 }
                    }, 
                    error: function(jqXHR, textStatus, error){
                        Materialize.toast('Error on file upload', 3000);
                       
                        console.log(jqXHR, textStatus, error);
                    },
			xhr: function(){
			
				var myXhr = $.ajaxSettings.xhr();
				if (myXhr.upload){
					myXhr.upload.addEventListener('progress', function(e){
						if (e.lengthComputable){
							
							var max = e.total;
							var current = e.loaded;


							var percentage = (current * 100)/max;

							var strPercentage = percentage.toFixed(2) + "%";	
			

							$("#modalUpload").find("h4").text("Upload file ("+strPercentage+")");
						}
					}, false);
				}

				return myXhr;			

			}
                })
                return false;
            });
            
        }
    };
}]);
