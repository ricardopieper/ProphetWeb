var app = angular.module('ProphetWeb');


app.controller('PredictionsController',
    ['model', 'ModelsService', '$state', 'PredictionsService', '$stateParams',
        function (model, ModelsService, $state, PredictionsService, $stateParams) {

            this.labelclass = "";//"active";

            var dictVars = ModelsService.inputVars.reduce((prev, cur) => {
                prev[cur.value] = cur.desc;
                return prev;
            }, {});

            this.inputvars = model.inputvars.map(x => {
                return {
                    name: x,
                    desc: dictVars[x],
                    value: ''
                };
            });

            this.chart = {
                input: this.inputvars[0].name,
                predictions: 20,
                timevar: {
                    from: 1,
                    to: 100
                }
            };

            this.save = function () {
                //build the final object

                var fixedVars = this.inputvars
                    .filter(x => x.name != this.chart.input);

                var invalid = fixedVars
                    .filter(x => !x.value);

                if (invalid.length > 0) {
                    var allInvalids = invalid.map(x => x.desc)
                        .join(", ");

                    Materialize.toast('The following fields are invalid: ' + allInvalids, 10000)
                    return;
                } else {

                    if (!this.chart.input || !this.chart.input.length) {
                        Materialize.toast('Please select the time variable', 5000);
                        return;
                    }

                    if (!this.chart.predictions || this.chart.predictions > 150) {
                        Materialize.toast('Please enter the number of predictions, between 1 and 150', 5000);
                        return;
                    }

                    //afaik we are good to go
                    PredictionsService.save({
                        model_id: $stateParams.id,
                        prediction_id: null,
                        inputvar: this.chart.input,
                        amountpredictions: this.chart.predictions,
                        fromvalue: this.chart.timevar.from,
                        tovalue: this.chart.timevar.to,
                        inputvalues: fixedVars.reduce((prev, cur) => {
                            prev[cur.name] = cur.value;
                            return prev;
                        }, {}),
                        state: 0
                    }).then(function () {
                        Materialize.toast('The prediction will be performed soon. Check the model view to see the results.', 4000)
                        $state.go('models.list', {}, { reload: true });
                    });
                    
                }
            }
        }
    ]
);